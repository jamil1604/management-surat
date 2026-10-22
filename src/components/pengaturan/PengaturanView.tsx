import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  FileCode2,
  Database,
  Save,
  RotateCcw,
  Plus,
  CheckCircle2,
  Download,
  UploadCloud,
} from 'lucide-react';
import { InstansiProfile, KlasifikasiSurat } from '../../types';

export const PengaturanView: React.FC = () => {
  const {
    instansiProfile,
    updateInstansiProfile,
    klasifikasiList,
    addKlasifikasi,
    resetToDefaultData,
    suratMasukList,
    suratKeluarList,
    users,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profil' | 'klasifikasi' | 'data'>('profil');
  const [profileForm, setProfileForm] = useState<InstansiProfile>({ ...instansiProfile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New Classification state
  const [newKode, setNewKode] = useState('');
  const [newNama, setNewNama] = useState('');
  const [newDeskripsi, setNewDeskripsi] = useState('');

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateInstansiProfile(profileForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddKlasifikasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKode.trim() || !newNama.trim()) return;

    addKlasifikasi({
      kode: newKode.trim(),
      nama: newNama.trim(),
      deskripsi: newDeskripsi.trim() || undefined,
    });

    setNewKode('');
    setNewNama('');
    setNewDeskripsi('');
  };

  const handleExportJSON = () => {
    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      instansi: instansiProfile,
      users,
      suratMasuk: suratMasukList,
      suratKeluar: suratKeluarList,
      klasifikasi: klasifikasiList,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SIMASUK_Backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (
      confirm(
        'Apakah Anda yakin ingin mengatur ulang data ke data awal simulasi? Semua perubahan yang belum dicadangkan akan kembali ke setelan pabrik.'
      )
    ) {
      resetToDefaultData();
      alert('Data sistem berhasil diatur ulang ke data simulasi awal.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          Pengaturan Satuan Kerja & Master Data
        </h2>
        <p className="text-xs text-slate-500">
          Kelola profil instansi untuk kop surat resmi, kode klasifikasi naskah, dan pencadangan basis data
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('profil')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'profil'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Profil & Kop Instansi</span>
        </button>
        <button
          onClick={() => setActiveTab('klasifikasi')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'klasifikasi'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCode2 className="h-4 w-4" />
          <span>Master Kode Klasifikasi ({klasifikasiList.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'data'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="h-4 w-4" />
          <span>Pencadangan & Pemulihan</span>
        </button>
      </div>

      {/* Tab 1: Profil & Kop Instansi */}
      {activeTab === 'profil' && (
        <form onSubmit={handleProfileSubmit} className="space-y-6 text-xs">
          {savedSuccess && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>Profil instansi dan kop surat resmi berhasil diperbarui.</span>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Identitas Satuan Kerja / Lembaga
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pemerintah / Induk Organisasi:
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.namaInstansi}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, namaInstansi: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Dinas / Sub-Instansi:
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.subInstansi}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, subInstansi: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs font-medium text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Satuan Kerja / Sekolah / Unit:
              </label>
              <input
                type="text"
                required
                value={profileForm.unitKerja}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, unitKerja: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 p-2 text-xs font-medium text-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Kantor:
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.alamat}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, alamat: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kota & Kode Pos:
                </label>
                <input
                  type="text"
                  required
                  value={`${profileForm.kota} ${profileForm.kodePos}`}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, kota: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Telepon:
                </label>
                <input
                  type="text"
                  value={profileForm.telepon}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, telepon: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Resmi Kedinasan:
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Laman Situs Resmi:
                </label>
                <input
                  type="text"
                  value={profileForm.website}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, website: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Pejabat Penandatangan Default */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Pimpinan / Penandatangan Naskah Dinas
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar Kepala:
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.kepalaNama}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, kepalaNama: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  NIP Kepala:
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.kepalaNip}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, kepalaNip: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sebutan Jabatan:
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.kepalaJabatan}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, kepalaJabatan: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              <Save className="h-4 w-4" />
              <span>Simpan Profil & Pengaturan Kop</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Master Klasifikasi */}
      {activeTab === 'klasifikasi' && (
        <div className="space-y-6 text-xs">
          {/* Add form */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="h-4 w-4 text-slate-600" />
              <span>Tambah Kode Klasifikasi Arsip Baru</span>
            </h3>

            <form onSubmit={handleAddKlasifikasi} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kode:</label>
                <input
                  type="text"
                  required
                  value={newKode}
                  onChange={(e) => setNewKode(e.target.value)}
                  placeholder="Misal: 070"
                  className="w-full rounded-lg border border-slate-300 p-2 font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Urusan / Nama Klasifikasi:</label>
                <input
                  type="text"
                  required
                  value={newNama}
                  onChange={(e) => setNewNama(e.target.value)}
                  placeholder="Misal: Penelitian & Pengembangan"
                  className="w-full rounded-lg border border-slate-300 p-2"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-slate-900 py-2 px-4 font-semibold text-white hover:bg-slate-800"
                >
                  Tambah Kode
                </button>
              </div>
            </form>
          </div>

          {/* List Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 w-28">Kode Klasifikasi</th>
                  <th className="px-4 py-3">Nama Urusan</th>
                  <th className="px-4 py-3">Deskripsi & Ruang Lingkup</th>
                  <th className="px-4 py-3 text-right">Surat Terkait</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {klasifikasiList.map((k) => {
                  const usage =
                    suratMasukList.filter((s) => s.kodeKlasifikasi === k.kode).length +
                    suratKeluarList.filter((s) => s.kodeKlasifikasi === k.kode).length;
                  return (
                    <tr key={k.kode} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {k.kode}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {k.nama}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {k.deskripsi || '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-700">
                        {usage} naskah
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Data & Reset */}
      {activeTab === 'data' && (
        <div className="space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Backup Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Download className="h-4 w-4 text-emerald-700" />
                <span>Pencadangan Basis Data (JSON)</span>
              </h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Unduh seluruh data surat masuk, surat keluar, riwayat disposisi, daftar pengguna, dan profil instansi dalam satu file JSON terstruktur.
              </p>
              <button
                onClick={handleExportJSON}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
              >
                <Download className="h-4 w-4" />
                <span>Unduh Cadangan Lengkap (.json)</span>
              </button>
            </div>

            {/* Reset Card */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-rose-950 flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-rose-700" />
                <span>Setel Ulang Data Simulasi</span>
              </h3>
              <p className="text-rose-900 text-[11px] leading-relaxed">
                Kembalikan data ke setelan awal pabrik lengkap dengan surat masuk, draf surat keluar, pengguna, dan disposisi contoh dinas.
              </p>
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-rose-700 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-800 transition"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Atur Ulang ke Contoh Awal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
