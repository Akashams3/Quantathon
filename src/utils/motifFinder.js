export const MotifFinder = {
  findMotifs(sequence, minLength = 3, maxLength = 6) {
    const seq = sequence.toUpperCase();
    const motifCounts = {};

    for (let k = minLength; k <= maxLength; k++) {
      for (let i = 0; i <= seq.length - k; i++) {
        const kmer = seq.substring(i, i + k);
        motifCounts[kmer] = (motifCounts[kmer] || 0) + 1;
      }
    }

    const result = [];
    for (const [motif, count] of Object.entries(motifCounts)) {
      if (count >= 2) {
        result.push({
          motif,
          length: motif.length,
          count,
          percentage: Number(((count * motif.length / seq.length) * 100).toFixed(1)),
          significance: this.evaluateMotifSignificance(motif, count)
        });
      }
    }

    result.sort((a, b) => b.count * b.length - a.count * a.length);

    return result.slice(0, 15);
  },

  evaluateMotifSignificance(motif, count) {
    if (motif === "CAG" || motif === "CTG") return "Trinucleotide Repeat Expansion Locus";
    if (motif === "TATA" || motif === "TATAAA") return "TATA Box Promoter Element";
    if (motif === "CCG" || motif === "CGC") return "CpG High-Density Region";
    if (motif === "AATAAA") return "Polyadenylation Signal Motif";
    if (count > 5) return "High-Frequency Microsatellite Element";
    return "Recurring Genomic Pattern";
  },

  alignSequences(seqA, seqB) {
    const a = seqA.toUpperCase();
    const b = seqB.toUpperCase();

    let alignA = "";
    let matchLine = "";
    let alignB = "";
    let matches = 0;
    let mismatches = 0;

    const len = Math.max(a.length, b.length);

    for (let i = 0; i < len; i++) {
      const charA = a[i] || "-";
      const charB = b[i] || "-";

      alignA += charA;
      alignB += charB;

      if (charA === charB) {
        matchLine += "|";
        matches++;
      } else if (charA === "-" || charB === "-") {
        matchLine += " ";
        mismatches++;
      } else {
        matchLine += "X";
        mismatches++;
      }
    }

    const similarity = Number(((matches / len) * 100).toFixed(2));

    return {
      alignA,
      matchLine,
      alignB,
      matches,
      mismatches,
      alignmentLength: len,
      similarityScore: similarity
    };
  }
};
