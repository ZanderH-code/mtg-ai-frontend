// 简化的对称加密工具
export class SimpleEncryption {
  // 简单的密钥 - 与后端保持一致
  private static readonly SECRET_KEY = "mtg-ai-secret-key-2024";

  private static xorEncrypt(data: string, key: string): string {
    let encrypted = "";
    const keyLength = key.length;
    for (let i = 0; i < data.length; i++) {
      const keyChar = key[i % keyLength];
      encrypted += String.fromCharCode(
        data.charCodeAt(i) ^ keyChar.charCodeAt(0)
      );
    }
    return encrypted;
  }

  private static xorDecrypt(encryptedData: string, key: string): string {
    return this.xorEncrypt(encryptedData, key);
  }

  static encrypt(data: any): string {
    try {
      // 转换为JSON字符串 - 与后端保持一致
      const jsonStr = JSON.stringify(data, null, 0);
      // 将字符串转换为UTF-8字节数组
      const encoder = new TextEncoder();
      const jsonBytes = encoder.encode(jsonStr);
      // 对字节进行XOR加密
      const keyBytes = new TextEncoder().encode(this.SECRET_KEY);
      const encryptedBytes = new Uint8Array(jsonBytes.length);
      for (let i = 0; i < jsonBytes.length; i++) {
        const keyByte = keyBytes[i % keyBytes.length];
        encryptedBytes[i] = jsonBytes[i] ^ keyByte;
      }
      // Base64编码
      return btoa(String.fromCharCode.apply(null, Array.from(encryptedBytes)));
    } catch (error) {
      console.error("加密失败:", error);
      throw error;
    }
  }

  static decrypt(encryptedData: string): any {
    try {
      // Base64解码
      const decoded = atob(encryptedData);
      // 将字符串转换为字节数组
      const bytes = new Uint8Array(decoded.length);
      for (let i = 0; i < decoded.length; i++) {
        bytes[i] = decoded.charCodeAt(i);
      }
      // 对字节进行XOR解密
      const keyBytes = new TextEncoder().encode(this.SECRET_KEY);
      const decryptedBytes = new Uint8Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) {
        const keyByte = keyBytes[i % keyBytes.length];
        decryptedBytes[i] = bytes[i] ^ keyByte;
      }
      // 将字节转换回UTF-8字符串
      const decoder = new TextDecoder();
      const decryptedStr = decoder.decode(decryptedBytes);
      // JSON解析
      return JSON.parse(decryptedStr);
    } catch (error) {
      console.error("解密失败:", error);
      throw error;
    }
  }

  static isEncrypted(data: any): boolean {
    return data && typeof data === "object" && "encrypted_data" in data;
  }

  static createEncryptedPayload(data: any): any {
    const encryptedData = this.encrypt(data);
    return {
      encrypted_data: encryptedData,
      timestamp: Date.now(),
      version: "1.0",
    };
  }
}
