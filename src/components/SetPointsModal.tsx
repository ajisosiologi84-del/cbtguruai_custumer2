import React, { useState, useEffect } from 'react';
import { X, Check, Zap, Calculator, Percent, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';

interface SetPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedQuestionsCount: number;
  totalQuestionsCount: number;
  filteredQuestionsCount: number;
  onApplyPoints: (points: number, scope: 'selected' | 'filtered' | 'all') => void;
  initialPoints?: number;
}

export const SetPointsModal: React.FC<SetPointsModalProps> = ({
  isOpen,
  onClose,
  selectedQuestionsCount,
  totalQuestionsCount,
  filteredQuestionsCount,
  onApplyPoints,
  initialPoints = 10,
}) => {
  const [pointsInput, setPointsInput] = useState<string>(String(initialPoints));
  const [scope, setScope] = useState<'selected' | 'filtered' | 'all'>(
    selectedQuestionsCount > 0 ? 'selected' : 'all'
  );
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setPointsInput(String(initialPoints > 0 ? initialPoints : 10));
      setScope(selectedQuestionsCount > 0 ? 'selected' : 'all');
      setErrorMsg('');
    }
  }, [isOpen, initialPoints, selectedQuestionsCount]);

  if (!isOpen) return null;

  const currentTargetCount =
    scope === 'selected'
      ? selectedQuestionsCount
      : scope === 'filtered'
      ? filteredQuestionsCount
      : totalQuestionsCount;

  const numericPoints = parseFloat(pointsInput) || 0;
  const projectedTotalPoints = Math.round(numericPoints * currentTargetCount * 10) / 10;

  const presets = [2, 2.5, 4, 5, 10, 20, 25, 50];

  const handleSelectPreset = (p: number) => {
    setPointsInput(String(p));
    setErrorMsg('');
  };

  const handleAutoDivideTarget100 = () => {
    if (currentTargetCount <= 0) {
      setErrorMsg('Tidak ada soal dalam cakupan yang dipilih!');
      return;
    }
    // Calculate point per question so total equals 100
    const rawPoint = 100 / currentTargetCount;
    // Round to 2 decimal places if needed (e.g., 2.5 or 3.33)
    const formatted = Math.round(rawPoint * 100) / 100;
    setPointsInput(String(formatted));
    setErrorMsg('');
  };

  const handleSave = () => {
    if (isNaN(numericPoints) || numericPoints <= 0) {
      setErrorMsg('Harap masukkan angka bobot poin yang valid (> 0)!');
      return;
    }
    if (currentTargetCount <= 0) {
      setErrorMsg('Cakupan soal yang dipilih kosong (0 butir)!');
      return;
    }
    onApplyPoints(numericPoints, scope);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[130] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden flex flex-col max-h-[95vh] animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-600 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Zap className="w-5 h-5 text-yellow-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                Atur Bobot Poin Soal
              </h3>
              <p className="text-amber-100 text-xs mt-0.5">
                Kalkulasi skor nilai ujian CBT (Skala Maks 100)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            title="Tutup Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar text-slate-800 text-xs sm:text-sm">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-center gap-2 font-semibold animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Pilih Cakupan Soal */}
          <div>
            <label className="block font-bold text-slate-700 mb-2 uppercase text-[11px] tracking-wider">
              1. Pilih Cakupan Soal yang Diubah:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                disabled={selectedQuestionsCount === 0}
                onClick={() => setScope('selected')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  scope === 'selected'
                    ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-400'
                    : selectedQuestionsCount === 0
                    ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed opacity-60'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold text-xs">Soal Terpilih</span>
                  <span className="font-mono font-black text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded text-[11px]">
                    {selectedQuestionsCount}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Yang dicentang</span>
              </button>

              <button
                type="button"
                onClick={() => setScope('filtered')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  scope === 'filtered'
                    ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-400'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold text-xs">Hasil Filter</span>
                  <span className="font-mono font-black text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded text-[11px]">
                    {filteredQuestionsCount}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Sesuai filter aktif</span>
              </button>

              <button
                type="button"
                onClick={() => setScope('all')}
                className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  scope === 'all'
                    ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-400'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold text-xs">Semua Bank</span>
                  <span className="font-mono font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded text-[11px]">
                    {totalQuestionsCount}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">Seluruh butir soal</span>
              </button>
            </div>
          </div>

          {/* 2. Input Bobot Poin */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">
                2. Masukkan Bobot Poin per Butir Soal:
              </label>
              <button
                type="button"
                onClick={handleAutoDivideTarget100}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 transition shadow-xs cursor-pointer active:scale-95"
                title="Hitung otomatis bobot poin agar total tepat 100 poin"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Bagi Rata (Target 100)</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="number"
                step="any"
                min="0.1"
                max="100"
                value={pointsInput}
                onChange={(e) => {
                  setPointsInput(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Misal: 10 atau 2.5 atau 4"
                className="w-full border-2 border-amber-300 focus:border-amber-500 rounded-2xl p-3 pr-16 font-extrabold text-base sm:text-lg text-slate-900 bg-amber-50/20 focus:outline-none transition"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-xs">
                POIN
              </span>
            </div>
          </div>

          {/* 3. Preset Cepat */}
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Pilihan Bobot Cepat (Preset):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => {
                const isSelected = numericPoints === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition cursor-pointer active:scale-95 border ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    {p} Poin
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Live Summary Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Target Butir Soal:</span>
              <span className="font-extrabold text-slate-800 font-mono">
                {currentTargetCount} Butir
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Bobot per Soal:</span>
              <span className="font-extrabold text-amber-600 font-mono">
                {numericPoints > 0 ? numericPoints : 0} Poin
              </span>
            </div>
            <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
              <span className="text-slate-800 font-bold text-xs sm:text-sm">
                Total Akumulasi Poin:
              </span>
              <span
                className={`font-mono font-black text-sm sm:text-base px-2.5 py-0.5 rounded-lg border ${
                  projectedTotalPoints === 100
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                {projectedTotalPoints} Poin
              </span>
            </div>

            {projectedTotalPoints === 100 ? (
              <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Total poin tepat 100! Skor siswa otomatis bulat tanpa pembagi tambahan.</span>
              </p>
            ) : (
              <p className="text-[10px] text-slate-500 font-normal leading-relaxed mt-1">
                💡 Sistem penilaian CBT otomatis mengonversi total perolehan poin siswa ke skala 0 - 100 sesuai bobot masing-masing soal.
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2 justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Terapkan Bobot Poin ({currentTargetCount} Soal)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
