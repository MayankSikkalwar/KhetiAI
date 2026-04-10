from flask import render_template, request, jsonify
from app import app
from app.services.yolov8_service import analyze_image_base64
from app.services.llm_report_service import generate_report
from app.services.news_service import fetch_ag_news
from app.services.voice_assistant_service import generate_chat_response

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
