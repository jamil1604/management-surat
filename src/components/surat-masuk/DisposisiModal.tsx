import React, { useState } from 'react';
import { SuratMasuk, DisposisiItem } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Send,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  UserCheck,
  MessageSquare,
  FileCheck,
} from 'lucide-react';

interface DisposisiModalProps {
  surat: SuratMasuk;
  onClose: () => void;
  onPrintLembarDisposisi: () => void;
}

const instruksiOptions = [
  'Tindak Lanjuti Segera',
  'Pelajari & Telaah',
  'Siapkan Bahan / Draf Jawaban',
  'Hadiri / Wakili Pimpinan',
  'Koordinasikan dengan Terkait',
  'Arsipkan / Untuk Diketahui',
  'Jadwalkan Pertemuan / Rapat',
  'Monitor & Laporkan Hasilnya',
];

export const DisposisiModal: React.FC<DisposisiModalProps> = ({
  surat,
  onClose,
  onPrintLembarDisposisi,
}) => {
  const { users, currentUser, addDisposisi, updateDisposisi } = useApp();

  // New disposition form state
  const defaultTarget = users.find((u) => u.role === 'staff')?.id || users[0].id;
  const [kepadaUserId, setKepadaUserId] = useState(defaultTarget);
  const [selectedInstruksi, setSelectedInstruksi] = useState<string[]>([
    'Tindak Lanjuti Segera',
  ]);
  const [catatan, setCatatan] = useState('');
  const [batasWaktu, setBatasWaktu] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Response state for existing items
  const [activeEditingId, setActiveEditingId] = useState<string | null>(null);
  const [tanggapanText, setTanggapanText] = useState('');
  const [newStatus, setNewStatus] = useState<'menunggu' | 'proses' | 'selesai'>('proses');

  const toggleInstruksi = (item: string) => {
    setSelectedInstruksi((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSaveDisposisi = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUser = users.find((u) => u.id === kepadaUserId);
    if (!targetUser) return;

    addDisposisi(surat.id, {
      dariUserId: currentUser.id,
      dariNama: currentUser.name,
      kepadaUserId: targetUser.id,
      kepadaNama: targetUser.name,
      tanggal: new Date().toISOString().split('T')[0],
      batasWaktu: batasWaktu,
      instruksi: selectedInstruksi,
      catatan: catatan.trim() || 'Harap ditindaklanjuti sesuai instruksi dan kewenangan.',
      status: 'proses',
    });

    setCatatan('');
    setSelectedInstruksi(['Tindak Lanjuti Segera']);
  };

  const handleSaveTanggapan = (dispId: string) => {
    updateDisposisi(surat.id, dispId, {
      tanggapan: tanggapanText.trim(),
      status: newStatus,
      tanggalSelesai: newStatus === 'selesai' ? new Date().toISOString().split('T')[0] : undefined,
    });
    setActiveEditingId(null);
    setTanggapanText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-2xl my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 rounded-t-xl shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="font-mono">{surat.noAgenda}</span>
              <span>·</span>
              <span>Nomor: {surat.noSurat}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 line-clamp-1 mt-0.5">
              Alur Disposisi: {surat.perihal}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrintLembarDisposisi}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              title="Cetak format fisik lembar disposisi"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span>Cetak Slip</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Summary Box */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Asal Surat / Pengirim:</span>
              <span className="font-semibold text-slate-800">{surat.asalSurat}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Tanggal Terima & Sifat:</span>
              <span className="font-semibold text-slate-800">
                {surat.tanggalTerima} · <span className="uppercase text-amber-800 font-bold">{surat.sifat}</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Lokasi Berkas Fisik:</span>
              <span className="font-mono text-slate-700">{surat.lokasiArsip}</span>
            </div>
            {surat.ringkasan && (
              <div className="pt-2 border-t border-slate-200 text-slate-600 italic">
                "{surat.ringkasan}"
              </div>
            )}
          </div>

          {/* Disposition History List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              <span>Riwayat Disposisi & Tindak Lanjut ({surat.disposisiList.length})</span>
            </h4>

            {surat.disposisiList.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500 bg-slate-50/50">
                Belum ada instruksi disposisi untuk surat ini. Silakan input instruksi baru di bawah.
              </div>
            ) : (
              <div className="space-y-3">
                {surat.disposisiList.map((disp) => {
                  const isEditing = activeEditingId === disp.id;
                  return (
                    <div
                      key={disp.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-emerald-600" />
                          <span className="font-semibold text-slate-900">{disp.dariNama}</span>
                          <span className="text-slate-400">→</span>
                          <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                            {disp.kepadaNama}
                          </span>
                        </div>
                        <span
                          className={`rounded px-2 py-0.5 text-[11px] font-semibold tabular-nums ${
                            disp.status === 'selesai'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {disp.status === 'selesai' ? 'Selesai' : 'Dalam Proses'}
                        </span>
                      </div>

                      {/* Instructions */}
                      <div className="flex flex-wrap gap-1.5">
                        {disp.instruksi.map((ins, i) => (
                          <span
                            key={i}
                            className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                          >
                            ✓ {ins}
                          </span>
                        ))}
                      </div>

                      {/* Note */}
                      <div className="rounded bg-slate-50 p-2.5 text-xs text-slate-800 border border-slate-100">
                        <span className="font-semibold text-slate-600 block text-[10px] uppercase">
                          Instruksi Pimpinan:
                        </span>
                        {disp.catatan}
                      </div>

                      {/* Meta Deadline */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>Diberikan: {disp.tanggal}</span>
                        <span>Batas Waktu: <strong className="text-slate-700 font-mono">{disp.batasWaktu}</strong></span>
                      </div>

                      {/* Follow-up / Response Section */}
                      {disp.tanggapan ? (
                        <div className="rounded bg-emerald-50/70 p-2.5 text-xs text-emerald-950 border border-emerald-100 space-y-1">
                          <div className="flex items-center justify-between font-semibold text-emerald-800 text-[11px]">
                            <span>Laporan Tindak Lanjut Pelaksana:</span>
                            {disp.tanggalSelesai && <span>Selesai: {disp.tanggalSelesai}</span>}
                          </div>
                          <p>{disp.tanggapan}</p>
                        </div>
                      ) : (
                        !isEditing && (
                          <button
                            onClick={() => {
                              setActiveEditingId(disp.id);
                              setTanggapanText('');
                              setNewStatus('selesai');
                            }}
                            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 pt-1"
                          >
                            <MessageSquare className="h-3.5 w-3.5 text-slate-500" />
                            <span>Beri Tanggapan / Update Status Pengerjaan</span>
                          </button>
                        )
                      )}

                      {/* Inline Followup Form */}
                      {isEditing && (
                        <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2 text-xs">
                          <div className="font-semibold text-slate-800">
                            Update Tindak Lanjut & Tanggapan Pelaksana
                          </div>
                          <textarea
                            rows={2}
                            value={tanggapanText}
                            onChange={(e) => setTanggapanText(e.target.value)}
                            placeholder="Tuliskan uraian hasil pelaksanaan, kehadiran rapat, atau tindak lanjut draft..."
                            className="w-full rounded-md border border-slate-300 p-2 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 bg-white"
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <label className="text-[11px] text-slate-600 font-medium">Status:</label>
                              <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value as any)}
                                className="rounded border border-slate-300 px-2 py-1 text-xs bg-white"
                              >
                                <option value="proses">Dalam Proses</option>
                                <option value="selesai">Selesai Ditindaklanjuti</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setActiveEditingId(null)}
                                className="px-2.5 py-1 text-slate-600 hover:text-slate-900"
                              >
                                Batal
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveTanggapan(disp.id)}
                                className="rounded bg-slate-900 px-3 py-1 font-semibold text-white hover:bg-slate-800"
                              >
                                Simpan Tanggapan
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Form: Add New Disposisi */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Send className="h-3.5 w-3.5 text-slate-600" />
              <span>Input Instruksi Disposisi Baru</span>
            </h4>

            <form onSubmit={handleSaveDisposisi} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Diteruskan Kepada (Pejabat / Staff):
                  </label>
                  <select
                    value={kepadaUserId}
                    onChange={(e) => setKepadaUserId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    {users
                      .filter((u) => u.id !== currentUser.id)
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} — ({u.jabatan})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Batas Waktu Penyelesaian:
                  </label>
                  <input
                    type="date"
                    required
                    value={batasWaktu}
                    onChange={(e) => setBatasWaktu(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1.5">
                  Checklist Instruksi Disposisi (Dapat pilih lebih dari satu):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {instruksiOptions.map((opt) => {
                    const isChecked = selectedInstruksi.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleInstruksi(opt)}
                        className={`rounded-lg border p-2 text-left text-[11px] transition font-medium flex items-center gap-2 ${
                          isChecked
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="shrink-0">{isChecked ? '✓' : '○'}</span>
                        <span className="truncate">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Catatan / Arahan Khusus Pimpinan:
                </label>
                <textarea
                  rows={2}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: Harap segera teliti kelengkapan dokumen dan jadwalkan rapat teknis hari Kamis..."
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  disabled={selectedInstruksi.length === 0}
                  className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition"
                >
                  Kirim Disposisi Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 px-6 py-3 bg-white rounded-b-xl flex justify-between items-center text-xs text-slate-500">
          <span>Pengguna aktif: <strong>{currentUser.name}</strong></span>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-1.5 text-slate-700 hover:bg-slate-50 font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
