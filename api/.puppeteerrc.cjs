// Cache Chrome Puppeteer DI DALAM folder aplikasi, bukan di profil Windows pengguna
// (%USERPROFILE%\.cache\puppeteer) — proses PM2 yang menjalankan server.js tidak bisa
// diandalkan mengakses folder profil itu (sama akarnya dengan masalah EPERM userDataDir
// sebelumnya), meski file Chrome-nya memang ada di sana. Folder ini milik & ditulis oleh
// npm install / server.js sendiri sehingga izinnya pasti cocok untuk proses yang sama.
const { join } = require('path');

module.exports = {
  cacheDirectory: join(__dirname, '.puppeteer-cache'),
};
