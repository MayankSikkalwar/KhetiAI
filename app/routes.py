import os
from flask import render_template, request, jsonify
from app import app
from app.services.yolov8_service import analyze_image_base64
from app.services.llm_report_service import generate_report
from app.services.news_service import fetch_ag_news
from app.services.voice_assistant_service import generate_chat_response
import requests
import base64
from twilio.twiml.messaging_response import MessagingResponse

# ---------------------------------------------------------------------------
# WhatsApp Bot State Machine
# States: None → MENU shown | "CHAT_MODE" | "ANALYSIS_MODE"
# ---------------------------------------------------------------------------
user_states = {}

GREETING_MESSAGE = (
    "🌾 *Welcome to Kheti-AI!* 🌾\n\n"
    "How can I help you today?\n\n"
    "Reply *1️⃣* for 🤖 AI Chat Assistant\n"
    "_(Ask me anything about farming)_\n\n"
    "Reply *2️⃣* for 🔬 Crop Disease Analysis\n"
    "_(Send a photo of your diseased leaf)_"
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/analyze-image', methods=['POST'])
def analyze_image():
    if not request.is_json:
        return jsonify({"success": False, "error": "Request must be JSON"}), 400
        
    data = request.get_json()
    base64_img = data.get('image')
    
    if not base64_img:
        return jsonify({"success": False, "error": "No image data provided"}), 400
        
    result = analyze_image_base64(base64_img)
    return jsonify(result)

@app.route('/api/generate-report', methods=['POST'])
def generate_ai_report():
    if not request.is_json:
        return jsonify({"success": False, "error": "Request must be JSON"}), 400
        
    data = request.get_json()
    disease = data.get('disease')
    confidence = data.get('confidence')
    
    if not disease or confidence is None:
        return jsonify({"success": False, "error": "Missing disease or confidence data"}), 400
        
    result = generate_report(disease, float(confidence))
    return jsonify(result)

@app.route('/api/news', methods=['GET'])
def get_ag_news():
    result = fetch_ag_news()
    return jsonify(result)

mock_products = [
    {
        "id": "1",
        "name": "Hybrid Tomato Seeds",
        "category": "Seeds",
        "price": 120,
        "description": "High yield hybrid tomato seeds suitable for all climates.",
        "image": "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=400"
    },
    {
        "id": "2",
        "name": "Organic Neem Fertilizer",
        "category": "Fertilizers",
        "price": 450,
        "description": "100% organic neem cake fertilizer for soil enrichment and pest control.",
        "image": "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=400"
    },
    {
        "id": "3",
        "name": "Heavy Duty Pruning Shears",
        "category": "Tools",
        "price": 350,
        "description": "Carbon steel pruning shears with ergonomic grip.",
        "image": "https://images.unsplash.com/photo-1416879598056-f72381615b80?auto=format&fit=crop&q=80&w=400"
    },
    {
        "id": "4",
        "name": "Eco Bio-Pesticide",
        "category": "Pesticides",
        "price": 280,
        "description": "Eco-friendly natural spray to protect crops from aphids and mites.",
        "image": "https://images.unsplash.com/photo-1628186178335-e11fac5c92c8?auto=format&fit=crop&q=80&w=400"
    },
    {
        "id": "5",
        "name": "Premium Milling Wheat (Bulk)",
        "category": "Seeds",
        "price": "2500/quintal",
        "description": "High-protein wheat suitable for milling, ready for immediate bulk purchase. Min 50qt.",
        "image": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400",
        "isBulk": True
    }
]

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify({"success": True, "products": mock_products})

@app.route('/api/products/list', methods=['POST'])
def list_product():
    if not request.is_json:
        return jsonify({"success": False, "error": "Request must be JSON"}), 400
        
    data = request.get_json()
    name = data.get('name')
    category = data.get('category')
    price = data.get('price')
    description = data.get('description')
    
    if not all([name, category, price, description]):
        return jsonify({"success": False, "error": "Missing product details"}), 400
        
    new_product = {
        "id": str(len(mock_products) + 1),
        "name": name,
        "category": category,
        "price": price,
        "description": description,
        "image": data.get('image', None)
    }
    
    mock_products.insert(0, new_product)
    
    return jsonify({"success": True, "product": new_product})

@app.route('/api/chat', methods=['POST'])
def chat():
    if not request.is_json:
        return jsonify({"success": False, "error": "Request must be JSON"}), 400
        
    data = request.get_json()
    query = data.get('query')
    language = data.get('language', 'en')
    
    if not query:
        return jsonify({"success": False, "error": "Query is required"}), 400
        
    result = generate_chat_response(query, language)
    return jsonify(result)


# ---------------------------------------------------------------------------
# WhatsApp Webhook (Twilio)
# POST /api/whatsapp
# ---------------------------------------------------------------------------

def _format_report_for_whatsapp(report: dict) -> str:
    """
    Converts the structured JSON report from generate_report() into a
    human-readable, emoji-rich WhatsApp message.
    """
    diagnosis = report.get("diagnosis", {})
    organic_plan = report.get("organic_plan", {})
    chemical_plan = report.get("chemical_plan", {})
    prevention = report.get("prevention", {})
    support = report.get("local_support", [])

    lines = []

    # Header
    lines.append("🔬 *Kheti-AI Disease Report*")
    lines.append("─────────────────────────")

    # Diagnosis
    lines.append(f"\n🦠 *Disease:* {diagnosis.get('disease', 'N/A')}")
    lines.append(f"📊 *Confidence:* {diagnosis.get('confidence', 'N/A')}")
    
    # Summary - keep it short
    summary = diagnosis.get('summary', '')
    if len(summary) > 200:
        summary = summary[:197] + "..."
    lines.append(f"\n📝 *Summary:* {summary}")

    # Organic Plan - limit to 2 steps and short descriptions
    steps = organic_plan.get("steps", [])
    if steps:
        lines.append("\n\n🌿 *Organic Treatment:*")
        for i, step in enumerate(steps[:2], 1):
            title = step.get('title', '')
            action = step.get('action', '')
            lines.append(f"\n  {i}. *{title}*")
            lines.append(f"  ➤ {action}")

    # Chemical Plan
    fungicides = chemical_plan.get("fungicides", [])
    if fungicides:
        lines.append("\n\n⚗️ *Chemicals:* " + ", ".join(fungicides[:2]))

    # Prevention
    prev_strategies = prevention.get("strategies", [])
    if prev_strategies:
        lines.append("\n\n🛡️ *Prevention:*")
        for s in prev_strategies[:1]:
            lines.append(f"  • {s.get('action', s.get('title', ''))}")

    lines.append("\n─────────────────────────")
    lines.append("Type *menu* to go back.")

    return "\n".join(lines)


@app.route('/api/whatsapp', methods=['POST'])
def whatsapp_webhook():
    """
    Twilio WhatsApp webhook. Handles the state machine for the Kheti-AI bot.
    """
    sender = request.form.get('From', '')          # e.g. "whatsapp:+91XXXXXXXXXX"
    body = (request.form.get('Body') or '').strip().lower()
    media_url = request.form.get('MediaUrl0')      # Populated when user sends image

    resp = MessagingResponse()
    msg = resp.message()

    current_state = user_states.get(sender)

    # ── Reset to menu ────────────────────────────────────────────────────────
    if body == 'menu':
        user_states[sender] = None
        msg.body(GREETING_MESSAGE)
        return str(resp)

    # ── Initial greeting trigger ─────────────────────────────────────────────
    if body in ('hi', 'hii', 'hello'):
        user_states[sender] = None
        msg.body(GREETING_MESSAGE)
        return str(resp)

    # ── Option 1: Enter Chat Mode (only when at menu / no state) ─────────────
    if body == '1' and current_state is None:
        user_states[sender] = 'CHAT_MODE'
        msg.body(
            "🤖 *You are now connected to Kheti-AI Assistant!*\n\n"
            "Ask me your farming questions and I'll help you. 🌱\n\n"
            "_(Type *menu* anytime to go back)_"
        )
        return str(resp)

    # ── Option 2: Enter Analysis Mode (only when at menu / no state) ─────────
    if body == '2' and current_state is None:
        user_states[sender] = 'ANALYSIS_MODE'
        msg.body(
            "🔬 *Crop Disease Analysis Mode*\n\n"
            "Please upload a *clear, well-lit photo* of the diseased crop leaf. 📸\n\n"
            "Tips for a good photo:\n"
            "  • Fill the frame with the leaf\n"
            "  • Use natural daylight\n"
            "  • Keep the camera steady\n\n"
            "_(Type *menu* to go back)_"
        )
        return str(resp)

    # ── Unknown input at menu level → re-show greeting ────────────────────────
    if current_state is None:
        msg.body(GREETING_MESSAGE)
        return str(resp)

    # ── Chat Mode: forward messages to Groq LLM ───────────────────────────────
    if current_state == 'CHAT_MODE':
        if not body:
            msg.body("Please type your farming question. 🌾")
            return str(resp)

        result = generate_chat_response(body, language='en')
        if result.get('success'):
            reply = result['response']
            # Truncate to 1500 chars to respect WhatsApp's limits
            if len(reply) > 1500:
                reply = reply[:1497] + "..."
            msg.body(reply + "\n\n_(Type *menu* to go back)_")
        else:
            msg.body(f"⚠️ Sorry, I couldn't process your query right now.\nError: {result.get('error', 'Unknown error')}\n\nPlease try again.")
        return str(resp)

    # ── Analysis Mode: handle image ───────────────────────────────────────────
    if current_state == 'ANALYSIS_MODE':

        # -- User sent an image ---
        if media_url:
            try:
                # 1. Download the image from Twilio's CDN
                # Twilio often requires Basic Auth to download media.
                tw_sid = os.environ.get('TWILIO_ACCOUNT_SID')
                tw_token = os.environ.get('TWILIO_AUTH_TOKEN')
                
                auth = (tw_sid, tw_token) if tw_sid and tw_token else None
                image_response = requests.get(media_url, timeout=15, auth=auth)
                image_response.raise_for_status()

                # 2. Convert raw bytes → Base64 string
                image_base64 = base64.b64encode(image_response.content).decode('utf-8')

                # 3. Run YOLOv8 analysis
                msg.body("🔍 *Analysing your crop image…* Please wait a moment.")
                analysis_result = analyze_image_base64(image_base64)

                if not analysis_result.get('success'):
                    msg.body(
                        f"⚠️ I couldn't detect a disease in this image.\n"
                        f"Reason: {analysis_result.get('error', 'Unknown')}\n\n"
                        "Please try again with a clearer, closer photo of the leaf. 📸\n\n"
                        "_(Type *menu* to go back)_"
                    )
                    return str(resp)

                disease = analysis_result['disease']
                confidence = analysis_result['confidence']

                # 4. Generate Groq report
                report_result = generate_report(disease, confidence)

                if not report_result.get('success'):
                    # Still give basic info if report generation fails
                    msg.body(
                        f"🦠 *Disease Detected:* {disease.replace('___', ' → ').replace('_', ' ')}\n"
                        f"📊 *Confidence:* {confidence:.1%}\n\n"
                        f"⚠️ Could not generate detailed report: {report_result.get('error', 'Unknown')}\n\n"
                        "_(Type *menu* to go back)_"
                    )
                    return str(resp)

                # 5. Format and send the report
                formatted_report = _format_report_for_whatsapp(report_result['report'])
                
                # Safety truncate to 1550 chars for Twilio limits
                if len(formatted_report) > 1550:
                    formatted_report = formatted_report[:1547] + "..."
                
                msg.body(formatted_report)

                # Keep user in ANALYSIS_MODE so they can send another photo
                # They must type 'menu' to exit

            except requests.exceptions.Timeout:
                msg.body("⏱️ The image download timed out. Please check your connection and try again.")
            except requests.exceptions.RequestException as e:
                msg.body(f"⚠️ Failed to download your image: {str(e)}\n\nPlease try again.")
            except Exception as e:
                msg.body(f"⚠️ An unexpected error occurred: {str(e)}\n\nPlease try again.")

            return str(resp)

        # -- User sent text instead of an image ---
        else:
            msg.body(
                "📸 I'm waiting for a *photo* of the diseased leaf.\n\n"
                "Please send an image (not text) so I can analyse it.\n\n"
                "_(Type *menu* to go back to the main menu)_"
            )
            return str(resp)

    # ── Fallback ──────────────────────────────────────────────────────────────
    user_states[sender] = None
    msg.body(GREETING_MESSAGE)
    return str(resp)
