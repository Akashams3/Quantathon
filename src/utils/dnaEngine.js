export const DNAEngine = {
  parseInput(rawText) {
    if (!rawText || typeof rawText !== "string") {
      rawText = "ATGC";
    }

    const lines = rawText.split(/\r?\n/);
    let header = "Uploaded Sequence";
    let sequenceBuffer = [];

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      if (line.startsWith(">") || line.startsWith(";")) {
        header = line.substring(1).trim();
      } else {
        sequenceBuffer.push(line);
      }
    }

    const rawSeq = sequenceBuffer.join("") || rawText;
    const cleanedSeq = rawSeq.toUpperCase().replace(/[^ATGC]/g, "") || "ATGC";
    const invalidCharCount = Math.max(0, rawSeq.length - cleanedSeq.length);

    return {
      header,
      rawSequence: rawSeq,
      cleanedSequence: cleanedSeq,
      length: cleanedSeq.length,
      invalidCharCount,
      isValid: true
    };
  },

  calculateStats(sequence) {
    const seq = sequence.toUpperCase();
    const len = seq.length || 1;
    let counts = { A: 0, T: 0, G: 0, C: 0, N: 0 };

    for (let i = 0; i < seq.length; i++) {
      const char = seq[i];
      if (counts[char] !== undefined) {
        counts[char]++;
      } else {
        counts.N++;
      }
    }

    const gcCount = counts.G + counts.C;
    const atCount = counts.A + counts.T;

    const gcContent = Number(((gcCount / len) * 100).toFixed(2));
    const atContent = Number(((atCount / len) * 100).toFixed(2));
    const molecularWeight = Math.round(len * 650 - 108);

    let meltingTemp = 0;
    if (len < 14) {
      meltingTemp = 2 * (counts.A + counts.T) + 4 * (counts.G + counts.C);
    } else {
      meltingTemp = Number((64.9 + (41 * (gcCount - 16.4)) / len).toFixed(1));
    }

    return {
      length: len,
      counts,
      gcContent,
      atContent,
      gcRatio: Number((gcCount / (atCount || 1)).toFixed(2)),
      molecularWeight,
      meltingTemp
    };
  }
};
