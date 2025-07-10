const pengawasList = [
  '6283131871328', // ← ganti dengan nomor WhatsApp pengawas
  '6283168118001', // ← tambahkan nomor lain jika ada
];

const isPengawas = (sender) => {
  // sender harus dalam format nomor (tanpa @s.whatsapp.net)
  const cleanSender = sender.replace(/[^0-9]/g, '');
  return pengawasList.includes(cleanSender);
};

module.exports = isPengawas;
