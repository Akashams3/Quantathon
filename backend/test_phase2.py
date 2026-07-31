import os
import sys
import unittest
import shutil

# Ensure backend directory is in sys.path
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)
for p in [BACKEND_DIR, PROJECT_ROOT]:
    if p not in sys.path:
        sys.path.insert(0, p)

from fastapi.testclient import TestClient
from app.main import backend_app
from app.config.database import Base, engine, SessionLocal
import app.models
from app.models.analysis import Analysis, NucleotideStatistics


class TestPhase2Backend(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        cls.client = TestClient(backend_app)

    @classmethod
    def tearDownClass(cls):
        # Clean up database sessions
        pass

    def setUp(self):
        self.sample_fasta_path = os.path.join(PROJECT_ROOT, "phase1", "datasets", "sample.fasta")

    def test_01_root_and_health(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertEqual(json_data["phase"], 2)

        health_resp = self.client.get("/api/health")
        self.assertEqual(health_resp.status_code, 200)
        self.assertTrue(health_resp.json()["database_connected"])

    def test_02_upload_file(self):
        with open(self.sample_fasta_path, "rb") as f:
            response = self.client.post(
                "/upload",
                files={"file": ("sample.fasta", f, "text/plain")}
            )

        self.assertEqual(response.status_code, 201)
        data = response.json()
        self.assertIn("analysis_id", data)
        self.assertEqual(data["filename"], "sample.fasta")
        self.assertEqual(data["status"], "Uploaded")

        # Save analysis_id for subsequent test steps
        TestPhase2Backend.uploaded_analysis_id = data["analysis_id"]

    def test_03_analyze_dna(self):
        analysis_id = getattr(TestPhase2Backend, "uploaded_analysis_id", 1)
        response = self.client.post(f"/analyze/{analysis_id}")
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data["analysis_id"], analysis_id)
        self.assertEqual(data["status"], "Completed")
        self.assertGreater(data["sequence_length"], 0)
        self.assertIn("base_counts", data)
        self.assertIn("A", data["base_counts"])

    def test_04_get_analysis_summary(self):
        analysis_id = getattr(TestPhase2Backend, "uploaded_analysis_id", 1)
        response = self.client.get(f"/analysis/{analysis_id}")
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data["analysisId"], analysis_id)
        self.assertEqual(data["filename"], "sample.fasta")
        self.assertEqual(data["status"], "Completed")

    def test_05_get_statistics(self):
        analysis_id = getattr(TestPhase2Backend, "uploaded_analysis_id", 1)
        response = self.client.get(f"/statistics/{analysis_id}")
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertIn("A", data)
        self.assertIn("T", data)
        self.assertIn("G", data)
        self.assertIn("C", data)
        self.assertIn("gcRatio", data)
        self.assertIn("atRatio", data)

    def test_06_list_analyses(self):
        response = self.client.get("/analyses")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

    def test_07_predict_mutation(self):
        analysis_id = getattr(TestPhase2Backend, "uploaded_analysis_id", 1)
        response = self.client.post(f"/predict/{analysis_id}")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("mutationDetected", data)
        self.assertIn("mutationType", data)
        self.assertIn("confidence", data)
        self.assertIn("riskLevel", data)
        self.assertEqual(data["analysisId"], analysis_id)

    def test_08_get_mutations(self):
        analysis_id = getattr(TestPhase2Backend, "uploaded_analysis_id", 1)
        response = self.client.get(f"/mutations/{analysis_id}")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["analysisId"], analysis_id)
        self.assertIn("mutationType", data)

    def test_09_quantum_analyze(self):
        analysis_id = getattr(TestPhase2Backend, "uploaded_analysis_id", 1)
        response = self.client.post(f"/quantum-analyze/{analysis_id}")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("quantumFidelity", data)
        self.assertIn("stateVector", data)
        self.assertIn("qubitsCount", data)
        self.assertEqual(data["analysisId"], analysis_id)


if __name__ == "__main__":
    unittest.main()
