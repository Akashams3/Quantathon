import os
import joblib
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, precision_recall_fscore_support
from sklearn.model_selection import train_test_split

from feature_selection import FEATURE_COLUMNS
from preprocessing import DataPreprocessor


def evaluate_models():
    """
    Evaluates saved AI models on test dataset and prints metric metrics summary.
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(current_dir, "datasets", "genomic_mutations.csv")
    models_dir = os.path.join(current_dir, "saved_models")

    if not os.path.exists(dataset_path):
        raise FileNotFoundError("Dataset not found. Run dataset_generator.py first.")

    df = pd.read_csv(dataset_path)
    X = df[FEATURE_COLUMNS]
    y = df["mutation_type"]

    _, X_test, _, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    preprocessor = DataPreprocessor.load(os.path.join(models_dir, "scaler.pkl"))
    rf_model = joblib.load(os.path.join(models_dir, "mutation_model.pkl"))

    X_test_scaled = preprocessor.transform(X_test)
    y_pred = rf_model.predict(X_test_scaled)

    acc = accuracy_score(y_test, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average="weighted")
    conf_matrix = confusion_matrix(y_test, y_pred)

    print("=" * 50)
    print("        AI MODEL EVALUATION REPORT")
    print("=" * 50)
    print(f"Accuracy   : {acc * 100:.2f}%")
    print(f"Precision  : {precision * 100:.2f}%")
    print(f"Recall     : {recall * 100:.2f}%")
    print(f"F1-Score   : {f1 * 100:.2f}%")
    print("-" * 50)
    print("Classification Report:\n")
    print(classification_report(y_test, y_pred))
    print("-" * 50)
    print("Confusion Matrix:\n")
    print(pd.DataFrame(conf_matrix, index=rf_model.classes_, columns=rf_model.classes_))
    print("=" * 50)

    return {
        "accuracy": acc,
        "precision": precision,
        "recall": recall,
        "f1_score": f1,
        "confusion_matrix": conf_matrix
    }


if __name__ == "__main__":
    evaluate_models()
