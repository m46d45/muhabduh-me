#!/usr/bin/env node
import { randomBytes, scryptSync } from "node:crypto";
import { readFileSync } from "node:fs";

if (process.argv.length > 2) {
  console.error(
    "Jangan tulis kata sandi sebagai argumen (ikut riwayat shell). Jalankan tanpa argumen, lalu masukkan lewat stdin.",
  );
  process.exit(1);
}

const password = readFileSync(0, "utf8").replace(/\r?\n$/, "");
if (!password) {
  console.error("Kata sandi kosong.");
  process.exit(1);
}
if (password.length > 200) {
  console.error("Kata sandi maksimal 200 karakter.");
  process.exit(1);
}

const N = 16384;
const r = 8;
const p = 1;
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 32, { N, r, p });
process.stdout.write(
  `scrypt$${N}$${r}$${p}$${salt.toString("base64url")}$${hash.toString("base64url")}\n`,
);
