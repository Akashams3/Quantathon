export const PDFExporter = {
  exportCSV(analysisData) {
    const { sequenceInfo, stats, mutationResults, quantumResults, motifs } = analysisData;
    let csv = "QuantumDNA X - Genomic Analysis Report\n";
    csv += `Header,${sequenceInfo.header}\n`;
    csv += `Sequence Length,${stats.length}\n`;
    csv += `GC Content %,${stats.gcContent}%\n`;
    csv += `AT Content %,${stats.atContent}%\n`;
    csv += `Genomic Stability,${mutationResults.summary.genomicStability}%\n`;
    csv += `Quantum Similarity Score,${quantumResults.quantumSimilarityScore}%\n\n`;

    csv += "--- DETECTED MUTATIONS ---\n";
    csv += "Position,Reference Base,Mutated Base,Mutation Type,Sub-Type,Impact\n";
    mutationResults.mutations.forEach((m) => {
      csv += `${m.position},${m.refBase},${m.candBase},${m.mutationType},${m.subType},${m.impact}\n`;
    });

    csv += "\n--- REPEATED GENOMIC MOTIFS ---\n";
    csv += "Motif,Length,Count,Sequence Percentage,Biological Significance\n";
    motifs.forEach((mt) => {
      csv += `${mt.motif},${mt.length},${mt.count},${mt.percentage}%,${mt.significance}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `QuantumDNA_X_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportPDF(analysisData) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to generate the PDF report.");
      return;
    }

    const { sequenceInfo, stats, mutationResults, quantumResults, motifs, aiSummary } = analysisData;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>QuantumDNA X - Scientific Analysis Report</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; padding: 40px; line-height: 1.6; }
          .header { border-bottom: 3px solid #0284c7; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
          .logo { font-size: 24px; font-weight: bold; color: #0284c7; }
          .title { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
          .badge { display: inline-block; padding: 4px 10px; background: #e0f2fe; color: #0369a1; border-radius: 4px; font-size: 12px; font-weight: bold; }
          .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center; }
          .card-val { font-size: 20px; font-weight: bold; color: #0f172a; }
          .card-lbl { font-size: 11px; color: #64748b; text-transform: uppercase; }
          .section-title { font-size: 16px; font-weight: bold; color: #0f172a; border-left: 4px solid #0284c7; padding-left: 10px; margin-top: 25px; margin-bottom: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
          th { background: #f1f5f9; color: #334155; }
          .ai-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 15px; color: #166534; font-size: 13px; }
          .quantum-box { background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 15px; color: #6b21a8; font-size: 13px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">QuantumDNA X</div>
            <div style="font-size:12px; color:#64748b;">AI + Quantum Hybrid Genomic Platform</div>
          </div>
          <div style="text-align:right;">
            <span class="badge">${aiSummary.riskBadge}</span>
            <div style="font-size:11px; color:#94a3b8; margin-top:4px;">Date: ${new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div class="title">${sequenceInfo.header || "Genomic Sequence Sample"}</div>
        <div style="font-size:12px; color:#475569; margin-bottom:20px;">Sequence Length: ${stats.length} bp | File Type: ${sequenceInfo.fileType}</div>

        <div class="grid">
          <div class="card">
            <div class="card-val">${stats.length}</div>
            <div class="card-lbl">Total Length</div>
          </div>
          <div class="card">
            <div class="card-val" style="color:#0284c7">${mutationResults.summary.totalMutations}</div>
            <div class="card-lbl">Mutations</div>
          </div>
          <div class="card">
            <div class="card-val" style="color:#16a34a">${stats.gcContent}%</div>
            <div class="card-lbl">GC Content</div>
          </div>
          <div class="card">
            <div class="card-val" style="color:#9333ea">${quantumResults.quantumSimilarityScore}%</div>
            <div class="card-lbl">Quantum Similarity</div>
          </div>
        </div>

        <div class="section-title">AI Research Summary & Clinical Assessment</div>
        <div class="ai-box">
          <p>${aiSummary.overviewParagraph}</p>
          <p>${aiSummary.mutationParagraph}</p>
          <p><strong>${aiSummary.recommendation}</strong></p>
        </div>

        <div class="section-title">Quantum Computing Simulation Analysis</div>
        <div class="quantum-box">
          <p><strong>Backend:</strong> IBM Quantum Simulator (ibmq_qasm_simulator) | 4-Qubit Circuit</p>
          <p>${aiSummary.quantumParagraph}</p>
          <p>State vector inner product fidelity score: <strong>${quantumResults.quantumSimilarityScore}%</strong></p>
        </div>

        <div class="section-title">Detected Point Mutations</div>
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Ref Base</th>
              <th>Mutated Base</th>
              <th>Mutation Type</th>
              <th>Sub-Type</th>
              <th>Impact</th>
            </tr>
          </thead>
          <tbody>
            ${mutationResults.mutations.map(m => `
              <tr>
                <td>${m.position}</td>
                <td><strong>${m.refBase}</strong></td>
                <td><span style="color:#e11d48; font-weight:bold;">${m.candBase}</span></td>
                <td>${m.mutationType}</td>
                <td>${m.subType}</td>
                <td>${m.impact}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="section-title">Top Recurring Genomic Motifs</div>
        <table>
          <thead>
            <tr>
              <th>Motif</th>
              <th>Length</th>
              <th>Frequency</th>
              <th>Coverage %</th>
              <th>Significance</th>
            </tr>
          </thead>
          <tbody>
            ${motifs.map(mt => `
              <tr>
                <td><code>${mt.motif}</code></td>
                <td>${mt.length}</td>
                <td>${mt.count}</td>
                <td>${mt.percentage}%</td>
                <td>${mt.significance}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div style="margin-top:40px; text-align:center; font-size:11px; color:#94a3b8; border-top:1px solid #e2e8f0; padding-top:15px;">
          Generated automatically by QuantumDNA X Platform • Confidential Research Artifact
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
};
