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
      // XOR加密
      const encrypted = this.xorEncrypt(jsonStr, this.SECRET_KEY);
      // Base64编码 - 直接使用btoa，确保数据是Latin1字符
      return btoa(encrypted);
    } catch (error) {
      console.error("加密失败:", error);
      throw error;
    }
  }

  static decrypt(encryptedData: string): any {
    try {
      // Base64解码 - 直接使用atob
      const decoded = atob(encryptedData);
      // XOR解密
      const decrypted = this.xorDecrypt(decoded, this.SECRET_KEY);
      // JSON解析
      return JSON.parse(decrypted);
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
