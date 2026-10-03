import React, { useState } from 'react';
import {
  Download,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  UploadCloud,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  BellRing,
  ArrowRight,
  ShieldAlert,
  Flame,
  FileCheck,
  X,
} from 'lucide-react';
import { DownloadAnimationModal } from './DownloadAnimationModal';

interface ResultViewProps {
  score: number;
  correctCount: number;
  incorrectCount: number;
  kkm: number;
  studentName: string;
  noPeserta: string;
  driveUploadUrl?: string;
  onDownloadEncryptedResult: () => void;
  onViewDiscussion?: () => void;
  onRestart: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  studentName,
  noPeserta,
  driveUploadUrl,
  onDownloadEncryptedResult,
  onRestart,
}) => {
  // State tracking for student actions
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [hasOpenedDrive, setHasOpenedDrive] = useState(false);

  // Mandatory warning modal (shown automatically after test finishes)
  const [isMandatoryNoticeOpen, setIsMandatoryNoticeOpen] = useState(true);

  // Safety confirmation when attempting to exit without downloading
  const [showExitWarningModal, setShowExitWarningModal] = useState(false);

  const cleanName = studentName.replace(/[^a-zA-Z0-9]/g, '_');
  const resultFileName = `HASIL_CBT_${noPeserta}_${cleanName}.cbt`;

  const handleStartDownload = () => {
    setIsDownloadModalOpen(true);
  };

  const handleDownloadCompleted = () => {
    setHasDownloaded(true);
    onDownloadEncryptedResult();
  };

  const handleAttemptExit = () => {
    if (!hasDownloaded) {
      setShowExitWarningModal(true);
    } else {
      onRestart();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-100 fixed inset-0 z-40 overflow-y-auto p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-fade-in p-5 sm:p-8 text-center relative border border-gray-100 my-auto space-y-5">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-36 h-36 bg-emerald-50 rounded-br-full -z-10 opacity-70"></div>
        <div className="absolute bottom-0 right-0 w-36 h-36 bg-sky-50 rounded-tl-full -z-10 opacity-70"></div>

        {/* Top Floating Badge & Reopen Guidance Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Mode Offline &amp; Terenkripsi
          </div>
          <button
            type="button"
            onClick={() => setIsMandatoryNoticeOpen(true)}
            className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-2xs animate-pulse"
            title="Buka kembali jendela peringatan wajib download & upload"
          >
            <BellRing className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
            <span>Petunjuk Wajib</span>
          </button>
        </div>

        {/* Dynamic Animated Warning Callout / Progress Bar */}
        <div
          className={`p-4 sm:p-5 rounded-2xl text-left border-2 transition-all relative overflow-hidden shadow-md ${
            !hasDownloaded
              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white border-amber-300 animate-pulse'
              : !hasOpenedDrive && driveUploadUrl
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400'
              : 'bg-emerald-50 border-emerald-400 text-emerald-950'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                !hasDownloaded
                  ? 'bg-white/20 text-white animate-bounce'
                  : !hasOpenedDrive && driveUploadUrl
                  ? 'bg-white/20 text-white'
                  : 'bg-emerald-200 text-emerald-800'
              }`}
            >
              {!hasDownloaded ? (
                <AlertTriangle className="w-6 h-6 text-yellow-200" />
              ) : !hasOpenedDrive && driveUploadUrl ? (
                <UploadCloud className="w-6 h-6 text-white" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-700" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-black text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1">
                  {!hasDownloaded ? (
                    <>
                      <Flame className="w-4 h-4 text-amber-200 fill-amber-200" />
                      LANGKAH 1 (WAJIB): DOWNLOAD HASIL JAWABAN!
                    </>
                  ) : !hasOpenedDrive && driveUploadUrl ? (
                    <>
                      <Sparkles className="w-4 h-4 text-sky-200" />
                      LANGKAH 2 (WAJIB): UPLOAD KE GOOGLE DRIVE!
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4 text-emerald-700" />
                      SELURUH LANGKAH PENGUMPULAN SELESAI
                    </>
                  )}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/20 text-white whitespace-nowrap">
                  {hasDownloaded && hasOpenedDrive ? '2/2 SELESAI' : hasDownloaded ? '1/2 SELESAI' : '0/2 SELESAI'}
                </span>
              </div>

              <p className="text-xs leading-relaxed opacity-95">
                {!hasDownloaded ? (
                  <span>
                    Jawaban Anda <b>BELUM</b> diunduh. Wajib klik tombol <b>&quot;Unduh File Jawaban (.cbt)&quot;</b> di bawah sebelum menutup aplikasi agar berkas tidak hilang!
                  </span>
                ) : !hasOpenedDrive && driveUploadUrl ? (
                  <span>
                    File <b>.cbt</b> sudah tersimpan di perangkat Anda. Sekarang klik tombol <b>&quot;Upload ke Google Drive&quot;</b> untuk mengirim berkas ke folder Guru.
                  </span>
                ) : (
                  <span>
                    Terima kasih! Anda telah mengunduh file jawaban dan membuka link pengumpulan tugas. Anda dapat keluar dari aplikasi dengan aman.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Title Header */}
        <div>
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs mb-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Ujian Telah Selesai!</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Nama Siswa: <span className="font-extrabold text-slate-800">{studentName}</span> ({noPeserta})
          </p>
        </div>

        {/* Encrypted Download Banner (STEP 1) */}
        <div
          className={`p-4 sm:p-5 rounded-2xl shadow-md text-left space-y-3 relative overflow-hidden transition-all border-2 ${
            !hasDownloaded
              ? 'bg-slate-900 text-white border-emerald-500 ring-4 ring-emerald-500/20'
              : 'bg-emerald-950 text-white border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Langkah 1: File Hasil Ujian Terenkripsi (.cbt)
            </p>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-black border flex items-center gap-1 ${
                hasDownloaded
                  ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400'
                  : 'bg-amber-500/30 text-amber-300 border-amber-400 animate-pulse'
              }`}
            >
              {hasDownloaded ? 'SUDAH DIUNDUH ✓' : 'WAJIB DIUNDUH ⚠️'}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            File ini berisi rekaman seluruh jawaban Anda yang telah diamankan secara digital dengan enkripsi anti-kecurangan.
          </p>
          <button
            type="button"
            onClick={handleStartDownload}
            className={`w-full font-black py-3.5 px-5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer group active:scale-95 ${
              !hasDownloaded
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-600/40 animate-pulse'
                : 'bg-emerald-600/40 hover:bg-emerald-600/60 text-emerald-200 border border-emerald-400/40'
            }`}
          >
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            <span>
              {hasDownloaded ? 'Unduh Ulang File Jawaban (.cbt)' : 'UNDUH FILE JAWABAN (.cbt) SEKARANG'}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>

        {/* Upload Hasil Jawaban Google Drive Banner (STEP 2) */}
        {driveUploadUrl ? (
          <div
            className={`p-4 sm:p-5 rounded-2xl shadow-md text-left space-y-3 transition-all border-2 ${
              hasDownloaded && !hasOpenedDrive
                ? 'bg-gradient-to-br from-indigo-950 to-slate-900 text-white border-indigo-400 ring-4 ring-indigo-500/20'
                : 'bg-gradient-to-br from-indigo-950 to-slate-900 text-white border-indigo-700/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-black text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-indigo-400" />
                Langkah 2: Upload Hasil Jawaban (Google Drive)
              </p>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-black border flex items-center gap-1 ${
                  hasOpenedDrive
                    ? 'bg-indigo-500/30 text-indigo-200 border-indigo-400'
                    : hasDownloaded
                    ? 'bg-amber-500/30 text-amber-300 border-amber-400 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {hasOpenedDrive ? 'SUDAH DIBUKA ✓' : 'LANGKAH KEDUA'}
              </span>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed">
              Setelah file <b>.cbt</b> berhasil diunduh ke HP/laptop, klik tombol di bawah untuk mengunggah file tersebut ke folder Google Drive pengumpulan ujian.
            </p>
            <a
              href={driveUploadUrl.startsWith('http') ? driveUploadUrl : `https://${driveUploadUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setHasOpenedDrive(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-extrabold py-3.5 px-5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-95 cursor-pointer block text-center"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Buka Google Drive &amp; Upload File Jawaban (.cbt)</span>
              <ExternalLink className="w-3.5 h-3.5 text-indigo-200" />
            </a>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-left space-y-1.5">
            <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-slate-500" /> Upload Link Google Drive
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Link folder Google Drive belum dikonfigurasi oleh Guru/Admin. Pastikan Anda telah menyimpan file <b>.cbt</b> di atas dan serahkan langsung kepada Guru/Pengawas.
            </p>
          </div>
        )}

        {/* Exit Action with safety check */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleAttemptExit}
            className={`w-full min-h-[48px] font-extrabold py-3.5 px-5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer active:scale-98 ${
              !hasDownloaded
                ? 'bg-slate-800 hover:bg-slate-900 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900 hover:bg-slate-950 text-white'
            }`}
          >
            <LogOut className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Keluar dari Aplikasi (Kembali ke Halaman Utama)</span>
          </button>
        </div>

        <p className="text-[11px] text-gray-400 pt-1">
          <span>create: </span>
          <a
            href="https://lynk.id/ajisosiologi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline font-bold text-blue-600"
          >
            @ajisosiologi
          </a>{' '}
          - Offline Secure Assessment System
        </p>
      </div>

      {/* POP-UP MODAL 1: PERINGATAN WAJIB DOWNLOAD & UPLOAD (ANIMASI MENARIK) */}
      {isMandatoryNoticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-400 w-full max-w-lg p-5 sm:p-7 text-center relative overflow-hidden space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Ambient Background Glows */}
            <div className="absolute -top-12 -left-12 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

            {/* Close Cross Button */}
            <button
              type="button"
              onClick={() => setIsMandatoryNoticeOpen(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              title="Tutup Peringatan"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Animated Attention-Grabbing Badge Icon */}
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center mt-1">
              <div className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping opacity-75" />
              <div className="relative z-10 w-16 h-16 bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-amber-500/40 animate-bounce">
                <BellRing className="w-8 h-8 stroke-[2.5]" />
              </div>
            </div>

            {/* Title & Warning Header */}
            <div>
              <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                ⚠️ PERINGATAN WAJIB SETELAH UJIAN ⚠️
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                PENTING! JANGAN LANGSUNG KELUAR
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
                Agar berkas jawaban dan nilai Anda tercatat resmi, Anda <b>WAJIB</b> menyelesaikan 2 langkah di bawah ini:
              </p>
            </div>

            {/* Step 1: Download File .cbt */}
            <div
              className={`p-3.5 sm:p-4 rounded-2xl text-left border-2 transition-all space-y-2.5 ${
                hasDownloaded
                  ? 'bg-emerald-50 border-emerald-400'
                  : 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span className="text-xs font-black text-slate-900 uppercase">
                    WAJIB UNDUH BERKAS JAWABAN (.cbt)
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                    hasDownloaded
                      ? 'bg-emerald-200 text-emerald-800'
                      : 'bg-amber-200 text-amber-900 animate-pulse'
                  }`}
                >
                  {hasDownloaded ? 'SUDAH ✓' : 'WAJIB'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Download file <b>{resultFileName}</b> ke perangkat ini sebagai bukti rekaman naskah jawaban terenkripsi.
              </p>
              <button
                type="button"
                onClick={handleStartDownload}
                className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                  hasDownloaded
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30 animate-pulse'
                }`}
              >
                <Download className="w-4 h-4 animate-bounce" />
                <span>
                  {hasDownloaded ? 'File Sudah Diunduh (Klik untuk Unduh Ulang)' : 'KLIK DI SINI: UNDUH FILE JAWABAN (.cbt)'}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>

            {/* Step 2: Upload to Google Drive */}
            <div
              className={`p-3.5 sm:p-4 rounded-2xl text-left border-2 transition-all space-y-2.5 ${
                hasOpenedDrive
                  ? 'bg-indigo-50 border-indigo-300'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span className="text-xs font-black text-slate-900 uppercase">
                    UPLOAD KE GOOGLE DRIVE
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                    hasOpenedDrive
                      ? 'bg-indigo-200 text-indigo-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {hasOpenedDrive ? 'SUDAH DIBUKA ✓' : 'LANGKAH KEDUA'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {driveUploadUrl
                  ? 'Setelah file .cbt diunduh, kirim file tersebut ke folder Google Drive pengumpulan ujian guru.'
                  : 'Jika link Google Drive belum disediakan, serahkan file .cbt langsung kepada Guru / Pengawas.'}
              </p>
              {driveUploadUrl && (
                <a
                  href={driveUploadUrl.startsWith('http') ? driveUploadUrl : `https://${driveUploadUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setHasOpenedDrive(true)}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer block text-center"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Buka Google Drive &amp; Upload (.cbt)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => setIsMandatoryNoticeOpen(false)}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-950 active:bg-black text-white font-black rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Saya Mengerti &amp; Tutup Panduan Ini</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* POP-UP MODAL 2: PERINGATAN SAAT SISWA INGIN KELUAR SEBELUM DOWNLOAD */}
      {showExitWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-red-500 w-full max-w-md p-6 text-center relative overflow-hidden space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Animated Siren Icon */}
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto border-2 border-red-300 shadow-lg shadow-red-200 animate-bounce">
              <ShieldAlert className="w-8 h-8 text-red-600" />
            </div>

            <div>
              <span className="bg-red-100 text-red-800 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-1.5 border border-red-200">
                ⛔ PERINGATAN: ANDA BELUM DOWNLOAD JAWABAN!
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Yakin Ingin Keluar?
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                File berkas hasil jawaban (<b>.cbt</b>) Anda <b>belum diunduh</b> ke perangkat ini.
                <br />
                Jika Anda keluar sekarang, Anda tidak akan memiliki bukti naskah jawaban untuk di-upload ke Google Drive Guru!
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowExitWarningModal(false);
                  handleStartDownload();
                }}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-3.5 px-4 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 animate-pulse cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>UNDUH FILE JAWABAN SEKARANG (WAJIB)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowExitWarningModal(false);
                  onRestart();
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 px-4 rounded-xl text-xs transition cursor-pointer"
              >
                Tetap Keluar Tanpa Menyimpan (Berisiko)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Animation Modal */}
      <DownloadAnimationModal
        isOpen={isDownloadModalOpen}
        title="Mengunduh Hasil Jawaban (.cbt)"
        subtitle="Memproses stempel digital & enkripsi hasil ujian..."
        fileName={resultFileName}
        fileType="cbt"
        onComplete={handleDownloadCompleted}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
};
