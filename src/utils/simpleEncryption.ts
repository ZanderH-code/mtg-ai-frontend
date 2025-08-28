// 简化的API密钥保护工具
export class SimpleEncryption {
  // 简单的混淆密钥
  private static readonly MASK_KEY = "mtg2024";

  private static simpleMask(data: string, key: string): string {
    let masked = "";
    const keyLength = key.length;
    for (let i = 0; i < data.length; i++) {
      const keyChar = key[i % keyLength];
      masked += String.fromCharCode(data.charCodeAt(i) ^ keyChar.charCodeAt(0));
    }
    return masked;
  }

  static encrypt(data: any): string {
    try {
      // 转换为JSON字符串
      const jsonStr = JSON.stringify(data, null, 0);
      // 简单混淆
      const masked = this.simpleMask(jsonStr, this.MASK_KEY);
      // Base64编码
      return btoa(masked);
    } catch (error) {
      console.error("加密失败:", error);
      throw error;
    }
  }

  static decrypt(encryptedData: string): any {
    try {
      // Base64解码
      const decoded = atob(encryptedData);
      // 简单解混淆
      const unmasked = this.simpleMask(decoded, this.MASK_KEY);
      // JSON解析
      return JSON.parse(unmasked);
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
