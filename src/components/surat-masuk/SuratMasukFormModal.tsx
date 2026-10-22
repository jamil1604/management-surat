import React, { useState } from 'react';
import { SuratMasuk, SuratSifat } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, UploadCloud, FileText } from 'lucide-react';

interface SuratMasukFormModalProps {
  initialData?: SuratMasuk | null;
  onClose: () => void;
  onSaved: (surat: SuratMasuk) => void;
}

export const SuratMasukFormModal: React.FC<SuratMasukFormModalProps> = ({
  initialData,
  onClose,
  onSaved,
}) => {
  const {
    addSuratMasuk,
    updateSuratMasuk,
    generateNextNoAgendaMasuk,
    klasifikasiList,
    instansiProfile,
  } = useApp();

  const isEdit = Boolean(initialData);

  const [noAgenda, setNoAgenda] = useState(
    initialData ? initialData.noAgenda : generateNextNoAgendaMasuk()
  );
  const [noSurat, setNoSurat] = useState(initialData?.noSurat || '');
  const [tanggalSurat, setTanggalSurat] = useState(
    initialData?.tanggalSurat || new Date().toISOString().split('T')[0]
  );
  const [tanggalTerima, setTanggalTerima] = useState(
    initialData?.tanggalTerima || new Date().toISOString().split('T')[0]
  );
  const [asalSurat, setAsalSurat] = useState(initialData?.asalSurat || '');
  const [ditujukanKepada, setDitujukanKepada] = useState(
    initialData?.ditujukanKepada || instansiProfile.kepalaJabatan || 'Kepala Instansi'
  );
  const [perihal, setPerihal] = useState(initialData?.perihal || '');
  const [ringkasan, setRingkasan] = useState(initialData?.ringkasan || '');
  const [kodeKlasifikasi, setKodeKlasifikasi] = useState(
    initialData?.kodeKlasifikasi || klasifikasiList[0]?.kode || '005'
  );
  const [sifat, setSifat] = useState<SuratSifat>(initialData?.sifat || 'biasa');
  const [lokasiArsip, setLokasiArsip] = useState(
    initialData?.lokasiArsip || 'Bantex 2026/A-01 (Lemari TU)'
  );
  const [fileName, setFileName] = useState(
    initialData?.fileName || 'Dokumen_Naskah_Dinas_Masuk.pdf'
  );
  const [fileSize, setFileSize] = useState(initialData?.fileSize || '1.2 MB');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && initialData) {
      updateSuratMasuk(initialData.id, {
        noAgenda,
        noSurat,
        tanggalSurat,
        tanggalTerima,
        asalSurat,
        ditujukanKepada,
        perihal,
        ringkasan,
        kodeKlasifikasi,
        sifat,
        lokasiArsip,
        fileName,
        fileSize,
      });
      onSaved({
        ...initialData,
        noAgenda,
        noSurat,
        tanggalSurat,
        tanggalTerima,
        asalSurat,
        ditujukanKepada,
        perihal,
        ringkasan,
        kodeKlasifikasi,
        sifat,
        lokasiArsip,
        fileName,
        fileSize,
      });
    } else {
      const created = addSuratMasuk({
        noAgenda,
        noSurat,
        tanggalSurat,
        tanggalTerima,
        asalSurat,
        ditujukanKepada,
        perihal,
        ringkasan,
        kodeKlasifikasi,
        sifat,
        lokasiArsip,
        fileName,
        fileSize,
      });
      onSaved(created);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-2xl my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 rounded-t-xl shrink-0">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isEdit ? 'Ubah Data Surat Masuk' : 'Pencatatan Surat Masuk Baru'}
            </h3>
            <p className="text-xs text-slate-500">
              Formulir penerimaan dan pencatatan nomor agenda surat masuk
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Row 1: Nomor Agenda & Nomor Surat Asli */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Agenda Penerimaan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={noAgenda}
                onChange={(e) => setNoAgenda(e.target.value)}
                placeholder="AGD/2026/03/001"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <span className="text-[10px] text-slate-600">Nomor urut buku agenda dinas</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Surat Asal <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={noSurat}
                onChange={(e) => setNoSurat(e.target.value)}
                placeholder="Contoh: 421.3/108/Disdik/2026"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <span className="text-[10px] text-slate-600">Nomor tercetak pada naskah surat fisik</span>
            </div>
          </div>

          {/* Row 2: Tanggal Surat & Tanggal Diterima */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Pada Surat <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={tanggalSurat}
                onChange={(e) => setTanggalSurat(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Diterima di TU <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={tanggalTerima}
                onChange={(e) => setTanggalTerima(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Row 3: Pengirim & Tujuan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Asal Surat / Pengirim <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={asalSurat}
                onChange={(e) => setAsalSurat(e.target.value)}
                placeholder="Contoh: Dinas Pendidikan Provinsi DKI Jakarta"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ditujukan Kepada <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={ditujukanKepada}
                onChange={(e) => setDitujukanKepada(e.target.value)}
                placeholder="Contoh: Kepala SMKN 1 Jakarta"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Row 4: Perihal & Ringkasan */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Perihal / Hal Surat <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={perihal}
              onChange={(e) => setPerihal(e.target.value)}
              placeholder="Contoh: Undangan Rapat Koordinasi ANBK 2026 Tingkat Provinsi"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Ringkasan Isi Surat
            </label>
            <textarea
              rows={2}
              value={ringkasan}
              onChange={(e) => setRingkasan(e.target.value)}
              placeholder="Ringkasan poin penting surat yang relevan bagi pimpinan..."
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Row 5: Klasifikasi, Sifat, Lokasi Berkas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kode Klasifikasi <span className="text-rose-500">*</span>
              </label>
              <select
                value={kodeKlasifikasi}
                onChange={(e) => setKodeKlasifikasi(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                {klasifikasiList.map((k) => (
                  <option key={k.kode} value={k.kode}>
                    {k.kode} — {k.nama}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tingkat Keamanan / Sifat <span className="text-rose-500">*</span>
              </label>
              <select
                value={sifat}
                onChange={(e) => setSifat(e.target.value as SuratSifat)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="biasa">Biasa / Terbuka</option>
                <option value="penting">Penting</option>
                <option value="rahasia">Rahasia</option>
                <option value="sangat_rahasia">Sangat Rahasia</option>
                <option value="segera">Segera / Kilat</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Lokasi Berkas Fisik <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={lokasiArsip}
                onChange={(e) => setLokasiArsip(e.target.value)}
                placeholder="Bantex 2026/A-01 (Lemari B)"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Lampiran Dokumen Digital */}
          <div className="rounded-lg border border-dashed border-slate-300 p-4 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white p-2 border border-slate-200">
                <FileText className="h-6 w-6 text-emerald-700" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-slate-900">{fileName}</div>
                <div className="text-[11px] text-slate-500">Berkas digital terlampir · {fileSize}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFileName(`Scan_Surat_${Date.now().toString().slice(-4)}.pdf`);
                  setFileSize('1.8 MB');
                }}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline"
              >
                Ganti Berkas
              </button>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              {isEdit ? 'Simpan Perubahan' : 'Simpan Surat Masuk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
