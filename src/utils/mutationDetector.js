export const MutationDetector = {
  detectMutations(refSeq, candSeq) {
    const ref = refSeq.toUpperCase();
    const cand = candSeq.toUpperCase();
    const minLen = Math.min(ref.length, cand.length);
    const maxLen = Math.max(ref.length, cand.length);

    const mutations = [];
    let transitionCount = 0;
    let transversionCount = 0;
    let substitutionCount = 0;
    let insertionCount = 0;
    let deletionCount = 0;

    const isTransition = (b1, b2) => {
      const purines = ["A", "G"];
      const pyrimidines = ["C", "T"];
      return (purines.includes(b1) && purines.includes(b2)) ||
             (pyrimidines.includes(b1) && pyrimidines.includes(b2));
    };

    for (let i = 0; i < minLen; i++) {
      const r = ref[i];
      const c = cand[i];

      if (r !== c) {
        substitutionCount++;
        const type = isTransition(r, c) ? "Transition" : "Transversion";
        if (type === "Transition") transitionCount++;
        else transversionCount++;

        mutations.push({
          position: i + 1,
          refBase: r,
          candBase: c,
          mutationType: "Substitution",
          subType: type,
          impact: this.assessMutationImpact(i + 1, r, c),
          description: `Substitution ${r} → ${c} at position ${i + 1}`
        });
      }
    }

    if (cand.length > ref.length) {
      for (let i = minLen; i < cand.length; i++) {
        insertionCount++;
        mutations.push({
          position: i + 1,
          refBase: "-",
          candBase: cand[i],
          mutationType: "Insertion",
          subType: "Insertion",
          impact: "Medium",
          description: `Insertion of ${cand[i]} at tail position ${i + 1}`
        });
      }
    } else if (ref.length > cand.length) {
      for (let i = minLen; i < ref.length; i++) {
        deletionCount++;
        mutations.push({
          position: i + 1,
          refBase: ref[i],
          candBase: "-",
          mutationType: "Deletion",
          subType: "Deletion",
          impact: "High",
          description: `Deletion of ${ref[i]} at position ${i + 1}`
        });
      }
    }

    const totalMutations = mutations.length;
    const mutationRate = Number(((totalMutations / maxLen) * 100).toFixed(2));
    const genomicStability = Number((100 - mutationRate).toFixed(2));

    return {
      mutations,
      summary: {
        totalMutations,
        substitutionCount,
        transitionCount,
        transversionCount,
        insertionCount,
        deletionCount,
        mutationRate,
        genomicStability,
        tiTvRatio: Number((transitionCount / (transversionCount || 1)).toFixed(2))
      }
    };
  },

  assessMutationImpact(pos, refBase, candBase) {
    if ((refBase === "C" && candBase === "T") || (refBase === "G" && candBase === "A")) {
      return "High (Hypermutable CpG Site)";
    }
    if ((refBase === "A" && candBase === "C") || (refBase === "T" && candBase === "G")) {
      return "Moderate (Transversion)";
    }
    return "Low (Synonymous Candidate)";
  }
};
