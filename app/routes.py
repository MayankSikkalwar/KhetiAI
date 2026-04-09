from flask import render_template, request, jsonify
from app import app
from app.services.yolov8_service import analyze_image_base64

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

