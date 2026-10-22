export type UserRole = 'admin' | 'pimpinan' | 'petugas_tu' | 'staff';

export interface User {
  id: string;
  name: string;
  nip: string;
  email: string;
  role: UserRole;
  jabatan: string;
  status: 'aktif' | 'nonaktif';
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
}

export type SuratSifat = 'biasa' | 'penting' | 'rahasia' | 'sangat_rahasia' | 'segera';

export interface KlasifikasiSurat {
  kode: string;
  nama: string;
  deskripsi?: string;
}

export interface DisposisiItem {
  id: string;
  suratId: string;
  dariUserId: string;
  dariNama: string;
  kepadaUserId: string;
  kepadaNama: string;
  tanggal: string; // YYYY-MM-DD
  batasWaktu: string; // YYYY-MM-DD
  instruksi: string[]; // e.g. ["Tindak Lanjuti", "Hadiri/Wakili", "Arsipkan"]
  catatan: string;
  status: 'menunggu' | 'proses' | 'selesai';
  tanggapan?: string;
  tanggalSelesai?: string;
}

export interface SuratMasuk {
  id: string;
  noAgenda: string;
  noSurat: string;
  tanggalSurat: string; // YYYY-MM-DD
  tanggalTerima: string; // YYYY-MM-DD
  asalSurat: string;
  ditujukanKepada: string;
  perihal: string;
  ringkasan?: string;
  kodeKlasifikasi: string;
  sifat: SuratSifat;
  lokasiArsip: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  statusDisposisi: 'belum' | 'proses' | 'selesai';
  disposisiList: DisposisiItem[];
  createdAt: string;
}

export type StatusSuratKeluar = 'draft' | 'menunggu_persetujuan' | 'disetujui' | 'terkirim';

export interface SuratKeluar {
  id: string;
  noAgenda: string;
  noSurat: string;
  tanggalSurat: string;
  tanggalKirim: string;
  tujuanSurat: string;
  alamatTujuan: string;
  perihal: string;
  isiSurat?: string;
  kodeKlasifikasi: string;
  sifat: SuratSifat;
  statusPersetujuan: StatusSuratKeluar;
  penandatangan: string;
  nipPenandatangan: string;
  pengonsep: string;
  lokasiArsip: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  catatanPersetujuan?: string;
  createdAt: string;
}

export interface InstansiProfile {
  namaInstansi: string;
  subInstansi: string;
  unitKerja: string;
  alamat: string;
  kota: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  kepalaNama: string;
  kepalaNip: string;
  kepalaJabatan: string;
  logoUrl: string;
}
