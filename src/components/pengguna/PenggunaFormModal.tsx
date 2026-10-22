import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck } from 'lucide-react';

interface PenggunaFormModalProps {
  initialData?: User | null;
  onClose: () => void;
  onSaved: () => void;
}

export const PenggunaFormModal: React.FC<PenggunaFormModalProps> = ({
  initialData,
  onClose,
  onSaved,
}) => {
  const { addUser, updateUser } = useApp();
  const isEdit = Boolean(initialData);

  const [name, setName] = useState(initialData?.name || '');
  const [nip, setNip] = useState(initialData?.nip || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [jabatan, setJabatan] = useState(initialData?.jabatan || '');
  const [role, setRole] = useState<UserRole>(initialData?.role || 'staff');
  const [status, setStatus] = useState<'aktif' | 'nonaktif'>(initialData?.status || 'aktif');
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && initialData) {
      updateUser(initialData.id, {
        name,
        nip,
        email,
        phone,
        jabatan,
        role,
        status,
        avatarUrl,
      });
    } else {
      addUser({
        name,
        nip,
        email,
        phone,
        jabatan,
        role,
        status,
        avatarUrl,
      });
    }

    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl my-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 rounded-t-xl">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isEdit ? 'Ubah Data Pengguna' : 'Tambah Pengguna Baru'}
            </h3>
            <p className="text-xs text-slate-500">
              Pengaturan akun pegawai dan hak akses sistem SIMASUK
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Lengkap & Gelar <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Dra. Hj. Ratna Sari, M.Pd."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Induk Pegawai (NIP) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="19800511 200501 1 009"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jabatan Dinas <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                placeholder="Contoh: Kasubag Tata Usaha"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Email Kedinasan <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@instansi.sch.id"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Telepon / WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Peran Hak Akses (Role) <span className="text-rose-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="admin">Administrator (Akses Penuh)</option>
                <option value="pimpinan">Pimpinan / Kepala (Disposisi & TTD)</option>
                <option value="petugas_tu">Petugas Tata Usaha (Input & Agenda)</option>
                <option value="staff">Staff / Pegawai (Tindak Lanjut)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Status Akun <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'aktif' | 'nonaktif')}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="aktif">Aktif (Dapat Login)</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-3 border border-slate-100 flex items-start gap-2.5 text-slate-600">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Hak Akses Peran:</strong> Pimpinan memiliki wewenang memberikan instruksi disposisi dan menyetujui surat keluar. Petugas TU mencatat nomor agenda buku fisik.
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2 font-semibold text-white hover:bg-slate-800 transition"
            >
              {isEdit ? 'Simpan Perubahan' : 'Tambah Pengguna'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
