import os
import sys
import unittest
import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

# Internal service imports
from services.reader import DNAReader
from services.validator import DNAValidator
from services.cleaner import DNACleaner
from services.feature_extractor import DNAFeatureExtractor
from services.analyzer import DNAAnalyzer
from services.visualizer import DNAVisualizer
from services.exporter import DNAExporter
from main import process_dna_file, process_raw_sequence, DATASETS_DIR


class TestPhase1DNAProcessing(unittest.TestCase):

    def setUp(self):
        self.test_output_dir = os.path.join(BASE_DIR, "test_output")
        self.test_charts_dir = os.path.join(self.test_output_dir, "charts")
        self.test_reports_dir = os.path.join(self.test_output_dir, "reports")
        os.makedirs(self.test_charts_dir, exist_ok=True)
        os.makedirs(self.test_reports_dir, exist_ok=True)

        self.valid_seq = "ATGGCCCTGTGGATGCGCCTCCTGCCCCTGCTGGCGCTGCTGGCCCTCTGGGGACCTGAC"
        self.dirty_seq = "atgg ccct \n NNN XXYY \n ggcg ctgc"

    def tearDown(self):
        if os.path.exists(self.test_output_dir):
            shutil.rmtree(self.test_output_dir, ignore_errors=True)

    def test_reader_fasta(self):
        sample_fasta = os.path.join(DATASETS_DIR, "sample.fasta")
        records = DNAReader.read_file(sample_fasta)
        self.assertTrue(len(records) >= 1)
        self.assertEqual(records[0]["format"], "fasta")
        self.assertIn("ATGGCCCT", records[0]["sequence"])

    def test_reader_string(self):
        record = DNAReader.read_string(self.valid_seq, sequence_id="TestSeq")
        self.assertEqual(record["sequence_id"], "TestSeq")
        self.assertEqual(record["sequence"], self.valid_seq)

    def test_validator_valid(self):
        result = DNAValidator.validate(self.valid_seq)
        self.assertTrue(result["is_valid"])
        self.assertEqual(result["invalid_total_count"], 0)
        self.assertIn("[OK] Valid DNA", result["status_message"])

    def test_validator_invalid(self):
        result = DNAValidator.validate("ATCGNNXXYYZZ")
        self.assertFalse(result["is_valid"])
        self.assertGreater(result["invalid_total_count"], 0)
        self.assertIn("N", result["invalid_characters"])
        self.assertIn("X", result["invalid_characters"])

    def test_cleaner(self):
        cleaned_result = DNACleaner.clean_sequence(self.dirty_seq)
        cleaned = cleaned_result["cleaned_sequence"]
        self.assertTrue(all(c in {"A", "T", "G", "C"} for c in cleaned))
        self.assertEqual(cleaned, "ATGGCCCTGGCGCTGC")
        self.assertGreater(cleaned_result["removed_characters_count"], 0)

    def test_feature_extractor(self):
        seq = "ATCGATCG"  # Length 8: A=2, T=2, G=2, C=2
        features = DNAFeatureExtractor.extract_features(seq, k=3)
        self.assertEqual(features["sequence_length"], 8)
        self.assertEqual(features["gc_content_pct"], 50.0)
        self.assertEqual(features["at_content_pct"], 50.0)
        self.assertEqual(features["gc_at_ratio"], 1.0)
        self.assertEqual(features["base_counts"]["A"], 2)
        self.assertEqual(features["base_counts"]["G"], 2)
        
        # Check 3-mers for "ATCGATCG": ATC (2), TCG (2), CGA (1), GAT (1)
        kmers = features["kmer_frequencies"]
        self.assertEqual(kmers["ATC"], 2)
        self.assertEqual(kmers["TCG"], 2)
        self.assertEqual(kmers["CGA"], 1)

    def test_analyzer_summary(self):
        record = DNAReader.read_string(self.valid_seq, sequence_id="SeqSummaryTest")
        report = DNAAnalyzer.analyze_record(record, k_mer_size=3)
        summary = DNAAnalyzer.generate_text_summary(report)

        self.assertIn("DNA ANALYSIS REPORT", summary)
        self.assertIn("Sequence ID      : SeqSummaryTest", summary)
        self.assertEqual(report["status"], "Ready for AI & Quantum Analysis")

    def test_visualizer_and_exporter(self):
        record = DNAReader.read_string(self.valid_seq, sequence_id="VisExpTest")
        report = DNAAnalyzer.analyze_record(record, k_mer_size=3)

        chart_paths = DNAVisualizer.generate_all_charts(report, self.test_charts_dir)
        self.assertEqual(len(chart_paths), 3)
        for path in chart_paths:
            self.assertTrue(os.path.exists(path))
            self.assertGreater(os.path.getsize(path), 0)

        export_paths = DNAExporter.export_all(report, self.test_reports_dir)
        for key, path in export_paths.items():
            self.assertTrue(os.path.exists(path))
            self.assertGreater(os.path.getsize(path), 0)

    def test_full_pipeline_cli_and_raw(self):
        # Process sample fasta
        sample_fasta = os.path.join(DATASETS_DIR, "sample.fasta")
        report_file = process_dna_file(sample_fasta, k_mer_size=3)
        self.assertEqual(report_file["status"], "Ready for AI & Quantum Analysis")
        self.assertTrue(len(report_file["chart_files"]) == 3)

        # Process raw string
        report_raw = process_raw_sequence(self.valid_seq, sequence_id="RawPipelineTest", k_mer_size=3)
        self.assertEqual(report_raw["status"], "Ready for AI & Quantum Analysis")
        self.assertEqual(report_raw["features"]["sequence_length"], len(self.valid_seq))


if __name__ == "__main__":
    unittest.main()
