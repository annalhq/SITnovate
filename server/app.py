from flask import Flask, request, jsonify
from flask_cors import CORS  # Import the CORS function
import tensorflow as tf
from transformers import BertTokenizer, TFBertForSequenceClassification
import numpy as np
import json
import os

app = Flask(__name__)

# Enable CORS globally for all routes
CORS(app)

# Define file paths
MODEL_WEIGHTS_PATH = "my_model.h5"
TOKENIZER_PATH = "./"  # Use './tokenizer' if files are in a folder named 'tokenizer'

# Load the tokenizer correctly
try:
    tokenizer = BertTokenizer.from_pretrained(TOKENIZER_PATH)
    print("Tokenizer loaded successfully.")
except Exception as e:
    print(f"Error loading tokenizer: {e}")

# Load the model architecture
try:
    with open("my_model_architecture.json", "r") as json_file:
        model_config = json.load(json_file)
    
    model = TFBertForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2)
    model.load_weights(MODEL_WEIGHTS_PATH)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")

# Function to predict spam
def predict_spam(text, model, tokenizer):
    if not text.strip():  # Handle empty text input
        return 0, [1.0, 0.0]  # Default to class 0 with 100% probability
    
    inputs = tokenizer(text, truncation=True, padding=True, return_tensors="tf")
    outputs = model(inputs)
    logits = outputs.logits
    probabilities = tf.nn.softmax(logits, axis=-1).numpy()[0]
    predicted_class = np.argmax(probabilities)
    
    return predicted_class, probabilities

# Define the prediction API route
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        text = data.get("text", "").strip()

        if not text:
            return jsonify({"
