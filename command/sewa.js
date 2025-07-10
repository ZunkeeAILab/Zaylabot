const fs = require('fs');
const path = require('path');
const sewaFile = path.join(__dirname, '../data/sewa.json');

function loadSewaData() {
  if (!fs.existsSync(sewaFile)) fs.writeFileSync(sewaFile, JSON.stringify([]));
  return JSON.parse(fs.readFileSync(sewaFile));
}

function saveSewaData(data) {
  fs.writeFileSync(sewaFile, JSON.stringify(data, null, 2));
}

function isGroupRented(groupId) {
  const data = loadSewaData();
  return data.some(entry => entry.groupId === groupId && new Date(entry.expiredAt) > new Date());
}

function addSewa(groupId, userId, durationInDays) {
  const data = loadSewaData();
  const existing = data.find(entry => entry.groupId === groupId);
  const now = new Date();
  const expiredAt = new Date(now.getTime() + durationInDays * 24 * 60 * 60 * 1000);

  if (existing) {
    existing.expiredAt = expiredAt;
  } else {
    data.push({ groupId, userId, expiredAt });
  }

  saveSewaData(data);
}

function removeSewa(groupId) {
  let data = loadSewaData();
  data = data.filter(entry => entry.groupId !== groupId);
  saveSewaData(data);
}

function getSewaInfo(groupId) {
  const data = loadSewaData();
  return data.find(entry => entry.groupId === groupId);
}

module.exports = {
  isGroupRented,
  addSewa,
  removeSewa,
  getSewaInfo,
};
