#!/usr/bin/env python
# coding: utf-8

# # Import Required Libraries
# Import necessary libraries such as pandas, numpy, scikit-learn, and TensorFlow.

# In[10]:


# Import necessary libraries
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.svm import SVR
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.optimizers import Adam
import joblib


# # Load and Explore the Dataset
# Load the dataset from the CSV file and perform initial exploration to understand the data.

# In[12]:


# Load the dataset
data = pd.read_csv(r'D:\PROJECTS\AA HACKATHONS\Eneriya 3.0\Wizengamot-Eneriya\datasavr\food_wastage_data.csv')

# Display the first few rows of the dataset
print(data.head())

# Display the data types of each column
print(data.dtypes)

# Display unique values in each column
for column in data.columns:
    print(f"Unique values in {column}: {data[column].unique()}")

# Display the correlation matrix for numeric columns
print(data.select_dtypes(include=[np.number]).corr())


# # Preprocess the Data
# Handle missing values, encode categorical variables, and normalize numerical features.

# In[14]:


# Preprocess the data
X = data.drop('Wastage Food Amount', axis=1)
y = data['Wastage Food Amount']


# # Feature Engineering
# Create new features if necessary and prepare the data for modeling.

# In[15]:


# One-hot encode categorical features
categorical_features = X.select_dtypes(include=['object']).columns
numerical_features = X.select_dtypes(include=['int64', 'float64']).columns

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_features),
        ('cat', OneHotEncoder(), categorical_features)
    ])


# # Split the Data into Training and Testing Sets
# Split the dataset into training and testing sets using train_test_split from scikit-learn.

# In[16]:


# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define the models to evaluate
models = {
    'Linear Regression': LinearRegression(),
    'Random Forest': RandomForestRegressor(),
    'Support Vector Regressor': SVR()
}


# # Train and Evaluate Different Algorithms
# Train and evaluate multiple algorithms including Linear Regression, Random Forest Regressor, Support Vector Regressor, and Artificial Neural Network (ANN).

# In[17]:


# Train and evaluate the models
results = {}
for name, model in models.items():
    pipeline = Pipeline(steps=[('preprocessor', preprocessor), ('model', model)])
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    results[name] = mse
    print(f'{name} MSE: {mse}')

# Train and evaluate the ANN model separately
X_train_preprocessed = preprocessor.fit_transform(X_train)
X_test_preprocessed = preprocessor.transform(X_test)

ann_model = Sequential()
ann_model.add(Dense(64, input_dim=X_train_preprocessed.shape[1], activation='relu'))
ann_model.add(Dense(32, activation='relu'))
ann_model.add(Dense(1))
ann_model.compile(optimizer=Adam(learning_rate=0.01), loss='mean_squared_error')

ann_model.fit(X_train_preprocessed, y_train, epochs=100, batch_size=10, verbose=0)
y_pred_ann = ann_model.predict(X_test_preprocessed)
mse_ann = mean_squared_error(y_test, y_pred_ann)
results['Artificial Neural Network'] = mse_ann
print(f'Artificial Neural Network MSE: {mse_ann}')


# # Select the Best Model
# Compare the performance of different models and select the one with the best score.

# In[19]:


# Display the score of each model
for name, mse in results.items():
    print(f'{name} Test MSE: {mse}')

# Select the best model
best_model_name = min(results, key=results.get)
print(f'Best model: {best_model_name}')


# # Train the Final Model
# Train the selected model on the entire training dataset and evaluate its performance on the testing set.

# In[21]:


# Train the final model
if best_model_name == 'Artificial Neural Network':
    final_model = ann_model
    final_preprocessor = preprocessor
else:
    final_model = models[best_model_name]
    final_pipeline = Pipeline(steps=[('preprocessor', preprocessor), ('model', final_model)])
    final_pipeline.fit(X, y)
final_pipeline


# # Save the Model
# Save the trained model to a file using joblib or a similar library.

# In[23]:


# Save the model
if best_model_name == 'Artificial Neural Network':
    joblib.dump(final_preprocessor, 'best_food_wastage_preprocessor.pkl')
    ann_model.save('best_food_wastage_ann_model.h5')
else:
    joblib.dump(final_pipeline, 'best_food_wastage_model.pkl')

# Display the test score of the best model
if best_model_name == 'Artificial Neural Network':
    test_score = ann_model.evaluate(X_test_preprocessed, y_test, verbose=0)
else:
    test_score = final_pipeline.score(X_test, y_test)
print(f'Test score of the best model ({best_model_name}): {test_score}')


# In[24]:


from sklearn.metrics import r2_score


# In[27]:


r2 = r2_score(y_test, y_pred)
print(f'R^2 Score: {r2}')


# In[34]:


final_pipeline.score(X_test,y_test)


# In[ ]:




