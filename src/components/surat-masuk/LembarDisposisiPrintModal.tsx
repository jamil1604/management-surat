import React from 'react';
import { SuratMasuk } from '../../types';
import { useApp } from '../../context/AppContext';
import { Printer, X } from 'lucide-react';

interface LembarDisposisiPrintModalProps {
  surat: SuratMasuk;
  onClose: () => void;
}

export const LembarDisposisiPrintModal: React.FC<LembarDisposisiPrintModalProps> = ({
  surat,
  onClose,
}) => {
  const { instansiProfile, users } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const pimpinanUser = users.find((u) => u.role === 'pimpinan') || {
    name: instansiProfile.kepalaNama,
    nip: instansiProfile.kepalaNip,
    jabatan: instansiProfile.kepalaJabatan,
  };

  const standarInstruksi = [
    'Tindak lanjuti segera',
    'Pelajari & beri telaah',
    'Siapkan bahan / draf jawaban',
    'Hadiri / wakili pimpinan',
    'Koordinasikan dengan bidang terkait',
    'Arsipkan / untuk diketahui',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-xl bg-white shadow-2xl my-8">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 rounded-t-xl">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Pratinjau Lembar Disposisi Resmi
            </h3>
            <p className="text-xs text-slate-500">
              Format baku tata naskah dinas siap cetak ke printer / PDF
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak Lembar Disposisi</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas (A4 Standard) */}
        <div className="print-container p-8 sm:p-12 text-black bg-white max-w-[800px] mx-auto text-xs font-serif leading-normal">
          {/* Kop Surat Resmi */}
          <div className="flex items-center gap-4 border-b-2 border-black pb-3 mb-4 text-center">
            {instansiProfile.logoUrl && (
              <img
                src={instansiProfile.logoUrl}
                alt="Logo Instansi"
                className="h-20 w-20 object-contain shrink-0"
              />
            )}
            <div className="flex-1 font-sans">
              <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                {instansiProfile.namaInstansi}
              </h4>
              <h3 className="text-sm font-bold uppercase tracking-wide text-black">
                {instansiProfile.subInstansi}
              </h3>
              <h2 className="text-base font-extrabold uppercase text-black">
                {instansiProfile.unitKerja}
              </h2>
              <p className="text-[10px] text-gray-700 leading-tight mt-0.5">
                {instansiProfile.alamat}, {instansiProfile.kota} {instansiProfile.kodePos}
                <br />
                Telp: {instansiProfile.telepon} · Pos-el: {instansiProfile.email} · Laman: {instansiProfile.website}
              </p>
            </div>
          </div>

          {/* Judul Dokumen */}
          <div className="text-center my-3 font-sans">
            <h1 className="text-sm font-bold uppercase tracking-widest underline">
              LEMBAR DISPOSISI
            </h1>
            <p className="text-[10px] text-gray-600 font-mono mt-0.5">
              NO. AGENDA: {surat.noAgenda}
            </p>
          </div>

          {/* Tabel Informasi Surat Masuk */}
          <table className="w-full border-collapse border border-black font-sans text-xs mb-4">
            <tbody>
              <tr>
                <td className="border border-black p-2 bg-gray-50 font-semibold w-1/4">
                  Surat Dari
                </td>
                <td className="border border-black p-2 w-3/4" colSpan={3}>
                  {surat.asalSurat}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 bg-gray-50 font-semibold">
                  Nomor Surat
                </td>
                <td className="border border-black p-2 w-1/4">
                  {surat.noSurat}
                </td>
                <td className="border border-black p-2 bg-gray-50 font-semibold w-1/4">
                  Tanggal Surat
                </td>
                <td className="border border-black p-2 w-1/4 font-mono">
                  {surat.tanggalSurat}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 bg-gray-50 font-semibold">
                  Tanggal Terima
                </td>
                <td className="border border-black p-2 font-mono">
                  {surat.tanggalTerima}
                </td>
                <td className="border border-black p-2 bg-gray-50 font-semibold">
                  Tingkat Keamanan / Sifat
                </td>
                <td className="border border-black p-2 uppercase font-bold">
                  [ {surat.sifat.toUpperCase()} ]
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 bg-gray-50 font-semibold align-top">
                  Perihal / Hal
                </td>
                <td className="border border-black p-2 align-top" colSpan={3}>
                  <strong className="block mb-1">{surat.perihal}</strong>
                  {surat.ringkasan && (
                    <span className="text-[11px] text-gray-700 italic block">
                      Ringkasan: {surat.ringkasan}
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="border border-black p-2 bg-gray-50 font-semibold">
                  Lokasi Berkas Fisik
                </td>
                <td className="border border-black p-2" colSpan={3}>
                  {surat.lokasiArsip}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Grid Disposisi: Penerima & Instruksi */}
          <div className="grid grid-cols-2 border border-black font-sans text-xs mb-4">
            {/* Kolom Diteruskan Kepada */}
            <div className="border-r border-black p-3">
              <h4 className="font-bold uppercase tracking-wider text-[11px] border-b border-black pb-1 mb-2">
                Diteruskan Kepada Sdr :
              </h4>
              <div className="space-y-1.5 text-[11px]">
                {users
                  .filter((u) => u.role === 'staff' || u.role === 'petugas_tu')
                  .map((u) => {
                    const isAssigned = surat.disposisiList.some((d) => d.kepadaUserId === u.id);
                    return (
                      <div key={u.id} className="flex items-center gap-2">
                        <span className="inline-block h-3.5 w-3.5 border border-black text-center text-[10px] font-bold leading-3">
                          {isAssigned ? '✓' : ''}
                        </span>
                        <span className={isAssigned ? 'font-bold' : ''}>
                          {u.jabatan} ({u.name.split(',')[0]})
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Kolom Isi Instruksi Disposisi */}
            <div className="p-3">
              <h4 className="font-bold uppercase tracking-wider text-[11px] border-b border-black pb-1 mb-2">
                Instruksi / Catatan Pimpinan :
              </h4>
              <div className="space-y-1 text-[11px]">
                {standarInstruksi.map((ins, idx) => {
                  const isChecked = surat.disposisiList.some((d) =>
                    d.instruksi.some((i) => i.toLowerCase().includes(ins.toLowerCase().slice(0, 10)))
                  );
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="inline-block h-3.5 w-3.5 border border-black text-center text-[10px] font-bold leading-3">
                        {isChecked ? '✓' : ''}
                      </span>
                      <span className={isChecked ? 'font-bold' : ''}>{ins}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Kotak Catatan Khusus Pimpinan & Riwayat Disposisi */}
          <div className="border border-black p-3 font-sans text-xs mb-4">
            <h4 className="font-bold uppercase text-[11px] mb-1">
              Catatan Khusus Pimpinan :
            </h4>
            <div className="min-h-[60px] p-2 bg-gray-50 border border-dashed border-gray-300 text-xs">
              {surat.disposisiList.length > 0 ? (
                surat.disposisiList.map((disp, i) => (
                  <div key={i} className="mb-2 last:mb-0">
                    <span className="font-bold underline">{disp.dariNama}:</span>
                    <p className="mt-0.5">{disp.catatan}</p>
                    <div className="mt-1 text-[10px] text-gray-600">
                      Batas waktu penyelesaian: {disp.batasWaktu}
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-gray-400 italic">
                  (Belum ada instruksi disposisi tertulis)
                </span>
              )}
            </div>
          </div>

          {/* Kolom Tanda Tangan Pimpinan */}
          <div className="flex justify-end font-sans text-xs mt-6">
            <div className="text-center w-64">
              <p>Jakarta, {surat.tanggalTerima}</p>
              <p className="font-bold mt-1">{instansiProfile.kepalaJabatan}</p>
              <div className="h-16 flex items-center justify-center italic text-gray-400">
                ( Paraf / Tanda Tangan Digital )
              </div>
              <p className="font-bold underline">{pimpinanUser.name}</p>
              <p className="text-[10px] font-mono">NIP. {pimpinanUser.nip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
