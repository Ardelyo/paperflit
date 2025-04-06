# Alur Kerja Paperflit

Berikut adalah deskripsi terperinci alur kerja aplikasi Paperflit:

1.  **Inisialisasi Aplikasi:**
    *   `index.html` dimuat di browser.
    *   Berkas CSS (`style.css`) diterapkan untuk styling awal.
    *   Berkas JavaScript (`main.js`) mulai dieksekusi.
    *   `main.js` menginisialisasi modul-modul lain:
        *   `config.js` dimuat untuk konfigurasi aplikasi.
        *   `apiClient.js` diinisialisasi untuk komunikasi API.
        *   `editorSetup.js` diinisialisasi untuk menyiapkan editor TipTap di area utama.
        *   `uiHandlers.js` diinisialisasi untuk mengatur interaksi UI dan event listener.
        *   `notesManager.js` diinisialisasi untuk fitur catatan di sidebar.
    *   Editor TipTap diinisialisasi di dalam `editorSetup.js` dan terpasang ke elemen di `index.html`.
    *   Event listener UI diatur di dalam `uiHandlers.js` untuk menangani interaksi pengguna seperti klik tombol dan perubahan input.
    *   Fitur catatan diinisialisasi di dalam `notesManager.js`, memungkinkan pengguna membuat dan mengelola catatan di sidebar.

2.  **Pembuatan dan Pengeditan Konten:**
    *   Pengguna berinteraksi dengan editor TipTap di area utama (`editorSetup.js` dan `editor.js`).
    *   Pengguna menggunakan toolbar (`toolbar.css` dan `editorSetup.js`) untuk memformat teks (bold, italic, heading, dll.).
    *   Editor TipTap menyimpan konten teks yang diformat dalam memori.

3.  **Penggunaan Fitur AI:**
    *   Pengguna berinteraksi dengan tombol-tombol AI di sidebar (`sidebarComponents.css` dan `uiHandlers.js`).
    *   `uiHandlers.js` menangkap klik tombol AI dan memicu permintaan ke `apiClient.js`.
    *   `apiClient.js` mengambil kunci API dari konfigurasi (`config.js`) atau penyimpanan lokal.
    *   `apiClient.js` mengirim permintaan ke OpenRouter API dengan prompt dan konteks yang sesuai.
    *   Respons dari OpenRouter API diterima oleh `apiClient.js`.
    *   `uiHandlers.js` menerima respons AI dari `apiClient.js`.
    *   `uiHandlers.js` menampilkan hasil AI di area output UI (`uiHandlers.js` dan CSS terkait).
    *   Pengguna dapat memilih untuk menyisipkan hasil AI ke dalam editor TipTap.

4.  **Manajemen Catatan:**
    *   Pengguna berinteraksi dengan fitur catatan di sidebar (`sidebarComponents.css` dan `notesManager.js`).
    *   `notesManager.js` memungkinkan pengguna membuat catatan baru, mengedit catatan yang ada, menghapus catatan, dan menyematkan catatan.
    *   Catatan disimpan secara lokal di browser (kemungkinan menggunakan Local Storage).
    *   `notesManager.js` menampilkan daftar catatan di sidebar dan memungkinkan pengguna untuk membuka dan menutup editor catatan (`editor.js` instance untuk catatan).

5.  **Pengaturan API Key:**
    *   Pengguna memasukkan API Key OpenRouter di input field di sidebar (`sidebarComponents.css` dan `uiHandlers.js`).
    *   `uiHandlers.js` menangkap input API Key dan memanggil fungsi di `apiClient.js` atau langsung menyimpan ke Local Storage (atau melalui `config.js`).
    *   API Key disimpan secara lokal di browser sehingga dapat digunakan kembali di sesi berikutnya.
    *   Status API Key (valid atau tidak valid) ditampilkan di UI (`uiHandlers.js`).