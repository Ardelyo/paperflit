
# Paperflit ✨📝🤖 (Eksperimental)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Language](https://img.shields.io/badge/language-HTML%2FCSS%2FJS-orange.svg)]()
[![Status](https://img.shields.io/badge/status-eksperimental-lightgrey.svg)]()
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]() <!-- Placeholder -->
[![Powered by](https://img.shields.io/badge/AI%20Powered%20by-OpenRouter-purple.svg)](https://openrouter.ai/)
[![Uses](https://img.shields.io/badge/Editor-TipTap-lightblue.svg)](https://tiptap.dev/)

Sebuah Editor Teks Eksperimental dengan Bantuan AI dan Format Lengkap, Calon Komponen untuk Platform Masa Depan.

---

## 📖 Deskripsi Singkat

**Paperflit** adalah sebuah **proyek editor teks eksperimental** berbasis web yang dirancang untuk mengeksplorasi integrasi antara pengalaman menulis modern dengan bantuan kecerdasan buatan (AI). Proyek ini menggabungkan **kemampuan format teks kaya (Rich Text Editing)** menggunakan [TipTap](https://tiptap.dev/) dengan berbagai **alat bantu penulisan berbasis AI** yang ditenagai oleh model-model melalui [OpenRouter](https://openrouter.ai/).

Sebagai sebuah percobaan, Paperflit bertujuan untuk menguji coba fitur-fitur inovatif dalam lingkungan penulisan yang intuitif. Fungsionalitas dan konsep yang dikembangkan di sini diharapkan dapat menjadi **bahan atau inspirasi untuk platform *minimalist writing space* masa depan yang bernama Paperflow**.

*(Catatan: Mengingat sifatnya yang eksperimental, beberapa fitur mungkin belum stabil atau lengkap. Fokus utama adalah pada eksplorasi dan pembuktian konsep.)*

<!-- Jika ada screenshot atau GIF demo, letakkan di sini -->
<!--
## 🚀 Demo / Tangkapan Layar

![Screenshot Editor Paperflit](link/ke/screenshot.png)
*(Ganti dengan link screenshot atau GIF demo)*
-->

## ✨ Fitur Utama (Eksperimental)

### Format Teks Kaya (Rich Text) via TipTap
*   **Gaya Dasar:** Bold, Italic, Underline, Strikethrough.
*   **Heading:** H1, H2, H3.
*   **Paragraf**
*   **List:** Bulleted & Ordered.
*   **Block Elements:** Blockquotes & Code blocks.
*   **Alignment:** Kiri, Tengah, Kanan, Justify.
*   **Undo/Redo.**
*   *(Potensial)*: Font Family, Font Size.

### Alat Bantu AI (Sidebar) via OpenRouter
*   **Get Continuations:** Saran kelanjutan teks.
*   **Custom Prompt:** Memberikan instruksi spesifik ke AI.
*   **Prompt Suggestions:** Ide atau pertanyaan relevan.
*   **Change Tone:** Mengubah gaya bahasa (Formal, Casual, Humorous, dll.).
*   **Show, Don't Tell:** Mengubah kalimat "memberi tahu" menjadi "menunjukkan".
*   **Simplify Language:** Menyederhanakan teks.
*   **Elevate Phrasing:** Memberikan saran frasa yang lebih canggih.
*   **Make Concise:** Meringkas teks.
*   **Expand Idea:** Mengembangkan ide singkat.
*   **Add Sensory Details:** Menyarankan detail indrawi.
*   **Suggest "What Ifs":** Memberikan skenario alternatif.
*   **Summarize Selection:** Membuat ringkasan.
*   **Suggest Titles:** Memberikan opsi judul.

### Fitur Lainnya
*   **Desain Modern (Material 3):** Tampilan bersih dan modern.
*   **Sidebar Toggle:** Opsi menyembunyikan/menampilkan sidebar AI.
*   **Word Count:** Penghitung kata otomatis.
*   **Manajemen API Key:** Penyimpanan lokal untuk kunci OpenRouter.

## 🛠️ Instalasi & Pengaturan

Proyek ini murni berjalan di sisi klien (client-side).

1.  **Clone Repository:**
    ```bash
    git clone https://link-ke-repository-anda.git
    cd paperflit # Atau nama folder repository Anda
    ```
2.  **Buka di Browser:**
    *   Buka file `index.html` di browser web modern.

3.  **Dapatkan API Key OpenRouter:**
    *   Kunjungi [OpenRouter.ai](https://openrouter.ai/) untuk mendapatkan API Key.

4.  **Masukkan API Key:**
    *   Masukkan API Key OpenRouter Anda di bagian "AI Tools" pada sidebar dan simpan.

## 💡 Penggunaan

1.  **Menulis & Memformat:** Gunakan area editor utama dan toolbar format.
2.  **Menggunakan Alat AI:** (Pastikan API Key valid) Pilih teks jika diperlukan, lalu klik tombol AI di sidebar kanan. Hasil/saran akan muncul di bawah tombolnya. Klik saran untuk menyisipkannya.
3.  **Sidebar:** Gunakan tombol toggle (ikon chevron di kanan atas) untuk mengontrol visibilitas sidebar.

## 💻 Teknologi yang Digunakan

*   **HTML5, CSS3, JavaScript (ES6+)**
*   **[TipTap](https://tiptap.dev/):** Framework Rich Text Editor.
    *   `@tiptap/core`, `@tiptap/starter-kit`, `@tiptap/extension-underline`, `@tiptap/extension-text-align`, `@tiptap/extension-character-count`
*   **[Material Icons](https://fonts.google.com/icons)**
*   **[OpenRouter AI](https://openrouter.ai/)**

## 🤝 Berkontribusi

Meskipun ini proyek eksperimental, kontribusi tetap diterima!

1.  **Buat Issue:** Laporkan bug atau diskusikan ide di [halaman Issues](link/ke/issues).
2.  **Fork & Pull Request:** Ikuti alur standar GitHub (Fork -> Branch -> Commit -> Push -> PR).

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**.

```text
MIT License

Copyright (c) [Tahun Sekarang] Ardelyo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Kredit & Kolaborasi

Proyek **Paperflit (Eksperimental)** ini dibuat oleh:

**Ardelyo** ([bit.ly/ardelyo](http://bit.ly/ardelyo))

Seorang pelajar dari Indonesia.

Proyek ini dikembangkan sebagai eksplorasi fitur dan konsep, dengan tujuan kolaborasi bersama **OurCreativity** dalam rangka **Edisi Karya Tulis**. Konsep ini juga diharapkan dapat berkontribusi pada pengembangan platform **Paperflow** di masa mendatang. Terima kasih atas inspirasi dan dukungannya.

---

Selamat Bereksperimen! 🚀
