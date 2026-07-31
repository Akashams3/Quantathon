import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.metrics import classification_report, accuracy_score

from datasets.dataset_generator import generate_genomic_dataset
from feature_selection import FEATURE_COLUMNS
from preprocessing import DataPreprocessor


def train_and_save_models():
    """
    Trains Random Forest Classifier and Isolation Forest models on genomic features.
    Saves trained models and scaler into saved_models/ directory.
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(current_dir, "datasets", "genomic_mutations.csv")
    saved_models_dir = os.path.join(current_dir, "saved_models")
    os.makedirs(saved_models_dir, exist_ok=True)

    # 1. Load or generate dataset
    if not os.path.exists(dataset_path):
        print("Dataset not found. Generating synthetic genomic dataset...")
        df = generate_genomic_dataset(num_samples=1200, output_path=dataset_path)
    else:
        df = pd.read_csv(dataset_path)

    X = df[FEATURE_COLUMNS]
    y = df["mutation_type"]

    # 2. Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # 3. Fit preprocessor & scale features
    preprocessor = DataPreprocessor()
    X_train_scaled = preprocessor.fit_transform(X_train)
    X_test_scaled = preprocessor.transform(X_test)

    # Save scaler
    scaler_path = os.path.join(saved_models_dir, "scaler.pkl")
    preprocessor.save(scaler_path)

    # 4. Train Random Forest Classifier
    rf_model = RandomForestClassifier(
        n_estimators=150,
        max_depth=12,
        random_state=42,
        class_weight="balanced"
    )
    rf_model.fit(X_train_scaled, y_train)

    # Evaluate Random Forest
    y_pred = rf_model.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)
    print(f"\n[OK] Random Forest Model Accuracy: {acc * 100:.2f}%\n")
    print(classification_report(y_test, y_pred))

    # Save Random Forest model
    rf_path = os.path.join(saved_models_dir, "mutation_model.pkl")
    joblib.dump(rf_model, rf_path)

    # 5. Train Isolation Forest for Anomaly Detection
    iso_model = IsolationForest(
        n_estimators=100,
        contamination=0.25,
        random_state=42
    )
    iso_model.fit(X_train_scaled)

    # Save Isolation Forest model
    iso_path = os.path.join(saved_models_dir, "anomaly_model.pkl")
    joblib.dump(iso_model, iso_path)

    print(f"Models successfully saved to {saved_models_dir}:")
    print(f"  - Random Forest  : {rf_path}")
    print(f"  - IsolationForest: {iso_path}")
    print(f"  - Scaler         : {scaler_path}")

    return {
        "accuracy": acc,
        "mutation_model": rf_path,
        "anomaly_model": iso_path,
        "scaler": scaler_path
    }


if __name__ == "__main__":
    train_and_save_models()
