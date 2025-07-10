const fs = require('fs');
const path = require('path');
const redeemPath = path.join(__dirname, '../data/redeem.json');
const isPengawas = require('../utils/isPengawas');

function randomChars(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function randomNumbers(length) {
  const nums = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += nums.charAt(Math.floor(Math.random() * nums.length));
  }
  return result;
}

function generateCode() {
  const part1 = randomChars(3);
  const part2 = randomNumbers(4);
  const part3 = randomChars(2);
  return `ZAI-${part1}-${part2}-${part3}`;
}

function newRedeem(sender, idTarget) {
  if (!isPengawas(sender)) return { status: false, msg: '❌ Kamu bukan pengawas resmi!' };
  const db = JSON.parse(fs.readFileSync(redeemPath));
  const code = generateCode();
  const now = Date.now();

  db.push({
    code,
    idTarget,
    dibuatOleh: sender,
    dibuatTanggal: now,
    berlakuSampai: now + (3 * 24 * 60 * 60 * 1000) // 3 hari
  });

  fs.writeFileSync(redeemPath, JSON.stringify(db, null, 2));
  return { status: true, msg: `✅ Kode redeem berhasil dibuat:\n\n🔐 ${code}\n🎯 Untuk ID: ${idTarget}` };
}

module.exports = { newRedeem };
