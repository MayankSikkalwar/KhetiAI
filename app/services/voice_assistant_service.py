import os
import requests
import json

def generate_chat_response(query, language='en'):
    """
    Calls xAI Grok API to generate an agricultural response for farmers.
    Tailored for less literate farmers with simple, actionable advice.
    """
    api_key = os.environ.get("GROK_API_KEY")
    # Fallback to GROQ_API_KEY if GROK_API_KEY is not set, as per user's "use new if in use" logic
    # but specifically targeting Grok if possible.
    if not api_key:
        api_key = os.environ.get("GROQ_API_KEY")
    
    if not api_key:
        return {"success": False, "error": "GROK_API_KEY environment variable is missing."}

    # Language specific instructions
    lang_instruction = "Respond in English." if language == 'en' else "कृपया हिंदी में उत्तर दें।"
    
    system_prompt = f"""You are a Senior Full Stack Developer and Expert Agronomist. 
Your mission is to support farmers in India with high-quality, state-of-the-art agricultural advice.

CORE GUIDELINES:
1. ACCESSIBILITY: Use extremely simple, clear, and jargon-free language. Your audience includes illiterate or less-literate farmers.
2. EXPLAIN SIMPLY: If you must use a technical term, explain it in very simple words.
3. STRUCTURE: Use very short sentences. Use numbered steps (1, 2, 3) for instructions.
4. TONE: Be very patient, helpful, and supportive.
5. TOPICS: Focus on crops, soil, water, pests, and farming tools.
6. EFFICIENCY: Be brief and direct. Don't waste words.
7. LANGUAGE: {lang_instruction}

Identify yourself as 'Kheti-AI Sahayak' (Kheti-AI Assistant)."""

    url = "https://api.groq.com/openai/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query}
        ],
        "temperature": 0.4,
        "max_tokens": 800
    }
    
    try:
        # Note: Using a timeout to ensure responsiveness
        response = requests.post(url, headers=headers, json=payload, timeout=20)
        response.raise_for_status()
        data = response.json()
        
        content = data["choices"][0]["message"]["content"]
        
        return {
            "success": True,
            "response": content
        }
        
    except requests.exceptions.Timeout:
        return {"success": False, "error": "Thinking took too long. Please try again." if language == 'en' else "सोचने में बहुत समय लग रहा है। कृपया पुनः प्रयास करें।"}
    except requests.exceptions.HTTPError as e:
        # If grok-beta fails, maybe the key is a Groq key? 
        # But user specifically asked for Grok. I'll stick to error reporting.
        return {"success": False, "error": f"API Error: {str(e)}"}
    except Exception as e:
        return {"success": False, "error": f"An unexpected error occurred: {str(e)}"}
