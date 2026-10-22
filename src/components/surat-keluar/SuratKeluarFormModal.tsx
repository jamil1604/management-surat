import React, { useState } from 'react';
import { SuratKeluar, SuratSifat, StatusSuratKeluar } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, FileText, Check } from 'lucide-react';

interface SuratKeluarFormModalProps {
  initialData?: SuratKeluar | null;
  onClose: () => void;
  onSaved: (surat: SuratKeluar) => void;
}

export const SuratKeluarFormModal: React.FC<SuratKeluarFormModalProps> = ({
  initialData,
  onClose,
  onSaved,
}) => {
  const {
    addSuratKeluar,
    updateSuratKeluar,
    generateNextNoAgendaKeluar,
    klasifikasiList,
    instansiProfile,
    currentUser,
  } = useApp();

  const isEdit = Boolean(initialData);

  const [noAgenda, setNoAgenda] = useState(
    initialData ? initialData.noAgenda : generateNextNoAgendaKeluar()
  );
  const [kodeKlasifikasi, setKodeKlasifikasi] = useState(
    initialData?.kodeKlasifikasi || klasifikasiList[0]?.kode || '005'
  );

  const defaultNoSurat = `${kodeKlasifikasi}/${String(Date.now()).slice(-3)}/SMKN1/TU/${new Date().getFullYear()}`;
  const [noSurat, setNoSurat] = useState(initialData?.noSurat || defaultNoSurat);

  const [tanggalSurat, setTanggalSurat] = useState(
    initialData?.tanggalSurat || new Date().toISOString().split('T')[0]
  );
  const [tanggalKirim, setTanggalKirim] = useState(initialData?.tanggalKirim || '');
  const [tujuanSurat, setTujuanSurat] = useState(initialData?.tujuanSurat || '');
  const [alamatTujuan, setAlamatTujuan] = useState(initialData?.alamatTujuan || '');
  const [perihal, setPerihal] = useState(initialData?.perihal || '');
  const [isiSurat, setIsSurat] = useState(
    initialData?.isiSurat ||
      'Sehubungan dengan rencana pelaksanaan kegiatan dinas, dengan hormat kami sampaikan permohonan kerjasama dan koordinasi teknis...'
  );
  const [sifat, setSifat] = useState<SuratSifat>(initialData?.sifat || 'biasa');
  const [statusPersetujuan, setStatusPersetujuan] = useState<StatusSuratKeluar>(
    initialData?.statusPersetujuan || 'menunggu_persetujuan'
  );
  const [penandatangan, setPenandatangan] = useState(
    initialData?.penandatangan || instansiProfile.kepalaNama
  );
  const [nipPenandatangan, setNipPenandatangan] = useState(
    initialData?.nipPenandatangan || instansiProfile.kepalaNip
  );
  const [pengonsep, setPengonsep] = useState(
    initialData?.pengonsep || currentUser.name
  );
  const [lokasiArsip, setLokasiArsip] = useState(
    initialData?.lokasiArsip || 'Bantex SK 2026/A-01 (Lemari TU)'
  );
  const [fileName, setFileName] = useState(
    initialData?.fileName || 'Draf_Naskah_Dinas_Keluar.pdf'
  );
  const [fileSize, setFileSize] = useState(initialData?.fileSize || '650 KB');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && initialData) {
      updateSuratKeluar(initialData.id, {
        noAgenda,
        noSurat,
        tanggalSurat,
        tanggalKirim,
        tujuanSurat,
        alamatTujuan,
        perihal,
        isiSurat,
        kodeKlasifikasi,
        sifat,
        statusPersetujuan,
        penandatangan,
        nipPenandatangan,
        pengonsep,
        lokasiArsip,
        fileName,
        fileSize,
      });
      onSaved({
        ...initialData,
        noAgenda,
        noSurat,
        tanggalSurat,
        tanggalKirim,
        tujuanSurat,
        alamatTujuan,
        perihal,
        isiSurat,
        kodeKlasifikasi,
        sifat,
        statusPersetujuan,
        penandatangan,
        nipPenandatangan,
        pengonsep,
        lokasiArsip,
        fileName,
        fileSize,
      });
    } else {
      const created = addSuratKeluar({
        noAgenda,
        noSurat,
        tanggalSurat,
        tanggalKirim,
        tujuanSurat,
        alamatTujuan,
        perihal,
        isiSurat,
        kodeKlasifikasi,
        sifat,
        statusPersetujuan,
        penandatangan,
        nipPenandatangan,
        pengonsep,
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
              {isEdit ? 'Ubah Data Surat Keluar' : 'Buat Naskah Surat Keluar Baru'}
            </h3>
            <p className="text-xs text-slate-500">
              Penyusunan draf, penomoran resmi, dan pengajuan persetujuan pimpinan
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
          {/* Row 1: Nomor Agenda & Nomor Surat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Agenda Keluar <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={noAgenda}
                onChange={(e) => setNoAgenda(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <span className="text-[10px] text-slate-600">Nomor urut buku ekspedisi keluar</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Surat Keluar Resmi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={noSurat}
                onChange={(e) => setNoSurat(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <span className="text-[10px] text-slate-600">Format: [Klasifikasi]/[No Urut]/[Satker]/[Tahun]</span>
            </div>
          </div>

          {/* Row 2: Tanggal Surat & Tanggal Kirim */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Surat <span className="text-rose-500">*</span>
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
                Tanggal Pengiriman / Ekspedisi
              </label>
              <input
                type="date"
                value={tanggalKirim}
                onChange={(e) => setTanggalKirim(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <span className="text-[10px] text-slate-600">Kosongkan jika masih draf naskah</span>
            </div>
          </div>

          {/* Row 3: Tujuan Surat & Alamat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tujuan Surat / Penerima <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={tujuanSurat}
                onChange={(e) => setTujuanSurat(e.target.value)}
                placeholder="Contoh: Kepala Dinas Pendidikan Provinsi DKI Jakarta"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Alamat / Kota Penerima
              </label>
              <input
                type="text"
                value={alamatTujuan}
                onChange={(e) => setAlamatTujuan(e.target.value)}
                placeholder="Contoh: Jl. Gatot Subroto Kav. 40-41, Jakarta Selatan"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Row 4: Perihal & Isi Naskah */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Perihal / Hal Surat <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={perihal}
              onChange={(e) => setPerihal(e.target.value)}
              placeholder="Contoh: Permohonan Narasumber Workshop Guru Produktif"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Batang Tubuh / Isi Naskah Dinas
            </label>
            <textarea
              rows={4}
              value={isiSurat}
              onChange={(e) => setIsSurat(e.target.value)}
              placeholder="Tuliskan uraian maksud surat dinas secara lengkap dan formal..."
              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 leading-relaxed font-sans"
            />
          </div>

          {/* Row 5: Klasifikasi, Sifat, Status Persetujuan */}
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
                <option value="segera">Segera / Kilat</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Status Persetujuan <span className="text-rose-500">*</span>
              </label>
              <select
                value={statusPersetujuan}
                onChange={(e) => setStatusPersetujuan(e.target.value as StatusSuratKeluar)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="draft">Draf Awal</option>
                <option value="menunggu_persetujuan">Menunggu TTD Pimpinan</option>
                <option value="disetujui">Telah Disetujui</option>
                <option value="terkirim">Terkirim ke Ekspedisi</option>
              </select>
            </div>
          </div>

          {/* Row 6: Penandatangan & Pengonsep */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pejabat Penandatangan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={penandatangan}
                onChange={(e) => setPenandatangan(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NIP Penandatangan
              </label>
              <input
                type="text"
                value={nipPenandatangan}
                onChange={(e) => setNipPenandatangan(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Pengonsep Naskah <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={pengonsep}
                onChange={(e) => setPengonsep(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Row 7: Lokasi Arsip Pertinggal */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Lokasi Berkas Pertinggal / Arsip Fisik <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={lokasiArsip}
              onChange={(e) => setLokasiArsip(e.target.value)}
              placeholder="Bantex SK 2026/A-01"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
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
              {isEdit ? 'Simpan Perubahan' : 'Buat Surat Keluar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
