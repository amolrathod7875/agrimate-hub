"""
Plant Disease Prediction System
This module contains the logic for predicting plant diseases from images using trained CNN model.
"""

import numpy as np
from pathlib import Path
from django.conf import settings
from PIL import Image
import io


class DiseasePredictionEngine:
    """
    Main class for disease prediction logic using trained TensorFlow/Keras model.
    """
    
    def __init__(self):
        """Initialize the prediction engine and load the CNN model"""
        self.model = None
        self.class_names = None
        self.img_size = (224, 224)  # Standard image size for most plant disease models
        self.load_model()
    
    def load_model(self):
        """Load the trained TensorFlow/Keras model"""
        try:
            import tensorflow as tf
            from tensorflow import keras
            
            model_path = Path(settings.BASE_DIR) / 'plant_disease_model.h5'
            
            # Try loading with custom_objects to handle compatibility issues
            try:
                self.model = keras.models.load_model(str(model_path), compile=False)
            except Exception as e1:
                # Try alternative loading method
                try:
                    # Load weights separately if model architecture issue
                    self.model = keras.models.load_model(str(model_path))
                except Exception as e2:
                    print(f"⚠ Could not load model with standard methods: {e1}")
                    print(f"   Alternative method also failed: {e2}")
                    print("   Please re-save your model with: model.save('plant_disease_model.h5', save_format='h5')")
                    self.model = None
                    return
            
            # Recompile the model
            if self.model:
                self.model.compile(
                    optimizer='adam',
                    loss='categorical_crossentropy',
                    metrics=['accuracy']
                )
            
            # Define class names (update this list based on your model's training classes)
            # These are common plant diseases from PlantVillage dataset
            self.class_names = [
                'Apple___Apple_scab',
                'Apple___Black_rot',
                'Apple___Cedar_apple_rust',
                'Apple___healthy',
                'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
                'Corn_(maize)___Common_rust_',
                'Corn_(maize)___Northern_Leaf_Blight',
                'Corn_(maize)___healthy',
                'Grape___Black_rot',
                'Grape___Esca_(Black_Measles)',
                'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
                'Grape___healthy',
                'Potato___Early_blight',
                'Potato___Late_blight',
                'Potato___healthy',
                'Rice___Brown_Spot',
                'Rice___Leaf_Blast',
                'Rice___Neck_Blast',
                'Rice___healthy',
                'Tomato___Bacterial_spot',
                'Tomato___Early_blight',
                'Tomato___Late_blight',
                'Tomato___Leaf_Mold',
                'Tomato___Septoria_leaf_spot',
                'Tomato___Spider_mites Two-spotted_spider_mite',
                'Tomato___Target_Spot',
                'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
                'Tomato___Tomato_mosaic_virus',
                'Tomato___healthy',
                'Wheat___Brown_rust',
                'Wheat___Yellow_rust',
                'Wheat___healthy',
            ]
            
            print(f"✓ Disease prediction model loaded successfully from {model_path}")
            print(f"  Model expects input shape: {self.model.input_shape}")
            print(f"  Number of classes: {len(self.class_names)}")
        except ImportError:
            print("⚠ Warning: TensorFlow not installed. Disease prediction will not work.")
            self.model = None
        except FileNotFoundError:
            print("⚠ Warning: plant_disease_model.h5 not found.")
            self.model = None
        except Exception as e:
            print(f"⚠ Error loading disease model: {e}")
            self.model = None
    
    def preprocess_image(self, image_file):
        """
        Preprocess the uploaded image for model prediction.
        
        Parameters:
        -----------
        image_file : File object
            Uploaded image file
        
        Returns:
        --------
        numpy.ndarray : Preprocessed image array
        """
        try:
            # Open image
            img = Image.open(image_file)
            
            # Convert to RGB if necessary
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize to model's expected input size
            img = img.resize(self.img_size)
            
            # Convert to numpy array
            img_array = np.array(img)
            
            # Normalize pixel values to [0, 1]
            img_array = img_array.astype('float32') / 255.0
            
            # Add batch dimension
            img_array = np.expand_dims(img_array, axis=0)
            
            return img_array
        except Exception as e:
            raise ValueError(f"Error preprocessing image: {e}")
    
    def predict_disease(self, image_file, top_k=3):
        """
        Predict plant disease from uploaded image.
        
        Parameters:
        -----------
        image_file : File object
            Uploaded plant image
        top_k : int
            Number of top predictions to return
        
        Returns:
        --------
        dict : Prediction results with disease names and confidence scores
        """
        if self.model is None:
            return {
                'error': 'Disease prediction model not available',
                'predictions': []
            }
        
        try:
            # Preprocess image
            img_array = self.preprocess_image(image_file)
            
            # Make prediction
            predictions = self.model.predict(img_array, verbose=0)[0]
            
            # Get top k predictions
            top_indices = np.argsort(predictions)[-top_k:][::-1]
            
            results = []
            for idx in top_indices:
                class_name = self.class_names[idx] if idx < len(self.class_names) else f"Class_{idx}"
                confidence = float(predictions[idx]) * 100
                
                # Parse class name to extract crop and disease
                parts = class_name.split('___')
                crop_name = parts[0].replace('_', ' ')
                disease_name = parts[1].replace('_', ' ') if len(parts) > 1 else 'Unknown'
                
                results.append({
                    'crop': crop_name,
                    'disease': disease_name,
                    'confidence': round(confidence, 2),
                    'is_healthy': 'healthy' in disease_name.lower(),
                })
            
            # Get the top prediction
            top_prediction = results[0]
            
            return {
                'success': True,
                'top_prediction': top_prediction,
                'all_predictions': results,
                'model_info': {
                    'input_shape': str(self.model.input_shape),
                    'num_classes': len(self.class_names)
                }
            }
        
        except Exception as e:
            return {
                'error': str(e),
                'predictions': []
            }
    
    def get_treatment_recommendation(self, disease_name, crop_name):
        """
        Get treatment recommendations for detected disease.
        This can be enhanced with a database lookup.
        
        Parameters:
        -----------
        disease_name : str
            Name of the detected disease
        crop_name : str
            Name of the affected crop
        
        Returns:
        --------
        dict : Treatment recommendations
        """
        # Basic treatment recommendations (can be moved to database)
        treatments = {
            'Apple scab': {
                'treatment': 'Apply fungicides like Captan or Mancozeb. Remove infected leaves.',
                'prevention': 'Ensure good air circulation, avoid overhead watering.'
            },
            'Black rot': {
                'treatment': 'Prune infected parts, apply copper-based fungicides.',
                'prevention': 'Remove mummified fruits, maintain proper sanitation.'
            },
            'Late blight': {
                'treatment': 'Apply Mancozeb or Chlorothalonil fungicides immediately.',
                'prevention': 'Use resistant varieties, ensure proper spacing for air circulation.'
            },
            'Early blight': {
                'treatment': 'Apply Azoxystrobin or Chlorothalonil fungicides.',
                'prevention': 'Crop rotation, remove infected plant debris.'
            },
            'Leaf Blast': {
                'treatment': 'Apply Tricyclazole or Azoxystrobin fungicides.',
                'prevention': 'Use disease-free seeds, balanced fertilization.'
            },
            'Brown Spot': {
                'treatment': 'Apply Mancozeb or Copper oxychloride.',
                'prevention': 'Proper water management, use resistant varieties.'
            },
        }
        
        return treatments.get(disease_name, {
            'treatment': 'Consult local agricultural expert for specific treatment.',
            'prevention': 'Maintain good agricultural practices and crop hygiene.'
        })


# Create a singleton instance
disease_prediction_engine = DiseasePredictionEngine()


def predict_plant_disease(image_file, top_k=3):
    """
    Convenience function to predict plant disease.
    Use this in your views.
    """
    return disease_prediction_engine.predict_disease(image_file, top_k)
