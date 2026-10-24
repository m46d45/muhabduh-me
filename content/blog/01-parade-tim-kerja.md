---
title: "Kenapa proyek tetap terlambat, padahal kemampuan rata-rata timnya sama?"
description: "Simulasi kelas Parade Tim Kerja menunjukkan durasi proyek bisa memanjang walau kemampuan rata-rata setiap tim sama."
date: "2026-10-21"
draft: true
topics:
  - lean
  - pendidikan
papers:
  - 2026-parade-tim-kerja-simulasi-dampak-variabilitas
tools:
  - parade-tim-kerja
---

Kalau *finishing* di lantai atas terlambat, biasanya yang pertama ditanya adalah tim *finishing*-nya. Kalau bukan mereka, ya manajer proyek atau jadwalnya. Saya pernah menanyakan hal ini ke 78 peserta kuliah daring di ICE Center ITB, 19 September 2026, sebelum mereka mencoba simulasi. Jawaban terbanyak, 38 orang, memang menunjuk manajer proyek atau penjadwalan.

Pertanyaannya, benarkah begitu? Belum tentu. Sering kali penyebabnya justru ada di tim-tim sebelumnya dan di cara pekerjaan diserahkan dari satu tim ke tim berikutnya.

## Situasinya

Bayangkan pekerjaan lantai yang berulang, dengan lima tim yang bekerja berurutan: bekisting, tulangan, pengecoran, bongkar bekisting, lalu *finishing*. Tim berikutnya baru bisa mulai kalau tim sebelumnya sudah menyerahkan zona kerjanya. Setiap tim rata-rata sanggup menyelesaikan satu zona per periode. Kemampuan rata-ratanya sama dan tidak ada yang malas.

Situasi ini saya buat menjadi simulasi kelas berbahasa Indonesia, Parade Tim Kerja, yang bisa dibuka langsung di *browser*. Idenya berasal dari permainan *Parade of Trades* (Tommelein, Riley, dan Howell, 1999). Saya menambahkan satu hal yang sering kita temui di lapangan, yaitu berapa zona yang ditahan dulu sebelum diserahkan ke tim berikutnya.

## Apa yang terjadi

Ada dua hal yang terlihat jelas.

**Pertama, naik-turunnya kemampuan tim memperpanjang proyek walaupun rata-ratanya tetap.** Untuk sepuluh zona, dengan zona diserahkan per empat, proyek selesai dalam 26 periode kalau setiap tim selalu stabil. Kalau kemampuan harian tiap tim dibuat naik-turun, durasinya menjadi 31, 34, 53, lalu 84 periode pada kondisi paling tidak stabil. Rata-ratanya tidak pernah diubah.

Yang menarik, tim pertama justru selesai makin cepat, dari periode 10 menjadi periode 6, sedangkan tim terakhir makin lambat, sampai periode 84. Bekisting yang selesai lebih awal tidak membuat *finishing* ikut lebih cepat, karena hasil satu tim menjadi syarat mulai tim berikutnya. Hari baik satu tim tidak bisa menutup hari buruk tim lain. Kalau tim di depan sedang lambat, tim di belakang ikut menunggu.

Saya juga mencoba membuat hanya satu tim yang tidak stabil, entah tim pertama atau tim terakhir. Hasilnya 25 dan 24 periode, hampir sama dengan kondisi stabil. Yang membuat durasi melonjak ke 84 adalah ketidakstabilan di sepanjang urutan, bukan satu tim saja.

**Kedua, ukuran zona yang diserahkan juga memperpanjang proyek, bahkan tanpa ada yang menganggur.** Dalam kondisi stabil, menyerahkan zona satu per satu membuat proyek selesai dalam 14 periode. Kalau zona ditahan sampai genap empat baru diserahkan, proyek selesai dalam 26 periode. Selisihnya dua belas periode, dan di kedua kasus tidak ada tim yang tercatat menganggur. Semua orang tampak sibuk, tetapi proyeknya tetap lebih lama.

## Apa kata peserta setelah mencoba

Setelah mencoba simulasi, 58 dari 63 jawaban menunjuk aliran kerja, ukuran zona yang diserahkan, atau ketidakstabilan di tim sebelumnya sebagai penyebab *finishing* terlambat. Hanya tiga yang masih menyalahkan tim *finishing*.

Satu catatan supaya jujur: ini simulasi kelas dan satu sesi kuliah, bukan data proyek lapangan, dan bukan uji ilmiah yang ketat. Kedua formulir juga anonim, sehingga jawaban sebelum dan sesudahnya tidak bisa dipasangkan per orang. Simulasi ini gunanya untuk memahami polanya, bukan untuk menghitung produktivitas proyek Anda.

## Satu langkah kecil

Kalau minggu ini ada pekerjaan yang terlambat di proyek Anda, jangan langsung bertanya "tim mana yang lambat?". Coba tanyakan dua hal ini:

1. Seberapa stabil hasil harian tim-tim **sebelumnya**, bukan hanya rata-ratanya?
2. Berapa zona yang biasanya ditahan sebelum diserahkan ke tim berikutnya, dan apakah bisa diserahkan lebih kecil?

Simulasinya bisa dicoba sendiri di [Parade Tim Kerja](https://parade-tim-kerja.vercel.app) tanpa instalasi.

## Mari berdiskusi

- Di proyek Anda, pekerjaan apa yang paling sering naik-turun hasil hariannya?
- Pernahkah zona ditahan dulu "supaya sekalian"? Apa alasannya waktu itu?
- Kalau tim terakhir terlambat, siapa yang biasanya disalahkan di proyek Anda?


**Bacaan pendukung**
- Tommelein, I. D., Riley, D. R., & Howell, G. A. (1999). Parade Game: Impact of Work Flow Variability on Trade Performance. *Journal of Construction Engineering and Management*, 125(5), 304–310.
