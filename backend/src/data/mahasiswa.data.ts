export type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
};

export let mahasiswa: Mahasiswa[] = [
  {
    id: 1,
    nim: "2201001",
    nama: "Ahmad Fauzi",
    prodi: "Informatika",
    angkatan: 2022,
  },
  {
    id: 2,
    nim: "2201002",
    nama: "Siti Aminah",
    prodi: "Sistem Informasi",
    angkatan: 2022,
  },
];