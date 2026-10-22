import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  UserCheck,
  KeyRound,
  Info,
} from 'lucide-react';
import { PenggunaFormModal } from './PenggunaFormModal';

export const PenggunaView: React.FC = () => {
  const { users, currentUser, switchUser, updateUser, deleteUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      u.name.toLowerCase().includes(q) ||
      u.nip.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.jabatan.toLowerCase().includes(q);

    if (!matchSearch) return false;
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;

    return true;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700">
            <ShieldCheck className="h-3 w-3" /> Administrator
          </span>
        );
      case 'pimpinan':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-700">
            <Shield className="h-3 w-3" /> Pimpinan / Kepala
          </span>
        );
      case 'petugas_tu':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
            Petugas TU
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
            Staff / Pelaksana
          </span>
        );
    }
  };

  const handleToggleStatus = (u: User) => {
    const nextStatus = u.status === 'aktif' ? 'nonaktif' : 'aktif';
    updateUser(u.id, { status: nextStatus });
  };

  const handleDelete = (u: User) => {
    if (u.id === currentUser.id) {
      alert('Anda tidak dapat menghapus akun yang saat ini sedang aktif digunakan.');
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus akun ${u.name}?`)) {
      deleteUser(u.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Manajemen Pengguna & Hak Akses
          </h2>
          <p className="text-xs text-slate-500">
            Kelola data pegawai, hak akses otorisasi, dan alur disposisi persuratan
          </p>
        </div>

        <button
          onClick={() => {
            setEditingUser(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      {/* Role Switcher Callout for Evaluation / Testing */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-3">
          <KeyRound className="h-5 w-5 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-blue-950">
              Pengguna Aktif Saat Ini: <span className="underline">{currentUser.name}</span> ({currentUser.jabatan})
            </div>
            <p className="text-blue-800 text-[11px] mt-0.5">
              Anda dapat beralih ke akun Pimpinan untuk mengetes persetujuan surat keluar & disposisi, atau Petugas TU untuk mencatat buku agenda.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, NIP, email, jabatan..."
              className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">Semua Peran</option>
              <option value="admin">Administrator</option>
              <option value="pimpinan">Pimpinan / Kepala</option>
              <option value="petugas_tu">Petugas TU</option>
              <option value="staff">Staff / Pegawai</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Nama Pegawai & Avatar</th>
                <th className="px-4 py-3">NIP / Identitas</th>
                <th className="px-4 py-3">Jabatan & Kontak</th>
                <th className="px-4 py-3">Peran (Hak Akses)</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const isCurrentActive = u.id === currentUser.id;
                return (
                  <tr
                    key={u.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isCurrentActive ? 'bg-slate-50/80 font-medium' : ''
                    }`}
                  >
                    {/* User info */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {u.avatarUrl ? (
                          <img
                            src={u.avatarUrl}
                            alt={u.name}
                            className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 text-xs font-bold shrink-0">
                            {u.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isCurrentActive && (
                              <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 font-bold">
                                Anda
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* NIP */}
                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-700">
                      {u.nip}
                    </td>

                    {/* Jabatan & Phone */}
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-900 line-clamp-1 max-w-[220px]">
                        {u.jabatan}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {u.phone || '-'}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {getRoleBadge(u.role)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {u.status === 'aktif' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="h-3 w-3" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          <XCircle className="h-3 w-3" /> Nonaktif
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isCurrentActive ? (
                          <button
                            onClick={() => switchUser(u.id)}
                            className="rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-1 text-xs font-medium transition"
                            title="Beralih ke peran pengguna ini"
                          >
                            Masuk Sebagai
                          </button>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-400 px-2">
                            Sedang Aktif
                          </span>
                        )}

                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setIsFormOpen(true);
                          }}
                          className="rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                          title="Ubah data"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(u)}
                          disabled={isCurrentActive}
                          className="rounded-md border border-slate-200 p-1.5 text-rose-600 hover:bg-rose-50 transition disabled:opacity-40"
                          title="Hapus user"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Matrix Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Info className="h-4 w-4 text-slate-500" />
          <span>Matriks Hak Akses & Kewenangan Pengguna (RBAC)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
            <div className="font-bold text-slate-900">Administrator TU</div>
            <p className="text-[11px] text-slate-600">
              Akses menyeluruh ke seluruh modul: kelola master pengguna, konfigurasi instansi, surat masuk & keluar, dan backup data.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
            <div className="font-bold text-slate-900">Pimpinan / Kepala</div>
            <p className="text-[11px] text-slate-600">
              Menelaah surat masuk, memberikan lembar disposisi digital, serta menandatangani dan menyetujui surat dinas keluar.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
            <div className="font-bold text-slate-900">Petugas Tata Usaha</div>
            <p className="text-[11px] text-slate-600">
              Mencatat surat masuk & keluar, mencetak nomor agenda fisik, mengelola buku ekspedisi dan arsip pertinggal.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
            <div className="font-bold text-slate-900">Staff / Pelaksana</div>
            <p className="text-[11px] text-slate-600">
              Menerima lembar disposisi dari pimpinan, menindaklanjuti tugas kedinasan, dan mengunggah laporan hasil tindak lanjut.
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isFormOpen && (
        <PenggunaFormModal
          initialData={editingUser}
          onClose={() => {
            setIsFormOpen(false);
            setEditingUser(null);
          }}
          onSaved={() => {
            setIsFormOpen(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};
