"""
Test consistency of crop recommendation predictions
"""
import pickle
import numpy as np

# Load the model
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

# Your exact input
input_data = np.array([[90, 42, 43, 20.87974371, 82.00274423, 6.502985292, 202.9355362]])

print("Testing prediction consistency...")
print(f"Input: N=90, P=42, K=43, Temp=20.88, Humidity=82.0, pH=6.5, Rainfall=202.94")
print("\n")

# Run prediction 5 times
for i in range(5):
    prediction = model.predict(input_data)[0]
    probabilities = model.predict_proba(input_data)[0]
    
    # Get top 5
    top_indices = np.argsort(probabilities)[-5:][::-1]
    
    print(f"Run {i+1}:")
    print(f"  Top prediction: {prediction}")
    for idx in top_indices:
        crop_name = model.classes_[idx]
        confidence = probabilities[idx] * 100
        print(f"    {crop_name}: {confidence:.2f}%")
    print()
