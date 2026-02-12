import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

# 1. Load the dataset
print("Loading dataset...")
try:
    df = pd.read_csv('Crop_recommendation.csv')
except FileNotFoundError:
    print("Error: 'Crop_recommendation.csv' not found. Please download it and place it in this folder.")
    exit()

# 2. Separate Features (Soil data) and Target (Crop Name)
X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = df['label']

# 3. Split into training and testing data (80% for training, 20% for testing)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 4. Train the Random Forest Model
print("Training the model (this might take a few seconds)...")
model = RandomForestClassifier(n_estimators=20, random_state=42)
model.fit(X_train, y_train)

# 5. Test accuracy
accuracy = model.score(X_test, y_test)
print(f"Model Trained! Accuracy: {accuracy * 100:.2f}%")

# 6. Save the trained model to a file
with open('model.pkl', 'wb') as file:
    pickle.dump(model, file)

print("Model saved as 'model.pkl'. Ready to use!")