import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Inbox,
  Send,
  BookOpen,
  Users,
  Settings,
  FileCheck2,
  Building2,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { instansiProfile, suratMasukList, suratKeluarList, currentUser } = useApp();

  const pendingDisposisi = suratMasukList.filter((s) => s.statusDisposisi === 'belum').length;
  const pendingKeluar = suratKeluarList.filter((s) => s.statusPersetujuan === 'menunggu_persetujuan').length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'surat_masuk',
      label: 'Surat Masuk',
      icon: Inbox,
      badge: pendingDisposisi > 0 ? `${pendingDisposisi} baru` : null,
      badgeColor: 'text-amber-800 bg-amber-50',
    },
    {
      id: 'surat_keluar',
      label: 'Surat Keluar',
      icon: Send,
      badge: pendingKeluar > 0 ? `${pendingKeluar} draf` : null,
      badgeColor: 'text-blue-800 bg-blue-50',
    },
    {
      id: 'laporan',
      label: 'Buku Agenda & Laporan',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'pengguna',
      label: 'Manajemen Pengguna',
      icon: Users,
      badge: null,
    },
    {
      id: 'pengaturan',
      label: 'Pengaturan Instansi',
      icon: Settings,
      badge: null,
    },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`no-print fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Zone */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            {instansiProfile.logoUrl ? (
              <img
                src={instansiProfile.logoUrl}
                alt="Logo Instansi"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Building2 className="h-5 w-5 text-slate-700" />
            )}
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-bold tracking-tight text-slate-900 truncate">
              SIMASUK ARSIP
            </span>
            <span className="text-[11px] font-medium text-slate-500 truncate">
              Tata Persuratan Resmi
            </span>
          </div>
        </div>

        {/* Institution Info Card */}
        <div className="mx-4 mt-4 mb-2 rounded-lg border border-slate-100 bg-slate-50/80 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Satuan Kerja
          </div>
          <div className="mt-1 text-xs font-semibold text-slate-800 leading-snug line-clamp-2">
            {instansiProfile.unitKerja}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 truncate">
            {instansiProfile.subInstansi}
          </div>
        </div>

        {/* Main Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-1.5">
            Menu Utama
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'
                      }`}
                    />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Workflow Guide */}
          <div className="mt-8 px-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Alur Standar Naskah Dinas
            </div>
            <div className="space-y-2 text-[11px] text-slate-500">
              <div className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                  1
                </span>
                <span>Pencatatan & nomor agenda</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                  2
                </span>
                <span>Disposisi & instruksi pimpinan</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                  3
                </span>
                <span>Tindak lanjut & penomoran keluar</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Footnote */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="h-9 w-9 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700 text-xs">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div className="truncate">
              <div className="text-xs font-semibold text-slate-900 truncate">
                {currentUser.name}
              </div>
              <div className="text-[11px] text-slate-500 truncate font-mono">
                {currentUser.nip}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
