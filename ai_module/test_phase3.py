import os
import sys
import unittest

AI_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(AI_DIR)
for p in [AI_DIR, PROJECT_ROOT]:
    if p not in sys.path:
        sys.path.insert(0, p)

from datasets.dataset_generator import generate_genomic_dataset
from preprocessing import DataPreprocessor
from train_model import train_and_save_models
from predict import predict
from evaluate import evaluate_models


class TestPhase3AIModule(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Ensure model is trained and saved
        train_and_save_models()

    def test_dataset_generator(self):
        df = generate_genomic_dataset(num_samples=100)
        self.assertEqual(len(df), 100)
        self.assertIn("mutation_type", df.columns)
        self.assertIn("gc_content_pct", df.columns)

    def test_prediction_wildtype(self):
        wildtype_features = {
            "sequence_length": 1000,
            "gc_content_pct": 52.0,
            "at_content_pct": 48.0,
            "base_counts": {"A": 240, "T": 240, "G": 260, "C": 260},
            "gc_at_ratio": 1.0833,
            "kmer_frequencies": {"ATC": 18, "TCG": 17},
            "unique_kmers_count": 60
        }
        res = predict(wildtype_features)
        self.assertIn("mutationDetected", res)
        self.assertIn("mutationType", res)
        self.assertIn("confidence", res)
        self.assertIn("riskLevel", res)
        self.assertIsInstance(res["confidence"], float)

    def test_prediction_mutation(self):
        snp_features = {
            "sequence_length": 1000,
            "gc_content_pct": 58.0,
            "at_content_pct": 42.0,
            "base_counts": {"A": 200, "T": 220, "G": 300, "C": 280},
            "gc_at_ratio": 1.38,
            "kmer_frequencies": {"GGG": 45, "CCC": 40},
            "unique_kmers_count": 45
        }
        res = predict(snp_features)
        self.assertIn("mutationDetected", res)
        self.assertGreater(res["confidence"], 50.0)

    def test_evaluate(self):
        eval_res = evaluate_models()
        self.assertGreater(eval_res["accuracy"], 0.85)


if __name__ == "__main__":
    unittest.main()
