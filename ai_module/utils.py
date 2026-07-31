import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np


def plot_feature_importances(feature_names, importances, save_path: str = None):
    """Generates bar chart of feature importances."""
    fig, ax = plt.subplots(figsize=(8, 5))
    indices = np.argsort(importances)[::-1]

    sorted_names = [feature_names[i] for i in indices]
    sorted_importances = importances[indices]

    ax.barh(sorted_names[::-1], sorted_importances[::-1], color="#3B82F6")
    ax.set_title("Random Forest Feature Importances", fontsize=12, fontweight="bold")
    ax.set_xlabel("Importance Score", fontsize=10)

    plt.tight_layout()
    if save_path:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        plt.savefig(save_path, dpi=300)
    plt.close(fig)


def plot_confusion_matrix_figure(conf_matrix, labels, save_path: str = None):
    """Plots confusion matrix heatmap."""
    fig, ax = plt.subplots(figsize=(7, 6))
    cax = ax.matshow(conf_matrix, cmap=plt.cm.Blues)
    fig.colorbar(cax)

    ax.set_xticks(range(len(labels)))
    ax.set_yticks(range(len(labels)))
    ax.set_xticklabels(labels, rotation=45, ha="left", fontsize=9)
    ax.set_yticklabels(labels, fontsize=9)

    for i in range(len(labels)):
        for j in range(len(labels)):
            ax.text(j, i, str(conf_matrix[i, j]), ha="center", va="center", color="red" if conf_matrix[i, j] > 10 else "black")

    ax.set_xlabel("Predicted Label", fontsize=11, fontweight="bold")
    ax.set_ylabel("True Label", fontsize=11, fontweight="bold")
    ax.set_title("Confusion Matrix", fontsize=12, fontweight="bold", pad=25)

    plt.tight_layout()
    if save_path:
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        plt.savefig(save_path, dpi=300)
    plt.close(fig)
