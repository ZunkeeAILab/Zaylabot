const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const P = require('pino');
const fs = require('fs-extra');
const path = require('path');
const qrcode = require('qrcode-terminal');
const moment = require('moment-timezone');
const command = require('./command');

const authPath = './src/data/session.json';
const { state, saveState } = useSingleFileAuthState(authPath);

async function startBot() {
  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    browser: ['ZaylaBot', 'Safari', '1.0.0']
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;

    if (!body.startsWith('.')) return;
    const args = body.slice(1).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    try {
      if (command[cmd]) {
        await command[cmd](sock, msg, args, from, sender);
      } else {
        await sock.sendMessage(from, { text: `❌ Perintah \".${cmd}\" tidak dikenali.` });
      }
    } catch (e) {
      console.error(e);
      await sock.sendMessage(from, { text: 'Terjadi kesalahan saat menjalankan perintah.' });
    }
  });
}

startBot();
