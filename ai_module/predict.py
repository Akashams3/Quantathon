import os
import sys
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any

# Ensure ai_module path is in sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from feature_selection import extract_feature_vector
from preprocessing import DataPreprocessor


class MutationPredictor:
    """
    AI Prediction Engine for genomic mutation classification and confidence scoring.
    """

    def __init__(self, models_dir: str = None):
        if not models_dir:
            models_dir = os.path.join(CURRENT_DIR, "saved_models")

        scaler_path = os.path.join(models_dir, "scaler.pkl")
        model_path = os.path.join(models_dir, "mutation_model.pkl")
        anomaly_path = os.path.join(models_dir, "anomaly_model.pkl")

        if not (os.path.exists(scaler_path) and os.path.exists(model_path)):
            # Auto-train models if missing
            from train_model import train_and_save_models
            train_and_save_models()

        self.preprocessor = DataPreprocessor.load(scaler_path)
        self.mutation_model = joblib.load(model_path)
        self.anomaly_model = joblib.load(anomaly_path) if os.path.exists(anomaly_path) else None

        # Risk mapping table
        self.risk_mapping = {
            "Wildtype": "Low",
            "Single Nucleotide Polymorphism": "Medium",
            "Insertion": "Medium",
            "Deletion": "High",
            "Frameshift Mutation": "Critical"
        }

    def predict_mutation(self, features_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes ML prediction on input features extracted from DNA processing engine.
        
        Returns:
            dict containing:
                - mutationDetected (bool)
                - mutationType (str)
                - confidence (float)
                - riskLevel (str)
                - isAnomaly (bool)
        """
        # 1. Feature Extraction & Scaling
        X_df = extract_feature_vector(features_dict)
        X_scaled = self.preprocessor.transform(X_df)

        # 2. Random Forest Prediction & Probabilities
        prediction_class = self.mutation_model.predict(X_scaled)[0]
        probabilities = self.mutation_model.predict_proba(X_scaled)[0]
        max_probability = float(np.max(probabilities))

        # Calculate confidence score (percentage rounded to 1 decimal place)
        confidence_pct = round(max_probability * 100.0, 1)

        # 3. Anomaly Forest Check
        is_anomaly = False
        if self.anomaly_model:
            anomaly_pred = self.anomaly_model.predict(X_scaled)[0]
            is_anomaly = (anomaly_pred == -1)

        # 4. Mutation Detection Flag & Risk Level
        mutation_detected = (prediction_class != "Wildtype")
        risk_level = self.risk_mapping.get(prediction_class, "Medium")

        if is_anomaly and risk_level == "Low":
            risk_level = "Medium"

        return {
            "mutationDetected": mutation_detected,
            "mutationType": str(prediction_class),
            "confidence": confidence_pct,
            "riskLevel": risk_level,
            "isAnomaly": is_anomaly
        }


# Singleton predictor instance for efficient model reuse
_predictor_instance = None


def get_predictor() -> MutationPredictor:
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = MutationPredictor()
    return _predictor_instance


def predict(features_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Convenience helper function for making AI predictions."""
    predictor = get_predictor()
    return predictor.predict_mutation(features_dict)
