import os
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend for server/CLI chart rendering
import matplotlib.pyplot as plt
from typing import Dict, Any, List


class DNAVisualizer:
    """
    DNA Visualization Engine.
    Generates Matplotlib charts for base counts, nucleotide distributions, and k-mer frequencies.
    """

    @staticmethod
    def generate_all_charts(report: Dict[str, Any], output_dir: str) -> List[str]:
        """
        Generates base counts bar chart, distribution pie chart, and k-mer frequency chart.
        Returns paths to created chart PNG files.
        """
        os.makedirs(output_dir, exist_ok=True)
        chart_paths = []

        feat = report.get("features", {})
        seq_id = report.get("sequence_id", "seq")

        # 1. Base Counts Bar Chart
        bar_chart_path = os.path.join(output_dir, f"{seq_id}_base_counts.png")
        DNAVisualizer.plot_base_counts(feat.get("base_counts", {}), seq_id, bar_chart_path)
        chart_paths.append(bar_chart_path)

        # 2. Nucleotide Distribution Pie/Donut Chart
        pie_chart_path = os.path.join(output_dir, f"{seq_id}_distribution_pie.png")
        DNAVisualizer.plot_distribution_pie(feat.get("nucleotide_distribution_pct", {}), seq_id, pie_chart_path)
        chart_paths.append(pie_chart_path)

        # 3. K-mer Frequency Bar Chart
        kmer_chart_path = os.path.join(output_dir, f"{seq_id}_kmer_frequencies.png")
        DNAVisualizer.plot_kmer_frequencies(feat.get("kmer_frequencies", {}), seq_id, kmer_chart_path)
        chart_paths.append(kmer_chart_path)

        return chart_paths

    @staticmethod
    def plot_base_counts(base_counts: Dict[str, int], seq_id: str, save_path: str) -> None:
        """Plots bar chart of A, T, G, C counts."""
        fig, ax = plt.subplots(figsize=(7, 5))
        bases = ["A", "T", "G", "C"]
        counts = [base_counts.get(b, 0) for b in bases]
        colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B"]  # Blue, Red, Green, Yellow-Orange

        bars = ax.bar(bases, counts, color=colors, width=0.55, edgecolor="#1F2937", linewidth=1.2)
        
        # Add labels on top of bars
        for bar in bars:
            height = bar.get_height()
            ax.annotate(f"{height:,}",
                        xy=(bar.get_x() + bar.get_width() / 2, height),
                        xytext=(0, 4),
                        textcoords="offset points",
                        ha="center", va="bottom", fontsize=10, fontweight="bold")

        ax.set_title(f"Nucleotide Base Counts ({seq_id})", fontsize=13, fontweight="bold", pad=15)
        ax.set_xlabel("Nucleotide Base", fontsize=11, fontweight="bold")
        ax.set_ylabel("Count", fontsize=11, fontweight="bold")
        ax.grid(axis="y", linestyle="--", alpha=0.5)
        ax.set_axisbelow(True)

        plt.tight_layout()
        plt.savefig(save_path, dpi=300)
        plt.close(fig)

    @staticmethod
    def plot_distribution_pie(dist_pct: Dict[str, float], seq_id: str, save_path: str) -> None:
        """Plots pie/donut chart of nucleotide distribution percentages."""
        fig, ax = plt.subplots(figsize=(6, 6))
        bases = ["A", "T", "G", "C"]
        percentages = [dist_pct.get(b, 0.0) for b in bases]
        colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B"]

        wedges, texts, autotexts = ax.pie(
            percentages,
            labels=bases,
            autopct="%1.1f%%",
            startangle=140,
            colors=colors,
            pctdistance=0.75,
            textprops=dict(fontsize=11, fontweight="bold"),
            wedgeprops=dict(width=0.4, edgecolor="white", linewidth=2)
        )

        for autotext in autotexts:
            autotext.set_color("black")

        ax.set_title(f"Nucleotide Distribution ({seq_id})", fontsize=13, fontweight="bold", pad=15)
        plt.tight_layout()
        plt.savefig(save_path, dpi=300)
        plt.close(fig)

    @staticmethod
    def plot_kmer_frequencies(kmer_freqs: Dict[str, int], seq_id: str, save_path: str, top_n: int = 10) -> None:
        """Plots bar chart of top N k-mer frequencies."""
        fig, ax = plt.subplots(figsize=(9, 5))
        
        top_kmers = list(kmer_freqs.items())[:top_n]
        if not top_kmers:
            plt.close(fig)
            return

        labels, values = zip(*top_kmers)

        bars = ax.bar(labels, values, color="#8B5CF6", edgecolor="#4C1D95", width=0.6)

        for bar in bars:
            height = bar.get_height()
            ax.annotate(f"{height}",
                        xy=(bar.get_x() + bar.get_width() / 2, height),
                        xytext=(0, 3),
                        textcoords="offset points",
                        ha="center", va="bottom", fontsize=9)

        ax.set_title(f"Top {top_n} K-mer Frequencies ({seq_id})", fontsize=13, fontweight="bold", pad=15)
        ax.set_xlabel("K-mer Pattern", fontsize=11, fontweight="bold")
        ax.set_ylabel("Frequency", fontsize=11, fontweight="bold")
        ax.grid(axis="y", linestyle="--", alpha=0.4)
        ax.set_axisbelow(True)

        plt.tight_layout()
        plt.savefig(save_path, dpi=300)
        plt.close(fig)
