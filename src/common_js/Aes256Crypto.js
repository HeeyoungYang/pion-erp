const CryptoJS = require('crypto-js');

class Aes256Crypto {
  constructor() {
  }

  generateKey(key) {
    const hashedKey = CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex).slice(0, 64);
    return hashedKey;
  }

  encrypt(text, hashedKey) {
      // 키를 해시화하여 적절한 길이로 만듭니다.
      //const hashedKey = CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex).slice(0, 64);
      // hashcode는 반드시 64자리 hex string
      console.log('encrypt hashedKey:', hashedKey);
      // AES 256 암호화를 위해 키를 사용합니다.
      const iv = CryptoJS.lib.WordArray.random(16);
      const cipher = CryptoJS.AES.encrypt(text, CryptoJS.enc.Hex.parse(hashedKey), {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });

      // IV를 암호화된 데이터 앞에 추가하여 Base64로 인코딩합니다.
      const encryptedText = CryptoJS.enc.Base64.stringify(iv.concat(cipher.ciphertext));

      return encryptedText;
  }

  decrypt(encryptedText, hashedKey) {
      // 키를 해시화하여 적절한 길이로 만듭니다.
      //const hashedKey = CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex).slice(0, 64);
      // hashcode는 반드시 64자리 hex string
      console.log('decrypt hashedKey:', hashedKey);
      // Base64 디코딩합니다.
      const encryptedBytes = CryptoJS.enc.Base64.parse(encryptedText);

      // IV와 암호화된 데이터를 분리합니다.
      const iv = CryptoJS.lib.WordArray.create(encryptedBytes.words.slice(0, 4));
      const ciphertext = CryptoJS.lib.WordArray.create(encryptedBytes.words.slice(4));

      // AES 256 복호화를 위해 키와 IV를 사용합니다.
      const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, CryptoJS.enc.Hex.parse(hashedKey), {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });

      // 복호화된 데이터를 UTF-8 문자열로 변환합니다.
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

      return decryptedText;
  }
}

module.exports = Aes256Crypto;
