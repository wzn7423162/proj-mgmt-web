// import JSEncrypt from './js-crypto';
// import cryptoJS from 'crypto-js/aes';
import JSEncrypt from 'jsencrypt';

const publicKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxYqr73gED6JUZ84Eyx5u
3CAKVIAKZAA1PmtOmpgObjvrnNMfS2o+kE3N2n+om81EsBo4Y1F8s5YeIYVK/0Tk
R+oIbmWoZF7nQJ2XfsH914xy9xxsK0tyd0vCvFoDx+x8hS3EZhJbeZpqxmT/WnhM
+CzNvUTKOFbY7f7xPR8fJJSpzjK3GQTo3Y0bbOkOoVKGIzNbFVx6cFccbgeUg1G5
PYMjrixA/NrfK4cdGxdUTAHdyWD7T355/YrbsjaQNWjzYlkubFXvxe/WWu7KamGf
nDmov1x71TndiWH+qoJuSPef1XfT5yMp6bJA/e7eMkbtNiM32xE1t6IYKL7Q4Baz
7wIDAQAB`;

const privateKey = ``;

// 加密
export function encrypt(txt: string) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt) || ''; // 对数据进行加密
}

// 解密
export function decrypt(txt: string) {
  const encryptor = new JSEncrypt();
  encryptor.setPrivateKey(privateKey); // 设置私钥
  return encryptor.decrypt(txt); // 对数据进行解密
}
