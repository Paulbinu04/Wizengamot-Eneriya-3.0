from flask import Flask, request, render_template, flash
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Needed for flashing messages

# Load the trained model
model = joblib.load('best_food_wastage_model.pkl')

# Load the preprocessor if using ANN model
try:
    preprocessor = joblib.load('best_food_wastage_preprocessor.pkl')
except:
    preprocessor = None

# Define the feature names
feature_names = [
    'Type of Food', 'Number of Guests', 'Event Type', 'Quantity of Food',
    'Storage Conditions', 'Purchase History', 'Seasonality', 'Preparation Method',
    'Geographical Location', 'Pricing'
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Get form data
    features = [request.form.get(name) for name in feature_names]

    # Check if any field is missing
    if None in features or '' in features:
        flash('Please fill out all fields before submitting.')
        return render_template('index.html',prediction_text=f'Please fill out all fields before Predicting.')

    features = np.array(features).reshape(1, -1)

    # Convert to DataFrame with appropriate column names
    features_df = pd.DataFrame(features, columns=feature_names)

    # Preprocess the input if using ANN model
    if preprocessor:
        features_df = preprocessor.transform(features_df)

    # Predict the food wastage amount
    prediction = model.predict(features_df)
    output = round(prediction[0], 2)

    return render_template('index.html', prediction_text=f'Predicted Food Wastage Amount: {output} units')

if __name__ == "__main__":
    app.run(debug=True)