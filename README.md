# Magic Text Editor ✨📝🤖

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Language](https://img.shields.io/badge/language-HTML%2FCSS%2FJS-orange.svg)]()
[![Version](https://img.shields.io/badge/version-1.0.0--beta-blue.svg)]()
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]() <!-- Placeholder -->
[![Powered by](https://img.shields.io/badge/AI%20Powered%20by-OpenRouter-purple.svg)](https://openrouter.ai/)
[![Uses](https://img.shields.io/badge/Editor-TipTap-lightblue.svg)](https://tiptap.dev/)

Editor Teks Cerdas dengan Bantuan AI dan Fitur Format Lengkap

---

## 📖 Deskripsi Singkat

**Magic Text Editor** adalah sebuah editor teks modern berbasis web yang dirancang untuk meningkatkan pengalaman menulis Anda. Proyek ini mengintegrasikan **kemampuan format teks kaya (Rich Text Editing)** menggunakan [TipTap](https://tiptap.dev/) dengan berbagai **alat bantu penulisan berbasis AI** yang ditenagai oleh model-model melalui [OpenRouter](https://openrouter.ai/). Editor ini memungkinkan Anda tidak hanya memformat tulisan Anda secara visual tetapi juga mendapatkan bantuan cerdas untuk melanjutkan ide, mendapatkan saran, mengubah gaya tulisan, dan banyak lagi.

Proyek ini bertujuan untuk menyediakan lingkungan menulis yang intuitif dan powerful, cocok untuk penulis konten, pelajar, atau siapa saja yang ingin menuangkan ide dengan lebih efektif.

*(Catatan: Proyek ini masih dalam tahap pengembangan, fokus utama saat ini adalah fungsionalitas inti.)*

<!-- Jika ada screenshot atau GIF demo, letakkan di sini -->
<!--
## 🚀 Demo / Tangkapan Layar

![Screenshot Editor](link/ke/screenshot.png)
*(Ganti dengan link screenshot atau GIF demo)*
-->

## ✨ Fitur Utama

### Format Teks Kaya (Rich Text)
Didukung oleh **TipTap**, editor ini menyediakan alat format standar yang Anda harapkan:
*   **Gaya Dasar:** **Bold**, *Italic*, _Underline_, ~~Strikethrough~~.
*   **Heading:** H1, H2, H3.
*   **Paragraf:** Format teks standar.
*   **List:** Bulleted list (daftar poin) dan Ordered list (daftar bernomor).
*   **Block Elements:** Blockquotes dan Code blocks.
*   **Alignment:** Rata Kiri, Tengah, Kanan, dan Justify (membutuhkan ekstensi TipTap).
*   **Undo/Redo:** Kembalikan atau ulangi aksi terakhir Anda.
*   *(Potensial)*: Font Family, Font Size (membutuhkan ekstensi TipTap tambahan).

### Alat Bantu AI (Sidebar)
Sidebar interaktif menyediakan akses cepat ke berbagai model AI via OpenRouter untuk membantu proses menulis:
*   **Get Continuations:** Memberikan saran kelanjutan teks berdasarkan konteks terakhir.
*   **Custom Prompt:** Memungkinkan pengguna memberikan instruksi spesifik kepada AI (misal: "buat lebih lucu", "jelaskan lebih detail").
*   **Prompt Suggestions:** Memberikan ide atau pertanyaan relevan berdasarkan teks yang ada untuk eksplorasi lebih lanjut.
*   **Change Tone:** Mengubah gaya bahasa teks yang dipilih menjadi nada yang berbeda (Formal, Casual, Humorous, Mysterious, dll.).
*   **Show, Don't Tell:** Mengubah kalimat yang bersifat "memberi tahu" menjadi deskripsi yang lebih "menunjukkan".
*   **Simplify Language:** Menyederhanakan kalimat atau paragraf yang kompleks.
*   **Elevate Phrasing:** Memberikan saran kata atau frasa yang lebih canggih atau menarik.
*   **Make Concise:** Membantu meringkas teks yang dipilih tanpa kehilangan makna inti.
*   **Expand Idea:** Mengembangkan kalimat atau ide singkat menjadi paragraf yang lebih detail.
*   **Add Sensory Details:** Menyarankan detail indrawi (penglihatan, suara, bau, rasa, sentuhan) untuk memperkaya deskripsi.
*   **Suggest "What Ifs":** Memberikan skenario alternatif atau plot twist berdasarkan konteks.
*   **Summarize Selection:** Membuat ringkasan dari teks yang dipilih.
*   **Suggest Titles:** Memberikan beberapa opsi judul berdasarkan keseluruhan teks.
*   *(Potensial)*: Find Repetitions, Brainstorm Related Concepts.

### Fitur Lainnya
*   **Desain Modern:** Menggunakan prinsip Material Design 3 (Material You) untuk tampilan yang bersih dan modern.
*   **Sidebar Toggle:** Kemampuan untuk menyembunyikan/menampilkan sidebar AI Tools.
*   **Word Count:** Penghitung kata otomatis di bagian bawah editor.
*   **Manajemen API Key:** Menyimpan API Key OpenRouter dengan aman di `localStorage` browser.

## 🛠️ Instalasi & Pengaturan

Proyek ini murni berjalan di sisi klien (client-side) menggunakan HTML, CSS, dan JavaScript. Tidak diperlukan build step yang kompleks untuk versi dasar.

1.  **Clone Repository:**
    ```bash
    git clone https://link-ke-repository-anda.git
    cd magic-text-editor # Atau nama folder repository Anda
    ```
2.  **Buka di Browser:**
    *   Cukup buka file `index.html` langsung di browser web modern pilihan Anda (Chrome, Firefox, Edge, Safari).

3.  **Dapatkan API Key OpenRouter:**
    *   Kunjungi [OpenRouter.ai](https://openrouter.ai/).
    *   Daftar atau login untuk mendapatkan API Key Anda. Model AI gratis mungkin tersedia, tetapi periksa pricing dan kuota mereka.

4.  **Masukkan API Key:**
    *   Setelah editor terbuka di browser, masukkan API Key OpenRouter Anda di bagian "AI Tools" pada sidebar.
    *   Klik tombol simpan (ikon disket). Status akan berubah menjadi "API Key is set." dan tombol-tombol AI akan aktif.

## 💡 Penggunaan

1.  **Menulis & Memformat:**
    *   Ketik langsung di area editor utama.
    *   Gunakan tombol-tombol pada **Formatting Toolbar** di atas area editor untuk menerapkan format seperti bold, italic, heading, list, dll.
    *   Toolbar akan menunjukkan status aktif format pada kursor atau teks yang dipilih.
2.  **Menggunakan Alat AI:**
    *   Pastikan API Key OpenRouter sudah tersimpan dan valid.
    *   **Untuk alat yang memerlukan konteks/seleksi:** Pilih (highlight) bagian teks yang ingin Anda proses di editor.
    *   **Klik tombol AI yang relevan** di sidebar kanan (misal: "Change Tone", "Simplify Text", "Expand Idea").
    *   **Untuk alat seperti "Get Continuations" atau "Suggest Prompts":** Cukup klik tombolnya, AI akan menggunakan konteks dari teks yang ada.
    *   **Untuk "Custom Prompt":** Ketik instruksi Anda di input field, lalu klik "Use Prompt".
    *   Hasil atau saran dari AI akan muncul di area output di bawah tombol masing-masing. Klik pada saran untuk menyisipkannya ke dalam editor (akan menggantikan teks yang dipilih jika ada, atau menyisipkan di posisi kursor).
3.  **Sidebar:**
    *   Gunakan tombol toggle (ikon menu/chevron di kanan atas) untuk menyembunyikan atau menampilkan sidebar AI Tools.

## 💻 Teknologi yang Digunakan

*   **HTML5:** Struktur dasar halaman.
*   **CSS3:** Styling dan layout (dengan prinsip Material Design 3).
*   **JavaScript (ES6+):** Logika aplikasi, interaksi DOM, pemanggilan API.
*   **[TipTap](https://tiptap.dev/):** Framework editor teks kaya (Rich Text Editor) berbasis ProseMirror.
    *   `@tiptap/core`
    *   `@tiptap/starter-kit` (Paragraph, Bold, Italic, Strike, Headings, Lists, Blockquote, CodeBlock, History, etc.)
    *   `@tiptap/extension-underline`
    *   `@tiptap/extension-text-align`
    *   `@tiptap/extension-character-count`
*   **[Material Icons](https://fonts.google.com/icons):** Ikonografi.
*   **[OpenRouter AI](https://openrouter.ai/):** Penyedia API untuk mengakses berbagai model AI (LLM).

## 🤝 Berkontribusi

Kontribusi sangat diharapkan! Jika Anda menemukan bug, memiliki ide fitur, atau ingin meningkatkan proyek ini, jangan ragu untuk:

1.  **Membuat Issue:** Laporkan bug atau diskusikan fitur baru di [halaman Issues](link/ke/issues).
2.  **Fork Repository:** Buat fork dari repository ini.
3.  **Buat Branch Baru:** (`git checkout -b fitur/nama-fitur-keren`).
4.  **Lakukan Perubahan:** Implementasikan perbaikan atau fitur baru Anda.
5.  **Commit Perubahan:** (`git commit -m 'Menambahkan fitur X'`).
6.  **Push ke Branch:** (`git push origin fitur/nama-fitur-keren`).
7.  **Buat Pull Request:** Buka Pull Request ke branch `main` repository asli.

Mohon ikuti gaya kode yang sudah ada dan pastikan perubahan Anda relevan dengan tujuan proyek.

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**. Lihat file `LICENSE` (jika ada) atau teks di bawah ini untuk detail lengkapnya.

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

Proyek **Magic Text Editor** ini dibuat oleh:

**Ardelyo** ([bit.ly/ardelyo](http://bit.ly/ardelyo))

Seorang pelajar dari Indonesia.

Proyek ini dikembangkan dengan tujuan kolaborasi bersama **OurCreativity** dalam rangka **Edisi Karya Tulis**. Terima kasih kepada semua pihak yang mendukung dan memberikan inspirasi.

---

Selamat Menulis! 🚀
