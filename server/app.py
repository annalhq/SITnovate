
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import tensorflow as tf
from transformers import BertTokenizer, TFBertForSequenceClassification
import numpy as np
import json
import os

app = Flask(__name__)

# ✅ Allow CORS explicitly for Next.js (localhost:3000)
CORS(app, resources={r"/predict": {"origins": ["http://localhost:*", "https://*.railway.app", "https://*.vercel.app"]}})

# Load Model & Tokenizer
MODEL_WEIGHTS_PATH = "my_model.h5"
TOKENIZER_PATH = "./"

try:
    tokenizer = BertTokenizer.from_pretrained(TOKENIZER_PATH)
    print("Tokenizer loaded successfully.")
except Exception as e:
    print(f"Error loading tokenizer: {e}")

try:
    with open("my_model_architecture.json", "r") as json_file:
        model_config = json.load(json_file)

    model = TFBertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2)
    model.load_weights(MODEL_WEIGHTS_PATH)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        text = data.get("text", "").strip()

        if not text:
            return jsonify({"error": "Empty text input"}), 400

        inputs = tokenizer(text, truncation=True, padding=True, return_tensors="tf")
        outputs = model(inputs)
        logits = outputs.logits
        probabilities = tf.nn.softmax(logits, axis=-1).numpy()[0]
        predicted_class = int(np.argmax(probabilities))

        return jsonify({
            "predicted_class": predicted_class,
            "probabilities": probabilities.tolist()
        })

    except Exception as e:
        return jsonify({"error": "Prediction failed", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8080)
