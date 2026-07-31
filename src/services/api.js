/**
 * API Client Service for connecting React Frontend to FastAPI Backend Engine (http://127.0.0.1:8000)
 * Handles file uploads, Phase 1 DNA processing, Phase 2 MySQL queries, and Phase 3 AI mutation predictions.
 */

const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://127.0.0.1:8000";

export const BackendAPI = {
  baseUrl: API_BASE_URL,

  /**
   * Checks if FastAPI backend server is online and connected to MySQL database.
   */
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`, { method: "GET" });
      if (!res.ok) return { online: false };
      const data = await res.json();
      return { online: true, ...data };
    } catch (err) {
      return { online: false, error: err.message };
    }
  },

  /**
   * Uploads raw FASTA/TXT sequence file to FastAPI backend.
   */
  async uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Upload failed" }));
      throw new Error(err.detail || "File upload failed");
    }

    return await res.json();
  },

  /**
   * Triggers Phase 1 DNA Feature Extraction and saves results in MySQL DB.
   */
  async analyzeDNA(analysisId) {
    const res = await fetch(`${API_BASE_URL}/analyze/${analysisId}`, {
      method: "POST",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Analysis failed" }));
      throw new Error(err.detail || "DNA analysis failed");
    }

    return await res.json();
  },

  /**
   * Triggers Phase 3 AI Mutation Model prediction on stored DNA features.
   */
  async predictMutation(analysisId) {
    const res = await fetch(`${API_BASE_URL}/predict/${analysisId}`, {
      method: "POST",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "AI prediction failed" }));
      throw new Error(err.detail || "AI prediction failed");
    }

    return await res.json();
  },

  /**
   * Processes raw DNA sequence string directly via backend API.
   */
  async processSequence(sequence, sequenceId = "Custom_Seq", kMerSize = 3) {
    const res = await fetch(`${API_BASE_URL}/api/process-sequence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sequence,
        sequence_id: sequenceId,
        k_mer_size: kMerSize,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Processing sequence failed" }));
      throw new Error(err.detail || "Processing sequence failed");
    }

    return await res.json();
  },

  /**
   * Triggers Phase 4 IBM Qiskit Quantum Simulation for specified analysisId.
   */
  async runQuantumAnalysis(analysisId) {
    const res = await fetch(`${API_BASE_URL}/quantum-analyze/${analysisId}`, {
      method: "POST",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Quantum analysis failed" }));
      throw new Error(err.detail || "Quantum analysis failed");
    }

    return await res.json();
  },

  /**
   * Fetches sample dataset analysis directly from backend API.
   */
  async getSampleAnalysis() {
    const res = await fetch(`${API_BASE_URL}/api/sample`, { method: "GET" });
    if (!res.ok) throw new Error("Failed to fetch sample analysis from backend");
    return await res.json();
  },

  /**
   * Fetches analysis summary from MySQL for given ID.
   */
  async getAnalysisSummary(analysisId = 1) {
    const res = await fetch(`${API_BASE_URL}/analysis/${analysisId}`, { method: "GET" });
    if (!res.ok) throw new Error("Failed to fetch analysis summary");
    return await res.json();
  },

  /**
   * Fetches nucleotide statistics from MySQL for given ID.
   */
  async getStatistics(analysisId = 1) {
    const res = await fetch(`${API_BASE_URL}/statistics/${analysisId}`, { method: "GET" });
    if (!res.ok) throw new Error("Failed to fetch nucleotide statistics");
    return await res.json();
  },

  /**
   * Fetches mutation prediction results from MySQL for given ID.
   */
  async getMutations(analysisId = 1) {
    const res = await fetch(`${API_BASE_URL}/mutations/${analysisId}`, { method: "GET" });
    if (!res.ok) throw new Error("Failed to fetch mutation results");
    return await res.json();
  },

  /**
   * Fetches all analysis records stored in MySQL.
   */
  async listAnalyses() {
    const res = await fetch(`${API_BASE_URL}/analyses`, { method: "GET" });
    if (!res.ok) throw new Error("Failed to list analyses");
    return await res.json();
  },

  async getDemoFeatureCards() {
    const res = await fetch(`${API_BASE_URL}/api/demo/feature-cards`, { method: "GET" });
    if (!res.ok) throw new Error("Failed to load demo feature cards");
    return await res.json();
  },

  async sendAiChat(question) {
    const res = await fetch(`${API_BASE_URL}/api/demo/ai-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });
    if (!res.ok) throw new Error("AI chat request failed");
    return await res.json();
  },

  async generateResearchPaper(prompt) {
    const res = await fetch(`${API_BASE_URL}/api/demo/research-paper`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error("Research paper generation failed");
    return await res.json();
  },

  async getCloudHistory() {
    const res = await fetch(`${API_BASE_URL}/api/demo/cloud-history`, { method: "GET" });
    if (!res.ok) throw new Error("Failed to load cloud history");
    return await res.json();
  },

  /**
   * Loads complete MySQL analysis record (Summary + Stats + AI Mutations + Qiskit Quantum) by ID.
   */
  async loadCompleteAnalysis(analysisId = 1) {
    const [summary, stats, mutations, quantum] = await Promise.all([
      this.getAnalysisSummary(analysisId).catch(() => null),
      this.getStatistics(analysisId).catch(() => null),
      this.getMutations(analysisId).catch(() => null),
      this.runQuantumAnalysis(analysisId).catch(() => null)
    ]);

    return { summary, stats, mutations, quantum };
  }
};
