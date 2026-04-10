from flask import render_template, request, jsonify
from app import app
from app.services.yolov8_service import analyze_image_base64
from app.services.llm_report_service import generate_report
from app.services.news_service import fetch_ag_news

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
