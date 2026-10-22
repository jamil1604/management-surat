import React, { useState, useMemo } from 'react';
import { SuratKeluar, SuratSifat, StatusSuratKeluar } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Plus,
  Printer,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  Eye,
  Edit2,
  Trash2,
  Check,
  FolderOpen,
} from 'lucide-react';
import { SuratKeluarFormModal } from './SuratKeluarFormModal';
import { SuratKeluarPreviewModal } from './SuratKeluarPreviewModal';

interface SuratKeluarViewProps {
  onOpenCreateModal?: () => void;
  selectedSuratForPreview?: SuratKeluar | null;
  onClearSelectedPreview?: () => void;
}

export const SuratKeluarView: React.FC<SuratKeluarViewProps> = ({
  selectedSuratForPreview,
  onClearSelectedPreview,
}) => {
  const {
    suratKeluarList,
    deleteSuratKeluar,
    approveSuratKeluar,
    klasifikasiList,
    currentUser,
  } = useApp();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSifat, setFilterSifat] = useState<string>('all');
  const [filterKlasifikasi, setFilterKlasifikasi] = useState<string>('all');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSurat, setEditingSurat] = useState<SuratKeluar | null>(null);
  const [previewSurat, setPreviewSurat] = useState<SuratKeluar | null>(
    selectedSuratForPreview || null
  );

  React.useEffect(() => {
    if (selectedSuratForPreview) {
      setPreviewSurat(selectedSuratForPreview);
    }
  }, [selectedSuratForPreview]);

  // Filtered
  const filteredList = useMemo(() => {
    return suratKeluarList.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        item.noAgenda.toLowerCase().includes(q) ||
        item.noSurat.toLowerCase().includes(q) ||
        item.tujuanSurat.toLowerCase().includes(q) ||
        item.perihal.toLowerCase().includes(q) ||
        item.pengonsep.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (filterStatus !== 'all' && item.statusPersetujuan !== filterStatus) {
        return false;
      }

      if (filterSifat !== 'all' && item.sifat !== filterSifat) {
        return false;
      }

      if (filterKlasifikasi !== 'all' && item.kodeKlasifikasi !== filterKlasifikasi) {
        return false;
      }

      return true;
    });
  }, [suratKeluarList, searchQuery, filterStatus, filterSifat, filterKlasifikasi]);

  const handleDelete = (id: string, noSurat: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus surat keluar no. ${noSurat}?`)) {
      deleteSuratKeluar(id);
    }
  };

  const handleApprove = (id: string) => {
    approveSuratKeluar(id);
  };

  const getStatusBadge = (status: StatusSuratKeluar) => {
    switch (status) {
      case 'terkirim':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            <CheckCircle2 className="h-3 w-3" /> Terkirim
          </span>
        );
      case 'disetujui':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
            <Check className="h-3 w-3" /> Disetujui
          </span>
        );
      case 'menunggu_persetujuan':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
            <Clock className="h-3 w-3" /> Menunggu TTD
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
            Draf
          </span>
        );
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

  const isPimpinan = currentUser.role === 'pimpinan' || currentUser.role === 'admin';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Daftar Surat Keluar & Buku Ekspedisi
          </h2>
          <p className="text-xs text-slate-500">
            Total tercatat <span className="font-semibold text-slate-800 tabular-nums">{suratKeluarList.length} naskah</span> dinas keluar
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
          <span>Buat Surat Keluar</span>
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
              placeholder="Cari nomor surat, penerima/tujuan, perihal, pengonsep..."
              className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Status Persetujuan Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">Semua Status Persetujuan</option>
              <option value="draft">Draf</option>
              <option value="menunggu_persetujuan">Menunggu TTD Pimpinan</option>
              <option value="disetujui">Disetujui</option>
              <option value="terkirim">Terkirim</option>
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

        {/* Filter Summary */}
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

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {filteredList.length === 0 ? (
          <div className="p-12 text-center">
            <Send className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <h3 className="text-sm font-semibold text-slate-900">Tidak ada surat keluar ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Coba sesuaikan kata kunci pencarian Anda atau buat naskah surat keluar baru.
            </p>
            <button
              onClick={() => {
                setEditingSurat(null);
                setIsFormOpen(true);
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Buat Surat Keluar Baru
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">No. Agenda & Sifat</th>
                  <th className="px-4 py-3">Nomor Surat Resmi</th>
                  <th className="px-4 py-3">Tujuan Surat / Penerima</th>
                  <th className="px-4 py-3">Perihal & Konsep</th>
                  <th className="px-4 py-3">Status Verifikasi</th>
                  <th className="px-4 py-3">Lokasi Arsip</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((surat) => (
                  <tr key={surat.id} className="hover:bg-slate-50/70 transition-colors">
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
                        Tgl: {surat.tanggalSurat}
                      </div>
                      {surat.tanggalKirim && (
                        <div className="text-[10px] text-emerald-800 font-mono">
                          Kirim: {surat.tanggalKirim}
                        </div>
                      )}
                    </td>

                    {/* Tujuan Surat */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800 line-clamp-2 max-w-[200px]">
                        {surat.tujuanSurat}
                      </div>
                      {surat.alamatTujuan && (
                        <div className="mt-0.5 text-[11px] text-slate-600 truncate max-w-[200px]">
                          {surat.alamatTujuan}
                        </div>
                      )}
                    </td>

                    {/* Perihal & Pengonsep */}
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-900 line-clamp-2 max-w-[260px]">
                        {surat.perihal}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-600">
                        Konsep: <strong>{surat.pengonsep.split(',')[0]}</strong>
                      </div>
                    </td>

                    {/* Status Verifikasi */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {getStatusBadge(surat.statusPersetujuan)}
                      <div className="mt-1 text-[10px] text-slate-600 truncate max-w-[150px]">
                        TTD: {surat.penandatangan.split(',')[0]}
                      </div>
                    </td>

                    {/* Lokasi Arsip */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                      <div className="flex items-center gap-1">
                        <FolderOpen className="h-3 w-3 text-slate-600" />
                        <span>{surat.lokasiArsip}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {isPimpinan && surat.statusPersetujuan === 'menunggu_persetujuan' && (
                          <button
                            onClick={() => handleApprove(surat.id)}
                            className="rounded-md bg-emerald-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-800 transition"
                            title="Setujui dan tanda tangani surat ini"
                          >
                            Setujui
                          </button>
                        )}
                        <button
                          onClick={() => setPreviewSurat(surat)}
                          className="rounded-md bg-slate-50 border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition flex items-center gap-1"
                          title="Pratinjau naskah dinas resmi"
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-500" />
                          <span>Pratinjau</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingSurat(surat);
                            setIsFormOpen(true);
                          }}
                          className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                          title="Ubah data naskah"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(surat.id, surat.noSurat)}
                          className="rounded-md border border-slate-200 p-1.5 text-rose-600 hover:bg-rose-50 transition"
                          title="Hapus surat keluar"
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

      {/* Form Modal */}
      {isFormOpen && (
        <SuratKeluarFormModal
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

      {/* Preview Modal */}
      {previewSurat && (
        <SuratKeluarPreviewModal
          surat={previewSurat}
          onClose={() => {
            setPreviewSurat(null);
            if (onClearSelectedPreview) onClearSelectedPreview();
          }}
          onApprove={() => {
            handleApprove(previewSurat.id);
            setPreviewSurat({
              ...previewSurat,
              statusPersetujuan: 'disetujui',
              tanggalKirim: new Date().toISOString().split('T')[0],
            });
          }}
        />
      )}
    </div>
  );
};
