import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User as UserIcon,
  ChevronDown,
  Building,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Send,
  Plus,
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenQuickMasuk: () => void;
  onOpenQuickKeluar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenQuickMasuk,
  onOpenQuickKeluar,
}) => {
  const { currentUser, users, switchUser, instansiProfile, suratMasukList, suratKeluarList } = useApp();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  // Compute pending items for badge indicators
  const pendingDisposisi = suratMasukList.filter((s) => s.statusDisposisi === 'belum').length;
  const pendingKeluar = suratKeluarList.filter((s) => s.statusPersetujuan === 'menunggu_persetujuan').length;

  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard Eksekutif & Operasional',
    surat_masuk: 'Manajemen Surat Masuk & Disposisi',
    surat_keluar: 'Manajemen Surat Keluar & Verifikasi',
    laporan: 'Buku Agenda & Rekapitulasi Laporan',
    pengguna: 'Manajemen Pengguna & Hak Akses',
    pengaturan: 'Pengaturan Instansi & Master Klasifikasi',
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator TU';
      case 'pimpinan':
        return 'Pimpinan / Kepala';
      case 'petugas_tu':
        return 'Petugas Agenda TU';
      case 'staff':
        return 'Staff / Pegawai';
      default:
        return role;
    }
  };

  return (
    <header className="no-print sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-8">
      {/* Zone 1: Contextual Title / Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="truncate max-w-[140px] font-semibold text-slate-700">
            {instansiProfile.unitKerja || 'SIMASUK'}
          </span>
          <span className="text-slate-300">/</span>
        </div>
        <h1 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 whitespace-nowrap">
          {viewTitles[currentView] || 'SIMASUK'}
        </h1>
      </div>

      {/* Zone 2: Fast Navigation Quick Links (Desktop) */}
      <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`whitespace-nowrap transition-colors ${
            currentView === 'dashboard'
              ? 'text-slate-900 font-semibold'
              : 'hover:text-slate-900'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onNavigate('surat_masuk')}
          className={`relative whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            currentView === 'surat_masuk'
              ? 'text-slate-900 font-semibold'
              : 'hover:text-slate-900'
          }`}
        >
          <span>Surat Masuk</span>
          {pendingDisposisi > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold px-1.5 py-0.2 tabular-nums">
              {pendingDisposisi}
            </span>
          )}
        </button>
        <button
          onClick={() => onNavigate('surat_keluar')}
          className={`relative whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            currentView === 'surat_keluar'
              ? 'text-slate-900 font-semibold'
              : 'hover:text-slate-900'
          }`}
        >
          <span>Surat Keluar</span>
          {pendingKeluar > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-800 text-[10px] font-semibold px-1.5 py-0.2 tabular-nums">
              {pendingKeluar}
            </span>
          )}
        </button>
        <button
          onClick={() => onNavigate('laporan')}
          className={`whitespace-nowrap transition-colors ${
            currentView === 'laporan'
              ? 'text-slate-900 font-semibold'
              : 'hover:text-slate-900'
          }`}
        >
          Buku Agenda
        </button>
        <button
          onClick={() => onNavigate('pengguna')}
          className={`whitespace-nowrap transition-colors ${
            currentView === 'pengguna'
              ? 'text-slate-900 font-semibold'
              : 'hover:text-slate-900'
          }`}
        >
          Pengguna
        </button>
      </nav>

      {/* Zone 3: Quick Action & Role / User Switcher */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Quick Add Menu */}
        <div className="relative">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 whitespace-nowrap shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Pencatatan Baru</span>
            <ChevronDown className="h-3 w-3 opacity-80" />
          </button>

          {showQuickMenu && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/5 z-50 text-xs"
              onClick={() => setShowQuickMenu(false)}
            >
              <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                Aksi Cepat
              </div>
              <button
                onClick={onOpenQuickMasuk}
                className="w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <FileText className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="font-semibold text-slate-900">Catat Surat Masuk</div>
                  <div className="text-[11px] text-slate-600">Terima dan buat nomor agenda</div>
                </div>
              </button>
              <button
                onClick={onOpenQuickKeluar}
                className="w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Send className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="font-semibold text-slate-900">Buat Surat Keluar</div>
                  <div className="text-[11px] text-slate-600">Draf naskah & ajukan verifikasi</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* User Account & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-xs font-medium text-slate-800 transition hover:bg-slate-100 hover:border-slate-300 focus:outline-none"
            title="Ganti Pengguna & Peran"
          >
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="h-7 w-7 rounded-full object-cover border border-slate-200 shrink-0"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-700 shrink-0 text-xs font-semibold">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div className="hidden md:flex flex-col text-left leading-tight">
              <span className="font-semibold text-slate-900 truncate max-w-[130px]">
                {currentUser.name.split(',')[0]}
              </span>
              <span className="text-[10px] text-slate-600 font-medium">
                {getRoleLabel(currentUser.role)}
              </span>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-600" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 z-50">
              <div className="px-2.5 py-2 border-b border-slate-100 mb-1.5">
                <div className="text-xs font-semibold text-slate-900">{currentUser.name}</div>
                <div className="text-[11px] text-slate-600">{currentUser.jabatan}</div>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-600">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  <span>Peran: {getRoleLabel(currentUser.role)}</span>
                  <span>·</span>
                  <span className="font-mono">{currentUser.nip}</span>
                </div>
              </div>

              <div className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                Simulasi Ganti Peran (Role Switcher)
              </div>
              <div className="space-y-1">
                {users.map((u) => {
                  const isSelected = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition ${
                        isSelected
                          ? 'bg-slate-100 text-slate-900 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {u.avatarUrl ? (
                          <img
                            src={u.avatarUrl}
                            alt={u.name}
                            className="h-6 w-6 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-700 shrink-0 text-[10px] font-bold">
                            {u.name.charAt(0)}
                          </div>
                        )}
                        <div className="truncate">
                          <div className="truncate font-medium">{u.name.split(',')[0]}</div>
                          <div className="text-[10px] text-slate-600">{getRoleLabel(u.role)}</div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between px-2 text-[11px]">
                <button
                  onClick={() => {
                    onNavigate('pengguna');
                    setShowUserDropdown(false);
                  }}
                  className="font-medium text-slate-600 hover:text-slate-900"
                >
                  Kelola Daftar User
                </button>
                <button
                  onClick={() => {
                    onNavigate('pengaturan');
                    setShowUserDropdown(false);
                  }}
                  className="font-medium text-slate-600 hover:text-slate-900"
                >
                  Profil Instansi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
