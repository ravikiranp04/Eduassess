from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torchvision.transforms as T
from PIL import Image
from transformers import DetrImageProcessor, DetrForObjectDetection

app = Flask(__name__)
CORS(app)  # Allow React & Express to communicate with Flask

# Load DETR model **once**
processor = DetrImageProcessor.from_pretrained("facebook/detr-resnet-50")
model = DetrForObjectDetection.from_pretrained("facebook/detr-resnet-50")

@app.route("/detect", methods=["POST"])
def detect_objects():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = Image.open(request.files["image"])
    
    # Preprocess and detect objects
    inputs = processor(images=image, return_tensors="pt")
    outputs = model(**inputs)

    # Post-process detections
    target_sizes = torch.tensor([image.size])
    results = processor.post_process_object_detection(outputs, target_sizes=target_sizes, threshold=0.9)[0]

     # Extract only labels
    labels = [model.config.id2label[label.item()] for label in results["labels"]]

    print("📸 Detected Labels:", labels) 
    return jsonify(labels)  


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
