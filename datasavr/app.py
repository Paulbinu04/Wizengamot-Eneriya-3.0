from flask import Flask, request, render_template
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)

# Load the trained model
model = joblib.load('best_food_wastage_model.pkl')

# Load the preprocessor if using ANN model
try:
    preprocessor = joblib.load('best_food_wastage_preprocessor.pkl')
except:
    preprocessor = None







