import base64
import numpy as np
import cv2
from ultralytics import YOLO
import os

# Load model
MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../models/best.pt'))
try:
    model = YOLO(MODEL_PATH)
except Exception as e:
    print("Error loading YOLO model:", e)
    model = None

def analyze_image_base64(base64_str):
    if not model:
        return {"success": False, "error": "Model not loaded properly"}
    
    try:
        # Strip data header if present (e.g. data:image/jpeg;base64,...)
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]
            
        img_bytes = base64.b64decode(base64_str)
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Predict
        results = model.predict(img)
        res = results[0]
        
        if hasattr(res, 'probs') and res.probs is not None:
            # Classification
            top1_idx = res.probs.top1
            conf = res.probs.top1conf.item()
            class_name = res.names[top1_idx]
            return {
                "success": True,
                "disease": class_name,
                "confidence": conf
            }
        elif hasattr(res, 'boxes') and res.boxes is not None and len(res.boxes) > 0:
            # Object Detection
            # Just take the first box
            box = res.boxes[0]
            cls_id = int(box.cls[0].item())
            conf = float(box.conf[0].item())
            class_name = res.names[cls_id]
            return {
                "success": True,
                "disease": class_name,
                "confidence": conf
            }
        else:
            return {
                "success": False,
                "error": "No disease could be detected in this image"
            }
            
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"success": False, "error": str(e)}
