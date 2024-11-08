# Trace.AI - Analisis Pengadaan Berbasis AI

Trace.AI adalah sistem analisis pengadaan cerdas yang membantu organisasi mengotomatisasi penguraian dokumen, mendeteksi anomali harga, dan menerima rekomendasi yang dapat ditindaklanjuti untuk proposal pengadaan. Proyek ini terdiri dari dua komponen utama:

1. Aplikasi web yang dibangun dengan Next.js
2. Model pembelajaran mesin yang dikembangkan di Jupyter Notebook menggunakan Google Vertex AI Gemini

## Proyek Stuktur

```
trace.ai/
├── README.md
├── Trace.AI App/           # Aplikasi Web Next.js
│   ├── README.md
│   ├── app/
│   ├── components/
│   └── ...
└── Trace.AI Model/         # Model Pembelajaran Mesin
    └── Trace AI Model Development.ipynb
```

## Fitur

- **Penguraian Dokumen**: Secara otomatis mengekstrak informasi penting dari dokumen pengadaan
- **Analisis Harga**: Membandingkan harga dengan data historis untuk mengidentifikasi anomali
- **Rekomendasi AI**: Menghasilkan wawasan yang dapat ditindaklanjuti untuk keputusan pengadaan
- **Antarmuka Interaktif**: Antarmuka web yang ramah pengguna untuk unggah dan analisis dokumen

## Komponen

### Aplikasi Web (Next.js)
- Antarmuka modern dan responsif yang dibangun dengan Next.js
- Hasil analisis real-time
- Pengunggahan dan pengelolaan dokumen
- Visualisasi interaktif perbandingan harga
- Laporan rekomendasi terperinci

### Model Pembelajaran Mesin (Jupyter Notebook)
- Dibangun menggunakan Google Vertex AI Gemini
- Ekstraksi dan pemrosesan teks dokumen
- Algoritma deteksi anomali harga
- Pemrosesan bahasa alami untuk generasi rekomendasi
- Analisis dan perbandingan data historis

## Memulai

1. Klon repositori
```bash
git clone https://github.com/yourusername/trace.ai.git
cd trace.ai
```

2. Siapkan aplikasi web
```bash
cd Trace.AI\ App
npm install
npm run dev
```

3. Siapkan lingkungan Jupyter
- Instal paket Python yang diperlukan
- Konfigurasi kredensial Google Cloud
- Buka dan jalankan notebook Jupyter

## Persyaratan

- Node.js 16+
- Python 3.9+
- Akun Google Cloud dengan akses Vertex AI
- Paket Python yang diperlukan:
  - google-cloud-aiplatform
  - PyPDF2
  - pandas
  - numpy
  - vertexai

## Penggunaan

### Aplikasi Web
1. Buka aplikasi di `http://localhost:3000`
2. Unggah dokumen pengadaan yang ingin dianalisis
3. Sistem akan secara otomatis mengekstrak informasi penting
4. Lihat hasil analisis dan rekomendasi dalam dashboard

### Model AI
1. Buka Jupyter Notebook di `Trace.AI Model/Trace AI Model.ipynb`
2. Ikuti langkah-langkah dalam notebook untuk:
   - Membaca dan mengekstrak teks dari dokumen
   - Menghasilkan ringkasan dokumen
   - Menghasilkan daftar item
   - Membandingkan harga dengan data historis
   - Menghasilkan rekomendasi


Proyek ini dikembangkan untuk kebutuhan Gov AI Hackathon Kemenkeu 2024 
