# Paperflit

_Dibuat oleh Ardelyo, kolaborasi dengan OurCreativity Edisi Karya Tulis_

---

## Gambaran Umum

**Paperflit** adalah editor teks kaya berbasis web yang dirancang untuk memudahkan penulisan dan penyuntingan karya tulis dengan bantuan kecerdasan buatan (AI). Editor ini menggabungkan fitur pengeditan teks standar dengan berbagai alat AI yang terintegrasi langsung, memudahkan proses menulis, mengembangkan ide, dan memperbaiki gaya bahasa.

Paperflit dibangun menggunakan pustaka [TipTap](https://tiptap.dev/) untuk fungsi editor teks, serta mengusung antarmuka modern yang mengikuti prinsip Material Design 3.

---

## Fitur Utama

### Pengeditan Teks Kaya
- Format teks standar: **Tebal**, *Miring*, _Garis Bawah_, ~Coret~
- Judul (H1, H2, H3)
- Daftar berpoin dan bernomor
- Kutipan blok
- Blok kode (inline dan blok)
- Perataan teks (kiri, tengah, kanan, rata kiri-kanan)
- Undo dan redo
- Penghitung jumlah kata

### Bantuan Penulisan Berbasis AI (menggunakan OpenRouter API)
Sidebar khusus menyediakan berbagai alat AI (memerlukan API key OpenRouter):
- **Generasi Teks:**
  - Lanjutkan tulisan secara otomatis
  - Gunakan prompt khusus sesuai instruksi pengguna
  - Saran ide prompt berdasarkan teks saat ini
- **Penyempurnaan & Gaya Bahasa:**
  - Ubah nada tulisan (Formal, Santai, Misterius, dll.)
  - Perbaiki gaya "Show, Don't Tell"
  - Permudah bahasa
  - Gunakan bahasa yang lebih elegan
  - Buat kalimat lebih ringkas
- **Pengembangan Ide:**
  - Kembangkan ide atau konsep yang ada
  - Tambahkan detail sensorik
  - Buat alternatif skenario atau alur cerita
- **Analisis & Struktur:**
  - Ringkas teks terpilih
  - Berikan saran judul

### Antarmuka Pengguna
- Desain modern dan bersih berbasis Material Design 3
- Sidebar AI yang dapat disembunyikan
- Toolbar responsif untuk format teks
- Area khusus untuk hasil AI yang mudah disisipkan ke dokumen

---

## Teknologi yang Digunakan

- **Frontend:** HTML5, CSS3, JavaScript (ES Modules)
- **Editor Teks:** [TipTap](https://tiptap.dev/) versi 2
- **Integrasi AI:** [OpenRouter API](https://openrouter.ai/) (default model: `google/gemma-2-9b-it:free`)
- **Styling:** CSS kustom dengan Material Design 3
- **Dependensi:** Diambil via CDN (`esm.sh`), tanpa proses build lokal

---

## Cara Menggunakan

1. **Unduh Proyek:** Dapatkan file `index.html`, `style.css`, `script.js`, dan `editor.js`.
2. **Jalankan Secara Lokal:** Gunakan server HTTP sederhana (misalnya `python -m http.server` atau ekstensi Live Server di VS Code) untuk membuka `index.html`. Ini penting karena proyek menggunakan modul ES.
3. **Buka di Browser:** Akses alamat server lokal, misalnya `http://localhost:8000`.
4. **Masukkan API Key:**
   - Dapatkan API key dari [OpenRouter.ai](https://openrouter.ai/).
   - Masukkan ke kolom "OpenRouter API Key" di sidebar, lalu klik "Save".
   - Setelah tersimpan, fitur AI akan aktif (API key disimpan di local storage browser).
5. **Mulai Menulis:** Gunakan editor untuk menulis dan manfaatkan alat AI di sidebar. Pilih teks sebelum menggunakan alat yang memerlukan seleksi.

---

## Struktur File

- `index.html` : Struktur utama halaman, termasuk editor, toolbar, dan sidebar.
- `style.css` : Seluruh aturan CSS dan tema Material Design 3.
- `editor.js` : Inisialisasi dan konfigurasi editor TipTap.
- `script.js` : Logika aplikasi, interaksi UI, manajemen API key, panggilan API OpenRouter, dan menampilkan hasil AI.
- `README.md` : Dokumentasi proyek ini.

---

## Lisensi

Proyek ini dilisensikan di bawah lisensi MIT. Silakan gunakan, modifikasi, dan distribusikan sesuai kebutuhan.
