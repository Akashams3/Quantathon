import os
import joblib
import pandas as pd
from sklearn.preprocessing import StandardScaler


class DataPreprocessor:
    """
    Handles feature normalization & scaler persistence for the AI Module.
    """

    def __init__(self):
        self.scaler = StandardScaler()

    def fit_transform(self, X: pd.DataFrame) -> pd.DataFrame:
        """Fits scaler and transforms feature matrix."""
        scaled_array = self.scaler.fit_transform(X)
        return pd.DataFrame(scaled_array, columns=X.columns)

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        """Transforms feature matrix using pre-fitted scaler."""
        scaled_array = self.scaler.transform(X)
        return pd.DataFrame(scaled_array, columns=X.columns)

    def save(self, path: str) -> None:
        """Saves scaler using Joblib."""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        joblib.dump(self.scaler, path)

    @classmethod
    def load(cls, path: str) -> "DataPreprocessor":
        """Loads fitted scaler from path using Joblib."""
        preprocessor = cls()
        preprocessor.scaler = joblib.load(path)
        return preprocessor
