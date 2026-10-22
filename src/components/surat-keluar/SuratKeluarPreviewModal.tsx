import React from 'react';
import { SuratKeluar } from '../../types';
import { useApp } from '../../context/AppContext';
import { Printer, X, CheckCircle2 } from 'lucide-react';

interface SuratKeluarPreviewModalProps {
  surat: SuratKeluar;
  onClose: () => void;
  onApprove?: () => void;
}

export const SuratKeluarPreviewModal: React.FC<SuratKeluarPreviewModalProps> = ({
  surat,
  onClose,
  onApprove,
}) => {
  const { instansiProfile, currentUser } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const isPimpinan = currentUser.role === 'pimpinan' || currentUser.role === 'admin';
  const needsApproval = surat.statusPersetujuan === 'menunggu_persetujuan';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-xl bg-white shadow-2xl my-8 flex flex-col max-h-[92vh]">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 rounded-t-xl shrink-0">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Pratinjau Naskah Dinas Keluar Resmi
            </h3>
            <p className="text-xs text-slate-500">
              Format baku korespondensi dinas perkantoran siap cetak
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isPimpinan && needsApproval && onApprove && (
              <button
                onClick={onApprove}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Setujui & Tanda Tangani</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak Surat</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Letterhead Paper Canvas */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-12">
          <div className="print-container text-black bg-white max-w-[800px] mx-auto text-xs font-serif leading-relaxed">
            {/* Kop Surat Resmi */}
            <div className="flex items-center gap-4 border-b-2 border-black pb-3 mb-6 text-center">
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

            {/* Nomor, Lampiran, Hal & Tanggal Surat */}
            <div className="flex justify-between items-start mb-6 font-sans text-xs">
              <table className="w-1/2">
                <tbody>
                  <tr>
                    <td className="w-24 font-semibold">Nomor</td>
                    <td>: {surat.noSurat}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Sifat</td>
                    <td className="uppercase">: {surat.sifat}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Lampiran</td>
                    <td>: 1 (satu) Berkas</td>
                  </tr>
                  <tr>
                    <td className="font-semibold align-top">Hal</td>
                    <td className="font-bold align-top">: {surat.perihal}</td>
                  </tr>
                </tbody>
              </table>

              <div className="text-right">
                <p>Jakarta, {surat.tanggalSurat}</p>
              </div>
            </div>

            {/* Kepada Yth */}
            <div className="mb-6 font-sans text-xs">
              <p>Kepada Yth.</p>
              <p className="font-bold">{surat.tujuanSurat}</p>
              {surat.alamatTujuan && <p className="text-gray-700">{surat.alamatTujuan}</p>}
              <p>di Tempat</p>
            </div>

            {/* Isi Surat */}
            <div className="space-y-4 text-justify font-sans text-xs leading-relaxed min-h-[220px]">
              <p>Dengan hormat,</p>
              <p>
                {surat.isiSurat || (
                  <>
                    Sehubungan dengan pelaksanaan program kerja dinas dan dalam rangka optimalisasi tata kelola administrasi perkantoran, bersama ini kami sampaikan maksud sebagaimana tercantum pada perihal surat di atas.
                  </>
                )}
              </p>
              <p>
                Demikian surat ini kami sampaikan. Atas perhatian, dukungan, dan kerja sama yang baik dari Bapak/Ibu, kami ucapkan terima kasih.
              </p>
            </div>

            {/* Tanda Tangan Pejabat */}
            <div className="flex justify-end font-sans text-xs mt-10">
              <div className="text-center w-72">
                <p className="font-semibold">{instansiProfile.kepalaJabatan},</p>
                
                {/* Visual Signature or Approval Seal */}
                <div className="h-20 flex flex-col items-center justify-center">
                  {surat.statusPersetujuan === 'disetujui' || surat.statusPersetujuan === 'terkirim' ? (
                    <div className="border border-emerald-600 rounded p-1.5 text-center bg-emerald-50 text-[10px] text-emerald-800">
                      <div className="font-bold flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> TERSERTIFIKASI DIGITAL
                      </div>
                      <div className="font-mono text-[9px] mt-0.5">
                        {surat.tanggalKirim || surat.tanggalSurat}
                      </div>
                    </div>
                  ) : (
                    <span className="italic text-gray-400">( Menunggu Tanda Tangan )</span>
                  )}
                </div>

                <p className="font-bold underline">{surat.penandatangan || instansiProfile.kepalaNama}</p>
                <p className="text-[10px] font-mono">
                  NIP. {surat.nipPenandatangan || instansiProfile.kepalaNip}
                </p>
              </div>
            </div>

            {/* Tembusan & Pengonsep */}
            <div className="mt-8 pt-4 border-t border-gray-300 font-sans text-[10px] text-gray-600 flex justify-between items-end">
              <div>
                <p className="font-bold">Tembusan disampaikan kepada Yth:</p>
                <ol className="list-decimal list-inside">
                  <li>Kepala Dinas Pendidikan Provinsi DKI Jakarta</li>
                  <li>Pertinggal / Arsiparis ({surat.lokasiArsip})</li>
                </ol>
              </div>
              <div className="text-right font-mono text-[9px]">
                No. Agenda: {surat.noAgenda} · Konsep: {surat.pengonsep}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
