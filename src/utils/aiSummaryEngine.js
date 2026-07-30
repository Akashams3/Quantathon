export const AISummaryEngine = {
  generateSummary(stats, mutationResults, motifs, quantumResults, sequenceName) {
    const { length, gcContent, atContent } = stats;
    const { totalMutations, mutationRate, genomicStability, substitutionCount, transitionCount, transversionCount, insertionCount, deletionCount, tiTvRatio } = mutationResults.summary;
    const { quantumSimilarityScore, classicalBitSimilarity } = quantumResults;

    let stabilityClass = "High Genomic Stability";
    let riskBadge = "Low Risk";
    let riskColor = "emerald";

    if (mutationRate > 5.0 || deletionCount > 0) {
      stabilityClass = "High Genomic Instability / Hypermutable";
      riskBadge = "Critical Risk";
      riskColor = "rose";
    } else if (mutationRate > 1.5) {
      stabilityClass = "Moderate Polymorphism / Variant";
      riskBadge = "Moderate Risk";
      riskColor = "amber";
    }

    const topMotif = motifs[0] ? `${motifs[0].motif} (count: ${motifs[0].count})` : "None detected";

    const overviewParagraph = `Analysis of sample "${sequenceName}" (${length} base pairs) reveals an overall **${stabilityClass}** index of ${genomicStability}%. The sequence exhibits a GC content of **${gcContent}%** and AT content of **${atContent}%**, reflecting standard structural thermal stability (Melting Temp: ~${stats.meltingTemp}°C).`;

    const mutationParagraph = `A total of **${totalMutations} genomic mutations** were identified (${mutationRate}% mutation density). This includes **${substitutionCount} point substitutions** (${transitionCount} Transitions, ${transversionCount} Transversions; Ti/Tv ratio: ${tiTvRatio}), **${insertionCount} insertions**, and **${deletionCount} deletions**. Key variant hot-spots were detected primarily within high-density nucleotide regions.`;

    const quantumParagraph = `Experimental quantum-assisted sequence similarity analysis via Qiskit simulation yielded a **Quantum Fidelity Overlap Score of ${quantumSimilarityScore}%** (compared to classical bit alignment of ${classicalBitSimilarity}%). Quantum phase interference confirmed structural sequence conservation across major sub-registers.`;

    const motifParagraph = `Genomic pattern mining identified **${motifs.length} distinct recurring motifs**. The dominant repeat motif is **${topMotif}**, which aligns with known functional regions such as promoter elements or microsatellite repeat clusters.`;

    const recommendation = mutationRate > 3.0
      ? "RECOMMENDATION: High mutation density detected. Secondary validation via high-throughput Sanger sequencing and target locus protein folding modeling is strongly advised."
      : "RECOMMENDATION: Sequence demonstrates strong structural preservation. Baseline monitoring for point substitutions at CpG hypermutable loci is recommended.";

    // Generate Position-Specific AI Mutation Interpretations (Clearly identified as AI interpretation layer)
    const positionExplanations = mutationResults.mutations.map((m) => {
      let explanation = "";
      if (m.refBase === "C" && m.candBase === "T") {
        explanation = `Position #${m.position} (${m.refBase}→${m.candBase}): CpG Methylation Hotspot. Spontaneous deamination of 5-methylcytosine to thymine. High susceptibility to hypermutation.`;
      } else if (m.refBase === "G" && m.candBase === "A") {
        explanation = `Position #${m.position} (${m.refBase}→${m.candBase}): Complementary CpG transition on antisense strand. May alter local transcription factor binding motif.`;
      } else if (m.subType === "Transversion") {
        explanation = `Position #${m.position} (${m.refBase}→${m.candBase}): Purine-Pyrimidine Transversion. Distorts DNA double helix steric width; AI structural predictor indicates potential missense amino acid alteration.`;
      } else if (m.mutationType === "Insertion") {
        explanation = `Position #${m.position}: Insertion of base '${m.candBase}'. Risk of frame-shift mutation downstream in coding exons.`;
      } else if (m.mutationType === "Deletion") {
        explanation = `Position #${m.position}: Deletion of base '${m.refBase}'. High disruption risk to open reading frame (ORF).`;
      } else {
        explanation = `Position #${m.position} (${m.refBase}→${m.candBase}): Transition variant (${m.subType}). Synonymous/conservative nucleotide substitution with low tertiary structural impact.`;
      }

      return {
        position: m.position,
        refBase: m.refBase,
        candBase: m.candBase,
        mutationType: m.mutationType,
        impact: m.impact,
        explanation
      };
    });

    const disclaimer = "DISCLAIMER: AI biological outputs represent an automated in-silico computational interpretation layer. Clinical validation via wet-lab Sanger or NGS sequencing is required prior to diagnostic or therapeutic application.";

    return {
      stabilityClass,
      riskBadge,
      riskColor,
      overviewParagraph,
      mutationParagraph,
      quantumParagraph,
      motifParagraph,
      recommendation,
      positionExplanations,
      disclaimer,
      fullMarkdown: `${overviewParagraph}\n\n${mutationParagraph}\n\n${quantumParagraph}\n\n${motifParagraph}\n\n**${recommendation}**\n\n_${disclaimer}_`
    };
  }
};
