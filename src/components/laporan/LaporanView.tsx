import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Printer,
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  BookOpen,
  Inbox,
  Send,
  PieChart,
  CheckCircle2,
} from 'lucide-react';

export const LaporanView: React.FC = () => {
  const {
    suratMasukList,
    suratKeluarList,
    klasifikasiList,
    instansiProfile,
    currentUser,
  } = useApp();

  // Active Report Tab: 'masuk' | 'keluar' | 'rekap'
  const [activeTab, setActiveTab] = useState<'masuk' | 'keluar' | 'rekap'>('masuk');

  // Date Range Filters
  const [periodePreset, setPeriodePreset] = useState<'semua' | 'bulan_ini' | 'tahun_ini' | 'custom'>('semua');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [klasifikasiFilter, setKlasifikasiFilter] = useState('all');

  // Filtered Surat Masuk for Report
  const filteredMasuk = useMemo(() => {
    return suratMasukList.filter((item) => {
      if (klasifikasiFilter !== 'all' && item.kodeKlasifikasi !== klasifikasiFilter) {
        return false;
      }

      if (periodePreset === 'bulan_ini') {
        const itemDate = new Date(item.tanggalTerima);
        const now = new Date();
        if (
          itemDate.getMonth() !== now.getMonth() ||
          itemDate.getFullYear() !== now.getFullYear()
        ) {
          return false;
        }
      } else if (periodePreset === 'tahun_ini') {
        const itemDate = new Date(item.tanggalTerima);
        const now = new Date();
        if (itemDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      } else if (periodePreset === 'custom') {
        if (startDate && item.tanggalTerima < startDate) return false;
        if (endDate && item.tanggalTerima > endDate) return false;
      }

      return true;
    });
  }, [suratMasukList, klasifikasiFilter, periodePreset, startDate, endDate]);

  // Filtered Surat Keluar for Report
  const filteredKeluar = useMemo(() => {
    return suratKeluarList.filter((item) => {
      if (klasifikasiFilter !== 'all' && item.kodeKlasifikasi !== klasifikasiFilter) {
        return false;
      }

      if (periodePreset === 'bulan_ini') {
        const itemDate = new Date(item.tanggalSurat);
        const now = new Date();
        if (
          itemDate.getMonth() !== now.getMonth() ||
          itemDate.getFullYear() !== now.getFullYear()
        ) {
          return false;
        }
      } else if (periodePreset === 'tahun_ini') {
        const itemDate = new Date(item.tanggalSurat);
        const now = new Date();
        if (itemDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      } else if (periodePreset === 'custom') {
        if (startDate && item.tanggalSurat < startDate) return false;
        if (endDate && item.tanggalSurat > endDate) return false;
      }

      return true;
    });
  }, [suratKeluarList, klasifikasiFilter, periodePreset, startDate, endDate]);

  // Handle Direct Print
  const handlePrint = () => {
    window.print();
  };

  // Handle Export to CSV (Excel Compatible)
  const handleExportCSV = () => {
    let csvContent = '\uFEFF'; // UTF-8 BOM for Excel

    if (activeTab === 'masuk') {
      csvContent += 'BUKU AGENDA SURAT MASUK\n';
      csvContent += `Instansi: ${instansiProfile.unitKerja}\n`;
      csvContent += `Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}\n\n`;
      csvContent += 'No Urut;No Agenda;No Surat;Tanggal Surat;Tanggal Terima;Pengirim (Asal);Perihal;Sifat;Lokasi Arsip;Status Disposisi;Penerima Disposisi\n';

      filteredMasuk.forEach((item, index) => {
        const disposisiNames = item.disposisiList.map((d) => d.kepadaNama).join(', ');
        const row = [
          index + 1,
          `"${item.noAgenda}"`,
          `"${item.noSurat}"`,
          `"${item.tanggalSurat}"`,
          `"${item.tanggalTerima}"`,
          `"${item.asalSurat}"`,
          `"${item.perihal.replace(/"/g, '""')}"`,
          `"${item.sifat}"`,
          `"${item.lokasiArsip}"`,
          `"${item.statusDisposisi}"`,
          `"${disposisiNames}"`,
        ].join(';');
        csvContent += row + '\n';
      });

      downloadFile(csvContent, `Buku_Agenda_Surat_Masuk_${Date.now()}.csv`);
    } else {
      csvContent += 'BUKU AGENDA SURAT KELUAR\n';
      csvContent += `Instansi: ${instansiProfile.unitKerja}\n`;
      csvContent += `Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}\n\n`;
      csvContent += 'No Urut;No Agenda;No Surat;Tanggal Surat;Tanggal Kirim;Tujuan (Penerima);Alamat;Perihal;Sifat;Status Persetujuan;Pengonsep;Penandatangan\n';

      filteredKeluar.forEach((item, index) => {
        const row = [
          index + 1,
          `"${item.noAgenda}"`,
          `"${item.noSurat}"`,
          `"${item.tanggalSurat}"`,
          `"${item.tanggalKirim || '-'}"`,
          `"${item.tujuanSurat}"`,
          `"${item.alamatTujuan || '-'}"`,
          `"${item.perihal.replace(/"/g, '""')}"`,
          `"${item.sifat}"`,
          `"${item.statusPersetujuan}"`,
          `"${item.pengonsep}"`,
          `"${item.penandatangan}"`,
        ].join(';');
        csvContent += row + '\n';
      });

      downloadFile(csvContent, `Buku_Agenda_Surat_Keluar_${Date.now()}.csv`);
    }
  };

  const downloadFile = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Controls (Hidden in Print) */}
      <div className="no-print space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Laporan & Buku Agenda Persuratan
            </h2>
            <p className="text-xs text-slate-500">
              Cetak buku agenda fisik dinas atau ekspor data ke format Excel / CSV
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Download className="h-4 w-4 text-emerald-700" />
              <span>Ekspor Excel (CSV)</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('masuk')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'masuk'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Inbox className="h-4 w-4" />
            <span>Buku Agenda Surat Masuk ({filteredMasuk.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('keluar')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'keluar'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="h-4 w-4" />
            <span>Buku Agenda Surat Keluar ({filteredKeluar.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('rekap')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'rekap'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PieChart className="h-4 w-4" />
            <span>Rekapitulasi Statistik</span>
          </button>
        </div>

        {/* Filter Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Periode:</span>
              <select
                value={periodePreset}
                onChange={(e) => setPeriodePreset(e.target.value as any)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-800"
              >
                <option value="semua">Semua Periode</option>
                <option value="bulan_ini">Bulan Berjalan</option>
                <option value="tahun_ini">Tahun Berjalan (2026)</option>
                <option value="custom">Rentang Tanggal Khusus</option>
              </select>
            </div>

            {periodePreset === 'custom' && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                />
                <span className="text-slate-400">s/d</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Klasifikasi:</span>
              <select
                value={klasifikasiFilter}
                onChange={(e) => setKlasifikasiFilter(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-800 max-w-[200px]"
              >
                <option value="all">Semua Kode Klasifikasi</option>
                {klasifikasiList.map((k) => (
                  <option key={k.kode} value={k.kode}>
                    {k.kode} - {k.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div className="print-container bg-white p-6 sm:p-10 rounded-xl border border-slate-200 shadow-xs text-xs font-serif leading-normal">
        {/* Official Letterhead in Print Report */}
        <div className="flex items-center gap-4 border-b-2 border-black pb-3 mb-5 text-center font-sans">
          {instansiProfile.logoUrl && (
            <img
              src={instansiProfile.logoUrl}
              alt="Logo"
              className="h-16 w-16 object-contain shrink-0"
            />
          )}
          <div className="flex-1">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-black">
              {instansiProfile.namaInstansi}
            </h4>
            <h3 className="text-xs font-bold uppercase text-black">
              {instansiProfile.subInstansi}
            </h3>
            <h2 className="text-sm font-extrabold uppercase text-black">
              {instansiProfile.unitKerja}
            </h2>
            <p className="text-[10px] text-gray-700 leading-tight">
              {instansiProfile.alamat}, {instansiProfile.kota} {instansiProfile.kodePos} · Telp: {instansiProfile.telepon}
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-5 font-sans">
          <h2 className="text-sm font-bold uppercase tracking-wider underline">
            {activeTab === 'masuk'
              ? 'BUKU AGENDA SURAT MASUK'
              : activeTab === 'keluar'
              ? 'BUKU AGENDA SURAT KELUAR'
              : 'REKAPITULASI LAPORAN PERSURATAN'}
          </h2>
          <p className="text-[10px] text-gray-600 font-mono mt-0.5">
            Periode: {periodePreset === 'semua' ? 'Keseluruhan' : periodePreset.replace('_', ' ').toUpperCase()} · Tanggal Unduh: {new Date().toLocaleDateString('id-ID')}
          </p>
        </div>

        {/* Tab 1: Buku Agenda Surat Masuk */}
        {activeTab === 'masuk' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-black font-sans text-[11px]">
              <thead className="bg-gray-100 font-bold text-center">
                <tr>
                  <th className="border border-black p-2 w-10">No</th>
                  <th className="border border-black p-2 w-28">No. Agenda</th>
                  <th className="border border-black p-2 w-24">Tgl Terima</th>
                  <th className="border border-black p-2 w-36">Nomor & Tanggal Surat</th>
                  <th className="border border-black p-2">Asal Surat (Pengirim)</th>
                  <th className="border border-black p-2">Perihal / Isi Ringkas</th>
                  <th className="border border-black p-2 w-28">Diteruskan Kepada</th>
                  <th className="border border-black p-2 w-20">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMasuk.map((item, idx) => {
                  const recipients = item.disposisiList.map((d) => d.kepadaNama.split(',')[0]).join(', ');
                  return (
                    <tr key={item.id} className="align-top hover:bg-gray-50">
                      <td className="border border-black p-2 text-center tabular-nums font-mono">
                        {idx + 1}
                      </td>
                      <td className="border border-black p-2 font-mono font-bold">
                        {item.noAgenda}
                      </td>
                      <td className="border border-black p-2 font-mono text-center">
                        {item.tanggalTerima}
                      </td>
                      <td className="border border-black p-2">
                        <div className="font-semibold">{item.noSurat}</div>
                        <div className="text-[10px] text-gray-600 font-mono">
                          Tgl: {item.tanggalSurat}
                        </div>
                      </td>
                      <td className="border border-black p-2 font-medium">
                        {item.asalSurat}
                      </td>
                      <td className="border border-black p-2">
                        <div className="font-medium">{item.perihal}</div>
                        <div className="text-[10px] text-gray-600 mt-0.5">
                          Arsip: {item.lokasiArsip}
                        </div>
                      </td>
                      <td className="border border-black p-2 text-[10px]">
                        {recipients || '-'}
                      </td>
                      <td className="border border-black p-2 text-center font-bold text-[10px] uppercase">
                        {item.statusDisposisi}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Buku Agenda Surat Keluar */}
        {activeTab === 'keluar' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-black font-sans text-[11px]">
              <thead className="bg-gray-100 font-bold text-center">
                <tr>
                  <th className="border border-black p-2 w-10">No</th>
                  <th className="border border-black p-2 w-28">No. Agenda</th>
                  <th className="border border-black p-2 w-36">Nomor Surat Resmi</th>
                  <th className="border border-black p-2 w-24">Tgl Surat</th>
                  <th className="border border-black p-2">Tujuan (Penerima)</th>
                  <th className="border border-black p-2">Perihal</th>
                  <th className="border border-black p-2 w-24">Pengonsep</th>
                  <th className="border border-black p-2 w-20">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredKeluar.map((item, idx) => (
                  <tr key={item.id} className="align-top hover:bg-gray-50">
                    <td className="border border-black p-2 text-center tabular-nums font-mono">
                      {idx + 1}
                    </td>
                    <td className="border border-black p-2 font-mono font-bold">
                      {item.noAgenda}
                    </td>
                    <td className="border border-black p-2 font-semibold">
                      {item.noSurat}
                    </td>
                    <td className="border border-black p-2 font-mono text-center">
                      {item.tanggalSurat}
                    </td>
                    <td className="border border-black p-2 font-medium">
                      <div>{item.tujuanSurat}</div>
                      {item.alamatTujuan && (
                        <div className="text-[10px] text-gray-600">{item.alamatTujuan}</div>
                      )}
                    </td>
                    <td className="border border-black p-2">
                      <div className="font-medium">{item.perihal}</div>
                      <div className="text-[10px] text-gray-600 mt-0.5">
                        Arsip: {item.lokasiArsip}
                      </div>
                    </td>
                    <td className="border border-black p-2 text-[10px]">
                      {item.pengonsep.split(',')[0]}
                    </td>
                    <td className="border border-black p-2 text-center font-bold text-[10px] uppercase">
                      {item.statusPersetujuan.replace('_', ' ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Rekapitulasi Statistik */}
        {activeTab === 'rekap' && (
          <div className="space-y-6 font-sans">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border border-black p-4 text-center">
                <div className="text-[11px] font-bold uppercase text-gray-600">Surat Masuk</div>
                <div className="text-2xl font-bold mt-1 tabular-nums">{suratMasukList.length}</div>
              </div>
              <div className="border border-black p-4 text-center">
                <div className="text-[11px] font-bold uppercase text-gray-600">Surat Keluar</div>
                <div className="text-2xl font-bold mt-1 tabular-nums">{suratKeluarList.length}</div>
              </div>
              <div className="border border-black p-4 text-center">
                <div className="text-[11px] font-bold uppercase text-gray-600">Tuntas Disposisi</div>
                <div className="text-2xl font-bold mt-1 tabular-nums text-emerald-800">
                  {suratMasukList.filter((s) => s.statusDisposisi === 'selesai').length}
                </div>
              </div>
              <div className="border border-black p-4 text-center">
                <div className="text-[11px] font-bold uppercase text-gray-600">Surat Keluar Terkirim</div>
                <div className="text-2xl font-bold mt-1 tabular-nums text-blue-800">
                  {suratKeluarList.filter((s) => s.statusPersetujuan === 'terkirim' || s.statusPersetujuan === 'disetujui').length}
                </div>
              </div>
            </div>

            <div className="border border-black p-4">
              <h4 className="font-bold uppercase text-xs mb-3 border-b border-black pb-1">
                Tabel Rekapitulasi Berdasarkan Kode Klasifikasi
              </h4>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-black text-left font-bold">
                    <th className="py-2">Kode</th>
                    <th className="py-2">Urusan / Jenis Klasifikasi</th>
                    <th className="py-2 text-center">Masuk</th>
                    <th className="py-2 text-center">Keluar</th>
                    <th className="py-2 text-right">Total Naskah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {klasifikasiList.map((k) => {
                    const mCount = suratMasukList.filter((s) => s.kodeKlasifikasi === k.kode).length;
                    const kCount = suratKeluarList.filter((s) => s.kodeKlasifikasi === k.kode).length;
                    return (
                      <tr key={k.kode} className="py-1.5">
                        <td className="py-2 font-mono font-bold">{k.kode}</td>
                        <td className="py-2">{k.nama}</td>
                        <td className="py-2 text-center tabular-nums">{mCount}</td>
                        <td className="py-2 text-center tabular-nums">{kCount}</td>
                        <td className="py-2 text-right font-bold tabular-nums">{mCount + kCount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Penandatangan Laporan Resmi */}
        <div className="flex justify-between items-start font-sans text-xs mt-10 pt-4 border-t border-gray-300">
          <div>
            <p>Mengetahui,</p>
            <p className="font-bold mt-1">{instansiProfile.kepalaJabatan}</p>
            <div className="h-16" />
            <p className="font-bold underline">{instansiProfile.kepalaNama}</p>
            <p className="text-[10px] font-mono">NIP. {instansiProfile.kepalaNip}</p>
          </div>

          <div className="text-right">
            <p>Jakarta, {new Date().toLocaleDateString('id-ID')}</p>
            <p className="font-bold mt-1">Koordinator Tata Usaha & Kearsipan</p>
            <div className="h-16" />
            <p className="font-bold underline">{currentUser.name}</p>
            <p className="text-[10px] font-mono">NIP. {currentUser.nip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
