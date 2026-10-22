import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Inbox,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowUpRight,
  Plus,
  Printer,
  ChevronRight,
  Calendar,
  Layers,
} from 'lucide-react';
import { SuratMasuk, SuratKeluar } from '../../types';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onOpenSuratMasukModal: () => void;
  onOpenSuratKeluarModal: () => void;
  onSelectSuratMasuk: (surat: SuratMasuk) => void;
  onSelectSuratKeluar: (surat: SuratKeluar) => void;
  onOpenDisposisiModal: (surat: SuratMasuk) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenSuratMasukModal,
  onOpenSuratKeluarModal,
  onSelectSuratMasuk,
  onSelectSuratKeluar,
  onOpenDisposisiModal,
}) => {
  const { suratMasukList, suratKeluarList, currentUser, klasifikasiList } = useApp();

  // Metrics calculation
  const totalMasuk = suratMasukList.length;
  const totalKeluar = suratKeluarList.length;

  const belumDisposisi = suratMasukList.filter((s) => s.statusDisposisi === 'belum');
  const prosesDisposisi = suratMasukList.filter((s) => s.statusDisposisi === 'proses');
  const selesaiDisposisi = suratMasukList.filter((s) => s.statusDisposisi === 'selesai');

  const pendingApprovalKeluar = suratKeluarList.filter((s) => s.statusPersetujuan === 'menunggu_persetujuan');
  const terkirimKeluar = suratKeluarList.filter((s) => s.statusPersetujuan === 'terkirim' || s.statusPersetujuan === 'disetujui');

  // Classification stats for incoming letters
  const klasifikasiCounts = klasifikasiList.map((k) => {
    const countMasuk = suratMasukList.filter((s) => s.kodeKlasifikasi === k.kode).length;
    const countKeluar = suratKeluarList.filter((s) => s.kodeKlasifikasi === k.kode).length;
    return {
      ...k,
      total: countMasuk + countKeluar,
      countMasuk,
      countKeluar,
    };
  }).filter((k) => k.total > 0).sort((a, b) => b.total - a.total);

  // Recent letters (last 4 of each)
  const recentMasuk = suratMasukList.slice(0, 4);
  const recentKeluar = suratKeluarList.slice(0, 4);

  // Monthly trends simulation (Jan, Feb, Mar, Apr, Mei, Jun)
  const monthlyStats = [
    { month: 'Okt 25', masuk: 18, keluar: 12 },
    { month: 'Nov 25', masuk: 24, keluar: 19 },
    { month: 'Des 25', masuk: 29, keluar: 22 },
    { month: 'Jan 26', masuk: 31, keluar: 26 },
    { month: 'Feb 26', masuk: 27, keluar: 24 },
    { month: 'Mar 26', masuk: Math.max(34, totalMasuk), keluar: Math.max(28, totalKeluar) },
  ];

  const maxVal = Math.max(...monthlyStats.map((m) => Math.max(m.masuk, m.keluar)));

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Selamat datang kembali</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-slate-700">{currentUser.name}</span>
          </div>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
            Pusat Kendali Administrasi Persuratan
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Terdapat <span className="font-semibold text-amber-700 tabular-nums">{belumDisposisi.length} surat masuk</span> menunggu instruksi pimpinan dan <span className="font-semibold text-blue-700 tabular-nums">{pendingApprovalKeluar.length} draf</span> menunggu persetujuan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenSuratMasukModal}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Catat Masuk</span>
          </button>
          <button
            onClick={onOpenSuratKeluarModal}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Send className="h-3.5 w-3.5 text-slate-500" />
            <span>Buat Keluar</span>
          </button>
          <button
            onClick={() => onNavigate('laporan')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span>Buku Agenda</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Metric 1: Surat Masuk */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Surat Masuk</span>
            <span className="rounded-md bg-emerald-50 p-2 text-emerald-700">
              <Inbox className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {totalMasuk}
            </span>
            <span className="text-xs text-slate-500">naskah terarsip</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>Bulan Ini: 5 surat</span>
            <button
              onClick={() => onNavigate('surat_masuk')}
              className="font-medium text-slate-700 hover:text-slate-900 flex items-center gap-0.5"
            >
              Lihat <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Metric 2: Surat Keluar */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Surat Keluar</span>
            <span className="rounded-md bg-blue-50 p-2 text-blue-700">
              <Send className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {totalKeluar}
            </span>
            <span className="text-xs text-slate-500">naskah dibuat</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>Terkirim: {terkirimKeluar.length} surat</span>
            <button
              onClick={() => onNavigate('surat_keluar')}
              className="font-medium text-slate-700 hover:text-slate-900 flex items-center gap-0.5"
            >
              Lihat <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Metric 3: Menunggu Disposisi */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Perlu Disposisi</span>
            <span className="rounded-md bg-amber-50 p-2 text-amber-700">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {belumDisposisi.length}
            </span>
            <span className="text-xs text-amber-700 font-medium">butuh instruksi</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>Dalam proses: {prosesDisposisi.length}</span>
            <span className="font-semibold text-slate-700">Segera tindak</span>
          </div>
        </div>

        {/* Metric 4: Disposisi Selesai */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Disposisi Tuntas</span>
            <span className="rounded-md bg-emerald-50 p-2 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {selesaiDisposisi.length}
            </span>
            <span className="text-xs text-slate-500">selesai ditindak</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>Efektivitas tindak lanjut: 100%</span>
            <span className="text-emerald-700 font-medium">Tuntas</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Monthly Volume Chart & Disposisi Status / Klasifikasi */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Monthly Volume Chart */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Aktivitas Volume Persuratan Bulanan
              </h3>
              <p className="text-xs text-slate-500">
                Perbandingan kuantitas Surat Masuk dan Surat Keluar 6 bulan terakhir
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-emerald-600" />
                <span className="text-slate-600">Surat Masuk</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-blue-600" />
                <span className="text-slate-600">Surat Keluar</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex h-52 items-end justify-between gap-3 pt-6 px-2">
            {monthlyStats.map((item, idx) => {
              const masukHeight = Math.round((item.masuk / maxVal) * 160);
              const keluarHeight = Math.round((item.keluar / maxVal) * 160);
              return (
                <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex items-end justify-center gap-1.5 w-full h-[160px]">
                    {/* Surat Masuk Bar */}
                    <div
                      style={{ height: `${masukHeight}px` }}
                      className="w-1/2 max-w-[28px] rounded-t-sm bg-emerald-600 transition-all hover:bg-emerald-700 relative group"
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-white opacity-0 group-hover:opacity-100 transition pointer-events-none tabular-nums whitespace-nowrap z-10">
                        {item.masuk} masuk
                      </div>
                    </div>
                    {/* Surat Keluar Bar */}
                    <div
                      style={{ height: `${keluarHeight}px` }}
                      className="w-1/2 max-w-[28px] rounded-t-sm bg-blue-600 transition-all hover:bg-blue-700 relative group"
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-white opacity-0 group-hover:opacity-100 transition pointer-events-none tabular-nums whitespace-nowrap z-10">
                        {item.keluar} keluar
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>Rata-rata volume persuratan: 55 naskah / bulan</span>
            <span className="font-medium text-slate-700">Tercatat di Buku Agenda Elektronik</span>
          </div>
        </div>

        {/* Right: Klasifikasi Surat Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Klasifikasi Naskah Dinas
              </h3>
              <p className="text-xs text-slate-500">Distribusi per kode urusan</p>
            </div>
            <button
              onClick={() => onNavigate('pengaturan')}
              className="text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Master Kode
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {klasifikasiCounts.slice(0, 5).map((item) => {
              const totalItems = totalMasuk + totalKeluar;
              const percentage = totalItems > 0 ? Math.round((item.total / totalItems) * 100) : 0;
              return (
                <div key={item.kode} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 truncate max-w-[170px]">
                      <span className="font-mono text-slate-500 mr-1.5">{item.kode}</span>
                      {item.nama}
                    </span>
                    <span className="font-semibold text-slate-700 tabular-nums">
                      {item.total} naskah
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-800"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-600">
                    <span>{item.countMasuk} masuk · {item.countKeluar} keluar</span>
                    <span className="tabular-nums">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-lg border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
            <div className="font-semibold text-slate-800">Petunjuk Disposisi Cepat</div>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">
              Pimpinan dapat langsung memberikan lembar disposisi digital berjenjang dan mencetak slip resmi.
            </p>
          </div>
        </div>
      </div>

      {/* Needs Attention / Urgent Disposition Queue */}
      {belumDisposisi.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-700" />
              <h3 className="text-sm font-semibold text-amber-900">
                Surat Masuk Memerlukan Instruksi Disposisi ({belumDisposisi.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigate('surat_masuk')}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
            >
              Buka Semua di Surat Masuk <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {belumDisposisi.map((surat) => (
              <div
                key={surat.id}
                className="rounded-lg border border-amber-200 bg-white p-4 shadow-2xs hover:border-amber-300 transition"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-mono font-medium text-slate-600">
                    {surat.noAgenda}
                  </span>
                  <span className="font-medium text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded text-[11px] uppercase tracking-wide">
                    {surat.sifat}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                  {surat.perihal}
                </h4>
                <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-2">
                  <span>Dari: <strong className="text-slate-700">{surat.asalSurat}</strong></span>
                  <span>·</span>
                  <span className="font-mono">{surat.tanggalTerima}</span>
                </div>
                <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onOpenDisposisiModal(surat)}
                    className="flex-1 rounded-md bg-amber-700 px-2.5 py-1.5 text-center text-xs font-semibold text-white hover:bg-amber-800 transition"
                  >
                    Beri Instruksi Disposisi
                  </button>
                  <button
                    onClick={() => onSelectSuratMasuk(surat)}
                    className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                  >
                    Detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Split: Recent Incoming & Recent Outgoing */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Surat Masuk Terkini */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Surat Masuk Terbaru
              </h3>
              <p className="text-xs text-slate-500">Naskah yang baru dicatat dalam agenda</p>
            </div>
            <button
              onClick={() => onNavigate('surat_masuk')}
              className="text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1"
            >
              Lihat Semua <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {recentMasuk.map((surat) => (
              <div
                key={surat.id}
                onClick={() => onSelectSuratMasuk(surat)}
                className="group py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-50/50 rounded-lg p-2 transition"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-mono font-medium text-slate-700">{surat.noAgenda}</span>
                    <span>·</span>
                    <span>{surat.tanggalTerima}</span>
                    <span>·</span>
                    <span className="truncate max-w-[150px]">{surat.asalSurat}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 group-hover:text-slate-700 line-clamp-1">
                    {surat.perihal}
                  </h4>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>No. {surat.noSurat}</span>
                    <span>·</span>
                    <span>Arsip: {surat.lokasiArsip}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${
                      surat.statusDisposisi === 'selesai'
                        ? 'bg-emerald-50 text-emerald-700'
                        : surat.statusDisposisi === 'proses'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {surat.statusDisposisi === 'selesai'
                      ? 'Disposisi Selesai'
                      : surat.statusDisposisi === 'proses'
                      ? 'Dalam Proses'
                      : 'Belum Disposisi'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Surat Keluar Terkini */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Surat Keluar Terbaru
              </h3>
              <p className="text-xs text-slate-500">Draf dan naskah dinas keluar</p>
            </div>
            <button
              onClick={() => onNavigate('surat_keluar')}
              className="text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1"
            >
              Lihat Semua <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {recentKeluar.map((surat) => (
              <div
                key={surat.id}
                onClick={() => onSelectSuratKeluar(surat)}
                className="group py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-50/50 rounded-lg p-2 transition"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-mono font-medium text-slate-700">{surat.noAgenda}</span>
                    <span>·</span>
                    <span>{surat.tanggalSurat}</span>
                    <span>·</span>
                    <span className="truncate max-w-[150px]">Kpd: {surat.tujuanSurat}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 group-hover:text-slate-700 line-clamp-1">
                    {surat.perihal}
                  </h4>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>No. {surat.noSurat}</span>
                    <span>·</span>
                    <span>Konsep: {surat.pengonsep.split(',')[0]}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${
                      surat.statusPersetujuan === 'terkirim'
                        ? 'bg-emerald-50 text-emerald-700'
                        : surat.statusPersetujuan === 'disetujui'
                        ? 'bg-blue-50 text-blue-700'
                        : surat.statusPersetujuan === 'menunggu_persetujuan'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {surat.statusPersetujuan === 'terkirim'
                      ? 'Terkirim'
                      : surat.statusPersetujuan === 'disetujui'
                      ? 'Disetujui'
                      : surat.statusPersetujuan === 'menunggu_persetujuan'
                      ? 'Menunggu TTD'
                      : 'Draf'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
