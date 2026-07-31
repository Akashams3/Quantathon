import React, { useState, useRef } from 'react';
import { UploadCloud, FileCode2, X } from 'lucide-react';
import { DNAEngine } from '../utils/dnaEngine.js';

export default function UploadModal({ isOpen, onClose, onProcess }) {
  const [rawText, setRawText] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setRawText(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!rawText.trim() && !fileInputRef.current?.files?.[0]) {
      alert("Please upload a .FASTA/.TXT file or paste a DNA sequence string.");
      return;
    }
    try {
      const selectedFile = fileInputRef.current?.files?.[0];
      const parsed = DNAEngine.parseInput(rawText || "");
      const fileType = fileName.endsWith(".fasta") || fileName.endsWith(".fa") ? "FASTA" : "TXT";
      onProcess(
        parsed.header || fileName || "Custom Uploaded DNA Locus",
        parsed.cleanedSequence,
        fileType,
        selectedFile
      );
      onClose();
    } catch (err) {
      alert("Validation error: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="glass-panel w-full max-w-xl rounded-2xl p-6 space-y-5 border border-cyan-500/30 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2 brand-font">
            <UploadCloud className="w-5 h-5 text-cyan-400" />
            <span>Upload DNA Sequence File</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center space-y-3 cursor-pointer transition-all ${
            dragOver ? "border-cyan-400 bg-cyan-500/10" : "border-slate-700 hover:border-cyan-400"
          }`}
        >
          <FileCode2 className="w-10 h-10 text-cyan-400 mx-auto" />
          <div className="text-xs text-slate-300 font-medium">
            {fileName ? (
              <span className="text-cyan-400 font-bold">Loaded: {fileName}</span>
            ) : (
              <>Drag & Drop your <strong>.FASTA</strong>, <strong>.FA</strong>, or <strong>.TXT</strong> file here</>
            )}
          </div>
          <div className="text-[11px] text-slate-500">or click to browse local files</div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".fasta,.fa,.txt"
            onChange={(e) => e.target.files && e.target.files[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400">
            Or Paste DNA Sequence String (A, T, G, C):
          </label>
          <textarea
            rows="4"
            placeholder=">Sample_Header&#10;ATGCGATCGATCGATCGATCG..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-slate-950 font-bold text-xs shadow-md cursor-pointer"
          >
            Validate & Process
          </button>
        </div>
      </div>
    </div>
  );
}
