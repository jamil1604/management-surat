import React, { useState, useMemo } from 'react';
import { SuratMasuk, SuratSifat } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  Plus,
  Printer,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Send,
  Download,
  FolderOpen,
} from 'lucide-react';
import { SuratMasukFormModal } from './SuratMasukFormModal';
import { DisposisiModal } from './DisposisiModal';
import { LembarDisposisiPrintModal } from './LembarDisposisiPrintModal';

interface SuratMasukViewProps {
  onOpenCreateModal?: () => void;
  selectedSuratForDisposisi?: SuratMasuk | null;
  onClearSelectedDisposisi?: () => void;
}

export const SuratMasukView: React.FC<SuratMasukViewProps> = ({
  selectedSuratForDisposisi,
  onClearSelectedDisposisi,
}) => {
  const { suratMasukList, deleteSuratMasuk, klasifikasiList, currentUser } = useApp();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSifat, setFilterSifat] = useState<string>('all');
  const [filterKlasifikasi, setFilterKlasifikasi] = useState<string>('all');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSurat, setEditingSurat] = useState<SuratMasuk | null>(null);

  const [activeDisposisiSurat, setActiveDisposisiSurat] = useState<SuratMasuk | null>(
    selectedSuratForDisposisi || null
  );
  const [activePrintSurat, setActivePrintSurat] = useState<SuratMasuk | null>(null);
  const [detailSurat, setDetailSurat] = useState<SuratMasuk | null>(null);

  // Sync prop changes
  React.useEffect(() => {
    if (selectedSuratForDisposisi) {
      setActiveDisposisiSurat(selectedSuratForDisposisi);
    }
  }, [selectedSuratForDisposisi]);

  // Filtered List
  const filteredList = useMemo(() => {
    return suratMasukList.filter((item) => {
      // Search
      const query = searchQuery.toLowerCase();
      const matchSearch =
        item.noAgenda.toLowerCase().includes(query) ||
        item.noSurat.toLowerCase().includes(query) ||
        item.asalSurat.toLowerCase().includes(query) ||
        item.perihal.toLowerCase().includes(query) ||
        item.lokasiArsip.toLowerCase().includes(query);

      if (!matchSearch) return false;

      // Status Filter
      if (filterStatus !== 'all' && item.statusDisposisi !== filterStatus) {
        return false;
      }

      // Sifat Filter
      if (filterSifat !== 'all' && item.sifat !== filterSifat) {
        return false;
      }

      // Klasifikasi Filter
      if (filterKlasifikasi !== 'all' && item.kodeKlasifikasi !== filterKlasifikasi) {
        return false;
      }

      return true;
    });
  }, [suratMasukList, searchQuery, filterStatus, filterSifat, filterKlasifikasi]);

  const handleDelete = (id: string, noSurat: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus surat masuk no. ${noSurat}?`)) {
      deleteSuratMasuk(id);
    }
  };

  const getSifatColor = (sifat: SuratSifat) => {
    switch (sifat) {
      case 'segera':
      case 'sangat_rahasia':
        return 'text-rose-700 bg-rose-50';
      case 'penting':
        return 'text-amber-700 bg-amber-50';
      case 'rahasia':
        return 'text-purple-700 bg-purple-50';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  const getStatusDisposisiBadge = (status: 'belum' | 'proses' | 'selesai') => {
    switch (status) {
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            <CheckCircle2 className="h-3 w-3" /> Selesai
          </span>
        );
      case 'proses':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
            <Clock className="h-3 w-3" /> Berproses
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
            <AlertCircle className="h-3 w-3" /> Belum Disposisi
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Daftar Surat Masuk & Buku Agenda
          </h2>
          <p className="text-xs text-slate-500">
            Total tercatat <span className="font-semibold text-slate-800 tabular-nums">{suratMasukList.length} naskah</span> dinas masuk
          </p>
        </div>

        <button
          onClick={() => {
            setEditingSurat(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Catat Surat Masuk</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor surat, nomor agenda, asal instansi, perihal..."
              className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">Semua Status Disposisi</option>
              <option value="belum">Belum Didisposisi</option>
              <option value="proses">Sedang Diproses</option>
              <option value="selesai">Disposisi Selesai</option>
            </select>

            {/* Sifat Surat Filter */}
            <select
              value={filterSifat}
              onChange={(e) => setFilterSifat(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">Semua Sifat Surat</option>
              <option value="biasa">Biasa</option>
              <option value="penting">Penting</option>
              <option value="rahasia">Rahasia</option>
              <option value="segera">Segera</option>
            </select>

            {/* Klasifikasi Filter */}
            <select
              value={filterKlasifikasi}
              onChange={(e) => setFilterKlasifikasi(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900 max-w-[200px]"
            >
              <option value="all">Semua Klasifikasi</option>
              {klasifikasiList.map((k) => (
                <option key={k.kode} value={k.kode}>
                  {k.kode} - {k.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary Tags */}
        {(searchQuery || filterStatus !== 'all' || filterSifat !== 'all' || filterKlasifikasi !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Menampilkan <strong className="text-slate-800 tabular-nums">{filteredList.length}</strong> hasil pencarian
            </span>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('all');
                setFilterSifat('all');
                setFilterKlasifikasi('all');
              }}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {filteredList.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <h3 className="text-sm font-semibold text-slate-900">Tidak ada surat masuk ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Coba sesuaikan kata kunci pencarian Anda atau tambahkan pencatatan surat masuk baru ke dalam sistem.
            </p>
            <button
              onClick={() => {
                setEditingSurat(null);
                setIsFormOpen(true);
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Catat Surat Baru
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">No. Agenda & Sifat</th>
                  <th className="px-4 py-3">Nomor & Tanggal Surat</th>
                  <th className="px-4 py-3">Pengirim (Asal)</th>
                  <th className="px-4 py-3">Perihal / Isi Ringkas</th>
                  <th className="px-4 py-3">Status Disposisi</th>
                  <th className="px-4 py-3">Lokasi Berkas</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {filteredList.map((surat) => (
                  <tr
                    key={surat.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* No Agenda & Sifat */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-mono font-bold text-slate-900">
                        {surat.noAgenda}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getSifatColor(
                            surat.sifat
                          )}`}
                        >
                          {surat.sifat}
                        </span>
                        <span className="text-[10px] text-slate-600 font-mono">
                          [{surat.kodeKlasifikasi}]
                        </span>
                      </div>
                    </td>

                    {/* No Surat & Tanggal */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-medium text-slate-900">
                        {surat.noSurat}
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-600 font-mono">
                        Surat: {surat.tanggalSurat}
                      </div>
                      <div className="text-[10px] text-slate-600 font-mono">
                        Terima: {surat.tanggalTerima}
                      </div>
                    </td>

                    {/* Pengirim */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800 line-clamp-2 max-w-[200px]">
                        {surat.asalSurat}
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-600 truncate max-w-[200px]">
                        Kpd: {surat.ditujukanKepada}
                      </div>
                    </td>

                    {/* Perihal */}
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-900 line-clamp-2 max-w-[280px]">
                        {surat.perihal}
                      </div>
                      {surat.fileName && (
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-600">
                          <FileText className="h-3 w-3 text-slate-600" />
                          <span className="truncate max-w-[220px]">{surat.fileName}</span>
                        </div>
                      )}
                    </td>

                    {/* Status Disposisi */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {getStatusDisposisiBadge(surat.statusDisposisi)}
                      <div className="mt-1 text-[10px] text-slate-600 tabular-nums">
                        {surat.disposisiList.length} instruksi pimpinan
                      </div>
                    </td>

                    {/* Lokasi Berkas */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                      <div className="flex items-center gap-1">
                        <FolderOpen className="h-3 w-3 text-slate-600" />
                        <span>{surat.lokasiArsip}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setActiveDisposisiSurat(surat)}
                          className="rounded-md bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100 transition"
                          title="Beri instruksi disposisi"
                        >
                          Disposisi
                        </button>
                        <button
                          onClick={() => setActivePrintSurat(surat)}
                          className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                          title="Cetak Lembar Disposisi"
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDetailSurat(surat)}
                          className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                          title="Detail surat"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingSurat(surat);
                            setIsFormOpen(true);
                          }}
                          className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                          title="Ubah data"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(surat.id, surat.noSurat)}
                          className="rounded-md border border-slate-200 p-1.5 text-rose-600 hover:bg-rose-50 transition"
                          title="Hapus surat"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal (Add / Edit) */}
      {isFormOpen && (
        <SuratMasukFormModal
          initialData={editingSurat}
          onClose={() => {
            setIsFormOpen(false);
            setEditingSurat(null);
          }}
          onSaved={() => {
            setIsFormOpen(false);
            setEditingSurat(null);
          }}
        />
      )}

      {/* Disposition Modal */}
      {activeDisposisiSurat && (
        <DisposisiModal
          surat={activeDisposisiSurat}
          onClose={() => {
            setActiveDisposisiSurat(null);
            if (onClearSelectedDisposisi) onClearSelectedDisposisi();
          }}
          onPrintLembarDisposisi={() => {
            setActivePrintSurat(activeDisposisiSurat);
          }}
        />
      )}

      {/* Print Slip Modal */}
      {activePrintSurat && (
        <LembarDisposisiPrintModal
          surat={activePrintSurat}
          onClose={() => setActivePrintSurat(null)}
        />
      )}

      {/* Detail Modal */}
      {detailSurat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono font-bold text-slate-500">{detailSurat.noAgenda}</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{detailSurat.perihal}</h3>
              </div>
              <button
                onClick={() => setDetailSurat(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg">
              <div>
                <span className="text-slate-500 block">Nomor Surat:</span>
                <strong className="text-slate-800">{detailSurat.noSurat}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Pengirim:</span>
                <strong className="text-slate-800">{detailSurat.asalSurat}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Tanggal Surat & Terima:</span>
                <span className="font-mono text-slate-800">
                  {detailSurat.tanggalSurat} / {detailSurat.tanggalTerima}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Lokasi Arsip Fisik:</span>
                <span className="font-mono text-slate-800">{detailSurat.lokasiArsip}</span>
              </div>
            </div>

            {detailSurat.ringkasan && (
              <div>
                <span className="font-semibold text-slate-700 block mb-1">Uraian Ringkas Surat:</span>
                <p className="bg-slate-50 p-3 rounded-md text-slate-800 leading-relaxed border border-slate-100">
                  {detailSurat.ringkasan}
                </p>
              </div>
            )}

            <div>
              <span className="font-semibold text-slate-700 block mb-2">Riwayat Disposisi ({detailSurat.disposisiList.length}):</span>
              {detailSurat.disposisiList.length === 0 ? (
                <p className="text-slate-400 italic">Belum ada disposisi pimpinan.</p>
              ) : (
                <div className="space-y-2">
                  {detailSurat.disposisiList.map((d) => (
                    <div key={d.id} className="p-3 border rounded-lg bg-white space-y-1">
                      <div className="flex justify-between font-semibold">
                        <span>{d.dariNama} → {d.kepadaNama}</span>
                        <span className="text-[10px] uppercase font-mono">{d.status}</span>
                      </div>
                      <p className="text-slate-700">{d.catatan}</p>
                      {d.tanggapan && (
                        <p className="text-emerald-700 bg-emerald-50 p-1.5 rounded mt-1">
                          Tanggapan: {d.tanggapan}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                onClick={() => {
                  const s = detailSurat;
                  setDetailSurat(null);
                  setActiveDisposisiSurat(s);
                }}
                className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800"
              >
                Beri Instruksi Disposisi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
