import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  SuratMasuk,
  SuratKeluar,
  KlasifikasiSurat,
  InstansiProfile,
  DisposisiItem,
} from '../types';
import {
  initialUsers,
  initialSuratMasuk,
  initialSuratKeluar,
  initialKlasifikasi,
  initialInstansiProfile,
} from '../data/initialData';

interface AppContextType {
  currentUser: User;
  switchUser: (userId: string) => void;
  users: User[];
  addUser: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  suratMasukList: SuratMasuk[];
  addSuratMasuk: (
    data: Omit<SuratMasuk, 'id' | 'createdAt' | 'disposisiList' | 'statusDisposisi'>
  ) => SuratMasuk;
  updateSuratMasuk: (id: string, updates: Partial<SuratMasuk>) => void;
  deleteSuratMasuk: (id: string) => void;
  addDisposisi: (
    suratId: string,
    disposisi: Omit<DisposisiItem, 'id' | 'suratId'>
  ) => void;
  updateDisposisi: (
    suratId: string,
    disposisiId: string,
    updates: Partial<DisposisiItem>
  ) => void;

  suratKeluarList: SuratKeluar[];
  addSuratKeluar: (data: Omit<SuratKeluar, 'id' | 'createdAt'>) => SuratKeluar;
  updateSuratKeluar: (id: string, updates: Partial<SuratKeluar>) => void;
  deleteSuratKeluar: (id: string) => void;
  approveSuratKeluar: (id: string, catatan?: string) => void;

  klasifikasiList: KlasifikasiSurat[];
  addKlasifikasi: (item: KlasifikasiSurat) => void;

  instansiProfile: InstansiProfile;
  updateInstansiProfile: (updates: Partial<InstansiProfile>) => void;

  resetToDefaultData: () => void;
  generateNextNoAgendaMasuk: () => string;
  generateNextNoAgendaKeluar: () => string;
}

