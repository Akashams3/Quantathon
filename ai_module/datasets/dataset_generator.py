import os
import numpy as np
import pandas as pd


def generate_genomic_dataset(num_samples: int = 1200, output_path: str = None) -> pd.DataFrame:
    """
    Generates a realistic synthetic genomic mutation dataset for training
    mutation classification models (Random Forest, SVM, Isolation Forest).
    """
    np.random.seed(42)

    mutation_types = [
        "Wildtype",
        "Single Nucleotide Polymorphism",
        "Insertion",
        "Deletion",
        "Frameshift Mutation"
    ]
    
    mutation_probs = [0.35, 0.25, 0.15, 0.15, 0.10]
    classes = np.random.choice(mutation_types, size=num_samples, p=mutation_probs)

    data = []

    for mutation in classes:
        # Base template sequence length around 1000 bases
        base_len = int(np.random.normal(loc=1000, scale=30))

        if mutation == "Wildtype":
            seq_len = base_len
            gc_content = np.random.normal(loc=52.0, scale=2.0)
            at_content = 100.0 - gc_content
            # Balanced A, T, G, C
            g_count = int((gc_content / 200.0) * seq_len)
            c_count = int((gc_content / 200.0) * seq_len)
            a_count = int((at_content / 200.0) * seq_len)
            t_count = seq_len - (g_count + c_count + a_count)
            top_kmer_freq = int(np.random.normal(loc=18, scale=3))
            unique_kmers = int(np.random.normal(loc=60, scale=2))
            is_anomaly = 0
            risk_level = "Low"

        elif mutation == "Single Nucleotide Polymorphism":
            seq_len = base_len
            gc_content = np.random.normal(loc=56.0, scale=3.0)
            at_content = 100.0 - gc_content
            g_count = int((gc_content / 200.0) * seq_len) + np.random.randint(5, 15)
            c_count = int((gc_content / 200.0) * seq_len) - np.random.randint(5, 15)
            a_count = int((at_content / 200.0) * seq_len)
            t_count = seq_len - (g_count + c_count + a_count)
            top_kmer_freq = int(np.random.normal(loc=28, scale=4))
            unique_kmers = int(np.random.normal(loc=58, scale=3))
            is_anomaly = 1
            risk_level = "Medium"

        elif mutation == "Insertion":
            seq_len = base_len + np.random.randint(50, 150)
            gc_content = np.random.normal(loc=48.0, scale=4.0)
            at_content = 100.0 - gc_content
            a_count = int((at_content / 190.0) * seq_len)
            t_count = int((at_content / 210.0) * seq_len)
            g_count = int((gc_content / 200.0) * seq_len)
            c_count = seq_len - (a_count + t_count + g_count)
            top_kmer_freq = int(np.random.normal(loc=35, scale=5))
            unique_kmers = int(np.random.normal(loc=63, scale=2))
            is_anomaly = 1
            risk_level = "Medium"

        elif mutation == "Deletion":
            seq_len = max(500, base_len - np.random.randint(50, 150))
            gc_content = np.random.normal(loc=45.0, scale=4.0)
            at_content = 100.0 - gc_content
            g_count = int((gc_content / 200.0) * seq_len)
            c_count = int((gc_content / 200.0) * seq_len)
            a_count = int((at_content / 200.0) * seq_len)
            t_count = seq_len - (g_count + c_count + a_count)
            top_kmer_freq = int(np.random.normal(loc=24, scale=4))
            unique_kmers = int(np.random.normal(loc=50, scale=4))
            is_anomaly = 1
            risk_level = "High"

        else:  # Frameshift Mutation
            seq_len = base_len + np.random.choice([-2, -1, 1, 2])
            gc_content = np.random.normal(loc=60.0, scale=5.0)
            at_content = 100.0 - gc_content
            g_count = int((gc_content / 180.0) * seq_len)
            c_count = int((gc_content / 220.0) * seq_len)
            a_count = int((at_content / 200.0) * seq_len)
            t_count = seq_len - (g_count + c_count + a_count)
            top_kmer_freq = int(np.random.normal(loc=45, scale=6))
            unique_kmers = int(np.random.normal(loc=45, scale=5))
            is_anomaly = 1
            risk_level = "Critical"

        gc_ratio = round((g_count + c_count) / max(1, a_count + t_count), 4)

        data.append({
            "sequence_length": seq_len,
            "gc_content_pct": round(gc_content, 2),
            "at_content_pct": round(at_content, 2),
            "a_count": a_count,
            "t_count": t_count,
            "g_count": g_count,
            "c_count": c_count,
            "gc_at_ratio": gc_ratio,
            "top_kmer_freq": top_kmer_freq,
            "unique_kmers_count": unique_kmers,
            "is_anomaly": is_anomaly,
            "risk_level": risk_level,
            "mutation_type": mutation
        })

    df = pd.DataFrame(data)

    if output_path:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        df.to_csv(output_path, index=False)
        print(f"Genomic dataset saved to {output_path} ({len(df)} samples)")

    return df


if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    output_file = os.path.join(current_dir, "genomic_mutations.csv")
    generate_genomic_dataset(num_samples=1200, output_path=output_file)
