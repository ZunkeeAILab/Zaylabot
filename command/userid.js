const fs = require('fs');
const path = require('path');

const userPath = path.join(__dirname, '../data/user.json');

if (!fs.existsSync(userPath)) fs.writeFileSync(userPath, JSON.stringify([]));

const jenisUser = {
  biasa: 'ZFR',
  premium: 'ZUP',
  admin: 'ZMN',
  owner: 'ZWN',
  penyewa: 'ZSW',
  pengawas: 'ZAP',
  sementara: 'ZMP'
};

// Fungsi buat ID unik berdasarkan tipe user
function generateID(type = 'biasa') {
  const randNum = (length) => Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
  const randMix = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };
  const randSpec = (length) => {
    const chars = '!@#$%^&*~';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  switch (type) {
    case 'biasa':
      return jenisUser.biasa + randNum(18) + randMix(9);
    case 'premium':
      return jenisUser.premium + randNum(7) + randMix(5);
    case 'admin':
      return jenisUser.admin + randNum(10) + randMix(7);
    case 'owner':
      return jenisUser.owner + randNum(6) + randMix(7);
    case 'penyewa':
      return jenisUser.penyewa + randNum(6) + randMix(7);
    case 'pengawas':
      return jenisUser.pengawas + randNum(3) + randSpec(3);
    case 'sementara':
      return jenisUser.sementara + randNum(4) + randMix(4);
    default:
      return jenisUser.biasa + randNum(18) + randMix(9);
  }
}

// Cek dan dapatkan ID user dari database
function getUser(id) {
  const users = JSON.parse(fs.readFileSync(userPath));
  return users.find(u => u.id === id);
}

// Tambahkan user baru
function addUser(nama, umur, asal, jenis = 'biasa') {
  const users = JSON.parse(fs.readFileSync(userPath));
  const id = generateID(jenis);

  const user = {
    id,
    nama,
    umur,
    asal,
    jenis,
    verifiedAt: new Date().toISOString()
  };

  users.push(user);
  fs.writeFileSync(userPath, JSON.stringify(users, null, 2));

  return user;
}

// Upgrade user dari biasa ke premium
function upgradeToPremium(oldId) {
  const users = JSON.parse(fs.readFileSync(userPath));
  const index = users.findIndex(u => u.id === oldId);
  if (index === -1) return { error: 'User tidak ditemukan' };

  const premiumId = generateID('premium');
  users.splice(index, 1); // hapus id lama
  users.push({
    id: premiumId,
    nama: 'User Premium',
    upgradeFrom: oldId,
    jenis: 'premium',
    premiumAt: new Date().toISOString()
  });

  fs.writeFileSync(userPath, JSON.stringify(users, null, 2));
  return { success: true, id: premiumId };
}

// Konversi ID sementara ke penyewa tetap
function confirmSewaFromTemporary(tempId, nama, asal) {
  const users = JSON.parse(fs.readFileSync(userPath));
  const index = users.findIndex(u => u.id === tempId);
  if (index !== -1) users.splice(index, 1); // hapus id sementara

  const newId = generateID('penyewa');
  const user = {
    id: newId,
    nama,
    asal,
    jenis: 'penyewa',
    sewaAktif: true,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  fs.writeFileSync(userPath, JSON.stringify(users, null, 2));

  return user;
}

module.exports = {
  genID,
  getUser,
  addUser,
  upzrium,
  csftnow
};