const STORAGE_KEY_PREFIX = 'simasuk_v1_';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}users`);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}current_user_id`);
    return saved || 'usr-1';
  });

  const [suratMasukList, setSuratMasukList] = useState<SuratMasuk[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}surat_masuk`);
    return saved ? JSON.parse(saved) : initialSuratMasuk;
  });

  const [suratKeluarList, setSuratKeluarList] = useState<SuratKeluar[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}surat_keluar`);
    return saved ? JSON.parse(saved) : initialSuratKeluar;
  });

  const [klasifikasiList, setKlasifikasiList] = useState<KlasifikasiSurat[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}klasifikasi`);
    return saved ? JSON.parse(saved) : initialKlasifikasi;
  });

  const [instansiProfile, setInstansiProfile] = useState<InstansiProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}instansi`);
    return saved ? JSON.parse(saved) : initialInstansiProfile;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}current_user_id`, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}surat_masuk`, JSON.stringify(suratMasukList));
  }, [suratMasukList]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}surat_keluar`, JSON.stringify(suratKeluarList));
  }, [suratKeluarList]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}klasifikasi`, JSON.stringify(klasifikasiList));
  }, [klasifikasiList]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}instansi`, JSON.stringify(instansiProfile));
  }, [instansiProfile]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const generateNextNoAgendaMasuk = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const count = suratMasukList.length + 1;
    return `AGD/${year}/${month}/${String(count).padStart(3, '0')}`;
  };

  const generateNextNoAgendaKeluar = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const count = suratKeluarList.length + 1;
    return `SK/${year}/${month}/${String(count).padStart(3, '0')}`;
  };

  const addSuratMasuk = (
    data: Omit<SuratMasuk, 'id' | 'createdAt' | 'disposisiList' | 'statusDisposisi'>
  ): SuratMasuk => {
    const newItem: SuratMasuk = {
      ...data,
      id: `sm-${Date.now()}`,
      statusDisposisi: 'belum',
      disposisiList: [],
      createdAt: new Date().toISOString(),
    };
    setSuratMasukList((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateSuratMasuk = (id: string, updates: Partial<SuratMasuk>) => {
    setSuratMasukList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteSuratMasuk = (id: string) => {
    setSuratMasukList((prev) => prev.filter((item) => item.id !== id));
  };

  const addDisposisi = (
    suratId: string,
    disposisiData: Omit<DisposisiItem, 'id' | 'suratId'>
  ) => {
    const newDisposisi: DisposisiItem = {
      ...disposisiData,
      id: `disp-${Date.now()}`,
      suratId,
    };

    setSuratMasukList((prev) =>
      prev.map((item) => {
        if (item.id !== suratId) return item;
        const updatedList = [...item.disposisiList, newDisposisi];
        return {
          ...item,
          disposisiList: updatedList,
          statusDisposisi: newDisposisi.status === 'selesai' ? 'selesai' : 'proses',
        };
      })
    );
  };

  const updateDisposisi = (
    suratId: string,
    disposisiId: string,
    updates: Partial<DisposisiItem>
  ) => {
    setSuratMasukList((prev) =>
      prev.map((item) => {
        if (item.id !== suratId) return item;
        const updatedList = item.disposisiList.map((d) =>
          d.id === disposisiId ? { ...d, ...updates } : d
        );

        // Calculate overall status
        const allDone = updatedList.length > 0 && updatedList.every((d) => d.status === 'selesai');
        const anyProcess = updatedList.some((d) => d.status === 'proses' || d.status === 'menunggu');

        let newStatus: 'belum' | 'proses' | 'selesai' = item.statusDisposisi;
        if (allDone) {
          newStatus = 'selesai';
        } else if (anyProcess) {
          newStatus = 'proses';
        }

        return {
          ...item,
          disposisiList: updatedList,
          statusDisposisi: newStatus,
        };
      })
    );
  };

  const addSuratKeluar = (data: Omit<SuratKeluar, 'id' | 'createdAt'>): SuratKeluar => {
    const newItem: SuratKeluar = {
      ...data,
      id: `sk-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setSuratKeluarList((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateSuratKeluar = (id: string, updates: Partial<SuratKeluar>) => {
    setSuratKeluarList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteSuratKeluar = (id: string) => {
    setSuratKeluarList((prev) => prev.filter((item) => item.id !== id));
  };

  const approveSuratKeluar = (id: string, catatan?: string) => {
    setSuratKeluarList((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const now = new Date().toISOString().split('T')[0];
        return {
          ...item,
          statusPersetujuan: 'disetujui',
          tanggalKirim: item.tanggalKirim || now,
          catatanPersetujuan:
            catatan ||
            `Disetujui dan ditandatangani oleh ${currentUser.name} (${currentUser.jabatan}) pada ${now}.`,
        };
      })
    );
  };

  const addKlasifikasi = (item: KlasifikasiSurat) => {
    setKlasifikasiList((prev) => [...prev, item]);
  };

  const updateInstansiProfile = (updates: Partial<InstansiProfile>) => {
    setInstansiProfile((prev) => ({ ...prev, ...updates }));
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}users`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}current_user_id`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}surat_masuk`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}surat_keluar`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}klasifikasi`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}instansi`);
    setUsers(initialUsers);
    setCurrentUserId('usr-1');
    setSuratMasukList(initialSuratMasuk);
    setSuratKeluarList(initialSuratKeluar);
    setKlasifikasiList(initialKlasifikasi);
    setInstansiProfile(initialInstansiProfile);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        users,
        addUser,
        updateUser,
        deleteUser,
        suratMasukList,
        addSuratMasuk,
        updateSuratMasuk,
        deleteSuratMasuk,
        addDisposisi,
        updateDisposisi,
        suratKeluarList,
        addSuratKeluar,
        updateSuratKeluar,
        deleteSuratKeluar,
        approveSuratKeluar,
        klasifikasiList,
        addKlasifikasi,
        instansiProfile,
        updateInstansiProfile,
        resetToDefaultData,
        generateNextNoAgendaMasuk,
        generateNextNoAgendaKeluar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
