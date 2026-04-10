import os
import requests
import json
import concurrent.futures

def generate_farmer_insight(title, description, api_key):
    """
    Calls Groq API to generate a 2-sentence farmer insight for a specific news article.
    """
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    system_prompt = "You are an expert Indian agronomist. Summarize this news for an Indian farmer. Explain exactly how it affects them or what action they should take. Use simple and helpful language. Output exactly 2 sentences."
    user_prompt = f"Title: {title}\nSummary: {description}"
    
    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.5,
        "max_tokens": 150
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=8)
        if response.status_code == 200:
            data = response.json()
            return data["choices"][0]["message"]["content"].strip()
        else:
            return "This news indicates shifting agricultural trends. Consult your local KVK for how it specifically applies to your region."
    except Exception:
        return "Stay updated on local market conditions and government schemes to make the most of emerging agricultural trends."


def fetch_ag_news():
    """
    Calls GNews API for Indian agricultural news and enriches it with Groq AI Farmer Insights.
    """
    gnews_key = os.environ.get("GNEWS_API_KEY")
    groq_key = os.environ.get("GROQ_API_KEY")
    
    if not gnews_key or not groq_key:
        return {"success": False, "error": "Missing GNEWS_API_KEY or GROQ_API_KEY in environment."}

    # GNews endpoint focused on India and specific ag constraints
    url = "https://gnews.io/api/v4/search"
    params = {
        "q": 'agriculture OR "Indian farmers" OR "MSP" OR "PM-Kisan" OR "Krishi"',
        "country": "in",
        "lang": "en",
        "max": 6, # Limited to 6 to keep LLM inference fast and concise
        "apikey": gnews_key,
        "expand": "content"
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        articles = data.get("articles", [])
        
        valid_articles = []
        for a in articles:
            if a.get("title") and a.get("url"):
                valid_articles.append({
                    "title": a.get("title", "Untitled"),
                    "description": a.get("description", "No description available."),
                    "url": a.get("url"),
                    "image": a.get("image"),
                    "publishedAt": a.get("publishedAt"),
                    "source": a.get("source", {}).get("name", "Unknown Source")
                })
                
        # Run Groq API calls in parallel
        def enrich_article(article):
            insight = generate_farmer_insight(article["title"], article["description"], groq_key)
            article["ai_insight"] = insight
            return article

        with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
            enriched_articles = list(executor.map(enrich_article, valid_articles))

        return {
            "success": True,
            "articles": enriched_articles
        }

    except requests.exceptions.Timeout:
        return {"success": False, "error": "The news API request timed out."}
    except requests.exceptions.RequestException as e:
        return {"success": False, "error": f"API Request failed: {str(e)}"}
    except Exception as e:
        return {"success": False, "error": f"An unexpected error occurred: {str(e)}"}
