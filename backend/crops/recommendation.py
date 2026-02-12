"""
Crop Recommendation System
This module contains the logic for recommending crops based on soil and climate parameters.
"""

import pickle
import numpy as np
from pathlib import Path
from django.conf import settings
from .models import Crop


class CropRecommendationEngine:
    """
    Main class for crop recommendation logic using trained Random Forest model.
    """
    
    def __init__(self):
        """Initialize the recommendation engine and load the ML model"""
        self.model = None
        self.load_model()
    
    def load_model(self):
        """Load the trained Random Forest model"""
        try:
            model_path = Path(settings.BASE_DIR) / 'model.pkl'
            with open(model_path, 'rb') as file:
                self.model = pickle.load(file)
            print(f"✓ Crop recommendation model loaded successfully from {model_path}")
        except FileNotFoundError:
            print("⚠ Warning: model.pkl not found. Using rule-based recommendations.")
            self.model = None
        except Exception as e:
            print(f"⚠ Error loading model: {e}. Using rule-based recommendations.")
            self.model = None
    
    def recommend_crops(self, nitrogen, phosphorus, potassium, temperature, 
                       humidity, ph, rainfall, state=None):
        """
        Recommend crops based on input parameters.
        
        Parameters:
        -----------
        nitrogen : int
            Nitrogen content in soil (kg/acre)
        phosphorus : int
            Phosphorus content in soil (kg/acre)
        potassium : int
            Potassium content in soil (kg/acre)
        temperature : float
            Average temperature (°C)
        humidity : float
            Average humidity (%)
        ph : float
            Soil pH value
        rainfall : float
            Average rainfall (mm)
        state : str, optional
            State name for region-specific recommendations
        
        Returns:
        --------
        list : List of recommended crops with scores
        """
        
        # Use ML model if available, otherwise fall back to rule-based
        if self.model is not None:
            try:
                recommended_crops = self._ml_based_recommendation(
                    nitrogen, phosphorus, potassium, temperature, 
                    humidity, ph, rainfall
                )
            except Exception as e:
                print(f"⚠ ML prediction error: {e}. Falling back to rule-based.")
                recommended_crops = self._rule_based_recommendation(
                    nitrogen, phosphorus, potassium, temperature, 
                    humidity, ph, rainfall
                )
        else:
            recommended_crops = self._rule_based_recommendation(
                nitrogen, phosphorus, potassium, temperature, 
                humidity, ph, rainfall
            )
        
        return recommended_crops
    
    def _rule_based_recommendation(self, nitrogen, phosphorus, potassium, 
                                   temperature, humidity, ph, rainfall):
        """
        Simple rule-based recommendation system.
        Filters crops based on their requirements.
        """
        # Query crops that match the conditions
        suitable_crops = Crop.objects.filter(
            ph_min__lte=ph,
            ph_max__gte=ph,
            temp_min__lte=temperature,
            temp_max__gte=temperature,
            rainfall_min__lte=rainfall,
            rainfall_max__gte=rainfall,
        )
        
        recommended_crops = []
        
        for crop in suitable_crops:
            # Calculate suitability score based on NPK match
            npk_score = self._calculate_npk_score(
                crop, nitrogen, phosphorus, potassium
            )
            
            recommended_crops.append({
                'crop_id': crop.id,
                'crop_name': crop.name,
                'season': crop.season,
                'duration_days': crop.duration_days,
                'suitability_score': npk_score,
                'water_requirement': crop.water_requirement,
            })
        
        # Sort by suitability score (highest first)
        recommended_crops.sort(key=lambda x: x['suitability_score'], reverse=True)
        
        # Return top 5 recommendations
        return recommended_crops[:5]
    
    def _calculate_npk_score(self, crop, nitrogen, phosphorus, potassium):
        """
        Calculate how well the soil NPK matches crop requirements.
        Returns a score from 0 to 100.
        """
        # Calculate percentage match for each nutrient
        n_ratio = min(nitrogen / crop.nitrogen_requirement, 1.5) if crop.nitrogen_requirement > 0 else 1
        p_ratio = min(phosphorus / crop.phosphorus_requirement, 1.5) if crop.phosphorus_requirement > 0 else 1
        k_ratio = min(potassium / crop.potassium_requirement, 1.5) if crop.potassium_requirement > 0 else 1
        
        # Penalize if nutrients are too low
        n_score = 100 if n_ratio >= 0.8 else n_ratio * 125
        p_score = 100 if p_ratio >= 0.8 else p_ratio * 125
        k_score = 100 if k_ratio >= 0.8 else k_ratio * 125
        
        # Average score
        avg_score = (n_score + p_score + k_score) / 3
         using trained Random Forest model.
        """
        # Prepare input features in the same order as training: N, P, K, temp, humidity, ph, rainfall
        features = np.array([[nitrogen, phosphorus, potassium, 
                             temperature, humidity, ph, rainfall]])
        
        # Get prediction and probabilities
        prediction = self.model.predict(features)[0]
        probabilities = self.model.predict_proba(features)[0]
        
        # Get top 5 predictions (highest probabilities)
        top_indices = np.argsort(probabilities)[-5:][::-1]
        
        recommended_crops = []
        for idx in top_indices:
            crop_name = self.model.classes_[idx]
            confidence = probabilities[idx] * 100
            
            # Only include if confidence is reasonable (> 5%)
            if confidence < 5:
                continue
            
            recommended_crops.append({
                'crop_name': crop_name,
                'suitability_score': round(confidence, 2),
                'confidence': round(confidence, 2),
                'prediction_method': 'ml_model'
            })
        
        return recommended_crops
                continue
        
        return recommended_crops
        """
        
        # Placeholder - implement your ML model here
        raise NotImplementedError("ML-based recommendation not implemented yet")


# Create a singleton instance
recommendation_engine = CropRecommendationEngine()


def get_crop_recommendations(nitrogen, phosphorus, potassium, temperature,
                            humidity, ph, rainfall, state=None):
    """
    Convenience function to get crop recommendations.
    Use this in your views.
    """
    return recommendation_engine.recommend_crops(
        nitrogen, phosphorus, potassium, temperature,
        humidity, ph, rainfall, state
    )
