import os
import requests
import json

def parse_disease_string(disease_str):
    """
    Parses a YOLO class name like 'Apple___Apple_scab' into crop and disease.
    """
    if "___" in disease_str:
        parts = disease_str.split("___")
        crop = parts[0].replace("_", " ")
        disease = parts[1].replace("_", " ")
        return crop, disease
    return "Unknown Crop", disease_str.replace("_", " ")

def generate_report(disease_str, confidence):
    """
    Calls Groq's API to generate a structured agronomic report.
    Returns a Python dictionary parsed from the JSON response.
    """
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        return {"success": False, "error": "GROQ_API_KEY environment variable is missing."}
        
    crop, disease_name = parse_disease_string(disease_str)
    
    # Prompt Setup
    system_prompt = f"""You are an expert agronomist and plant pathologist working in India. 
Your task is to provide a highly detailed, actionable agronomist-style report for a farmer 
who has uploaded a crop image. The AI vision model has provided the following detection:

Crop Type: {crop}
Disease Identified: {disease_name}
AI Confidence Score: {confidence:.2%}

Your response MUST be exclusively in valid JSON format matching the schema below.
Do not wrap it in markdown block quotes. Return raw JSON.

Output JSON Schema:
{{
  "diagnosis": {{
    "disease": "string",
    "confidence": "string (e.g., 85%)",
    "analysis": "string (Detailed explanation of the disease, why it occurs, and secondary symptoms)",
    "summary": "string (Short, clear summary for the farmer)"
  }},
  "organic_plan": {{
    "steps": [
      {{
        "title": "string (e.g., Sanitation (Critical First Step))",
        "action": "string (Bold action term, e.g., Immediately remove all infected leaves)",
        "description": "string (Detailed instruction)"
      }}
    ]
  }},
  "chemical_plan": {{
    "fungicides": ["string", "string"],
    "instructions": ["string", "string"],
    "warnings": ["string"]
  }},
  "prevention": {{
    "strategies": [
      {{
        "title": "string",
        "action": "string",
        "description": "string"
      }}
    ]
  }},
  "local_support": [
    {{
      "title": "string",
      "description": "string (Relevant bodies like KVKs or State Agricultural Universities)"
    }}
  ]
}}

Guidelines:
- If the confidence is below 70%, add a disclaimer about uncertainty.
- Write naturally but use professional agronomy terminology.
- Tailor standard treatments specifically to {crop} farming in Indian climates (like monsoon conditions).
"""

    url = "https://api.groq.com/openai/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": "Please generate the comprehensive agronomy report JSON."}
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.5,
        "max_tokens": 1500
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        # Extract the content text string containing the JSON
        content = data["choices"][0]["message"]["content"]
        
        # Parse it as a dictionary
        parsed_json = json.loads(content)
        
        return {
            "success": True,
            "report": parsed_json
        }
        
    except requests.exceptions.Timeout:
        return {"success": False, "error": "The LLM request timed out. Please try again."}
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": f"API Request failed: {str(e)}"}
    except json.JSONDecodeError:
        return {"success": False, "error": "Failed to parse the LLM response into valid JSON."}
    except Exception as e:
        return {"success": False, "error": f"An unexpected error occurred: {str(e)}"}
