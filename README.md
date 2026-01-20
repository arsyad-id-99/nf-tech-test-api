# Student Management API (NF Tech Test)
API manajemen data siswa yang dibangun menggunakan Node.js, Express JS, dan MongoDB. API ini dilengkapi dengan fitur autentikasi JWT, sistem pencarian/filter yang dinamis, serta integrasi Firebase Cloud Messaging (FCM) untuk pengiriman push notification secara otomatis.

## 🚀 Fitur Utama
* **Autentikasi User**: Register dan Login dengan enkripsi password (bcrypt) dan JWT.
* **Device Token Management**: Menyimpan token perangkat user saat login untuk pengiriman notifikasi.
* **Manajemen Data Siswa (CRUD):**
    * Tambah data siswa dengan validasi NISN unik.
    * List data siswa dengan Pagination, Search (berdasarkan Nama/NISN), dan Filter (berdasarkan Jurusan).
    * Detail data siswa berdasarkan NISN.
    * Endpoint daftar jurusan dinamis.
* **Push Notification**: Mengirim notifikasi otomatis ke perangkat user melalui Firebase Admin SDK sesaat setelah data siswa berhasil ditambahkan.

## 🛠️ Tech Stack
* **Backend**: Node.js & Express.js
* **Database**: MongoDB (Mongoose ODM)
* **Authentication**: JSON Web Token (JWT)
* **Notification**: Firebase Admin SDK (FCM)
* **Deployment Ready**: Support Vercel / Render

## ⚙️ Persiapan & Instalasi
1. **Clone Repositori** 
```
git clone https://github.com/arsyad-id-99/nf-tech-test-api.git
cd nf-tech-test-api
```
2. **Install Dependencies**
```
npm install
```
3. **Konfigurasi Environment Variable**
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FIREBASE_SERVICE_ACCOUNT={"type": "service_account", "project_id": "...", ...}
```
4. **Jalankan Aplikasi**
```
# Mode Development
npm run dev

# Mode Production
npm start
```

## 📡 Dokumentasi API
**Autentikasi**
| Method  | Endpoint |Deskripsi|
| ------------- |:-------------:|-----|
| `POST`      | `/api/auth/register`|Mendaftarkan user baru|
| `POST`      | `/api/auth/login`|Login user & update `device_token`|

**Data Siswa**
**Autentikasi**
| Method  | Endpoint |Deskripsi|
| ------------- |:-------------:|-----|
| `GET`      | `/api/siswa`|Get list (Support page, limit, search, jurusan)|
| `GET`      | `/api/siswa/jurusan`|Mengambil daftar pilihan jurusan|
| `GET`      | `/api/siswa/:nisn`|Get detail siswa berdasarkan NISN|
| `POST`      | `/api/siswa`|Tambah siswa baru & kirim notifikasi FCM|

## 📦 Deployment di Vercel
Karena menggunakan Firebase Admin SDK, pastikan kamu telah menambahkan variabel `FIREBASE_SERVICE_ACCOUNT` di dashboard Vercel (Settings > Environment Variables) dengan mem-paste seluruh isi JSON service account kamu.

#### Author
**Arsyad** - [@arsyad-id-99](https://github.com/arsyad-id-99).

