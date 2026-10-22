import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { SuratMasukView } from './components/surat-masuk/SuratMasukView';
import { SuratKeluarView } from './components/surat-keluar/SuratKeluarView';
import { LaporanView } from './components/laporan/LaporanView';
import { PenggunaView } from './components/pengguna/PenggunaView';
import { PengaturanView } from './components/pengaturan/PengaturanView';
import { SuratMasukFormModal } from './components/surat-masuk/SuratMasukFormModal';
import { SuratKeluarFormModal } from './components/surat-keluar/SuratKeluarFormModal';
import { SuratMasuk, SuratKeluar } from './types';
import { Menu } from 'lucide-react';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Quick Action Modals
  const [isQuickMasukOpen, setIsQuickMasukOpen] = useState(false);
  const [isQuickKeluarOpen, setIsQuickKeluarOpen] = useState(false);

  // Deep-link triggers from Dashboard
  const [selectedSuratMasukForDisposisi, setSelectedSuratMasukForDisposisi] =
    useState<SuratMasuk | null>(null);
  const [selectedSuratKeluarForPreview, setSelectedSuratKeluarForPreview] =
    useState<SuratKeluar | null>(null);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDisposisiFromDash = (surat: SuratMasuk) => {
    setSelectedSuratMasukForDisposisi(surat);
    setCurrentView('surat_masuk');
  };

  const handleOpenPreviewKeluarFromDash = (surat: SuratKeluar) => {
    setSelectedSuratKeluarForPreview(surat);
    setCurrentView('surat_keluar');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <div className="relative">
          {/* Mobile hamburger button */}
          <div className="lg:hidden absolute left-3 top-4 z-40">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 shadow-xs"
              aria-label="Buka menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <Header
            currentView={currentView}
            onNavigate={handleNavigate}
            onOpenQuickMasuk={() => setIsQuickMasukOpen(true)}
            onOpenQuickKeluar={() => setIsQuickKeluarOpen(true)}
          />
        </div>

        {/* Viewport Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              onNavigate={handleNavigate}
              onOpenSuratMasukModal={() => setIsQuickMasukOpen(true)}
              onOpenSuratKeluarModal={() => setIsQuickKeluarOpen(true)}
              onSelectSuratMasuk={(surat) => {
                setSelectedSuratMasukForDisposisi(surat);
                setCurrentView('surat_masuk');
              }}
              onSelectSuratKeluar={(surat) => {
                setSelectedSuratKeluarForPreview(surat);
                setCurrentView('surat_keluar');
              }}
              onOpenDisposisiModal={handleOpenDisposisiFromDash}
            />
          )}

          {currentView === 'surat_masuk' && (
            <SuratMasukView
              selectedSuratForDisposisi={selectedSuratMasukForDisposisi}
              onClearSelectedDisposisi={() => setSelectedSuratMasukForDisposisi(null)}
            />
          )}

          {currentView === 'surat_keluar' && (
            <SuratKeluarView
              selectedSuratForPreview={selectedSuratKeluarForPreview}
              onClearSelectedPreview={() => setSelectedSuratKeluarForPreview(null)}
            />
          )}

          {currentView === 'laporan' && <LaporanView />}

          {currentView === 'pengguna' && <PenggunaView />}

          {currentView === 'pengaturan' && <PengaturanView />}
        </main>
      </div>

      {/* Quick Create Surat Masuk Modal */}
      {isQuickMasukOpen && (
        <SuratMasukFormModal
          onClose={() => setIsQuickMasukOpen(false)}
          onSaved={() => {
            setIsQuickMasukOpen(false);
            setCurrentView('surat_masuk');
          }}
        />
      )}

      {/* Quick Create Surat Keluar Modal */}
      {isQuickKeluarOpen && (
        <SuratKeluarFormModal
          onClose={() => setIsQuickKeluarOpen(false)}
          onSaved={() => {
            setIsQuickKeluarOpen(false);
            setCurrentView('surat_keluar');
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
