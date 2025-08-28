// 简单的对称加密工具
export class SimpleEncryption {
  private static readonly KEY = 'mtg-ai-2024-secret-key-12345'; // 16字节密钥
  private static readonly IV = 'mtg-ai-iv-2024'; // 16字节初始向量

  // 简单的字符串转字节数组
  private static stringToBytes(str: string): Uint8Array {
    return new TextEncoder().encode(str);
  }

  // 字节数组转字符串
  private static bytesToString(bytes: Uint8Array): string {
    return new TextDecoder().decode(bytes);
  }

  // 简单的XOR加密
  private static xorEncrypt(data: string, key: string): string {
    const dataBytes = this.stringToBytes(data);
    const keyBytes = this.stringToBytes(key);
    const result = new Uint8Array(dataBytes.length);
    
    for (let i = 0; i < dataBytes.length; i++) {
      result[i] = dataBytes[i] ^ keyBytes[i % keyBytes.length];
    }
    
    return btoa(String.fromCharCode(...result));
  }

  // 简单的XOR解密
  private static xorDecrypt(encryptedData: string, key: string): string {
    const encryptedBytes = new Uint8Array(
      atob(encryptedData).split('').map(char => char.charCodeAt(0))
    );
    const keyBytes = this.stringToBytes(key);
    const result = new Uint8Array(encryptedBytes.length);
    
    for (let i = 0; i < encryptedBytes.length; i++) {
      result[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
    }
    
    return this.bytesToString(result);
  }

  // 加密数据
  static encrypt(data: any): string {
    const jsonString = JSON.stringify(data);
    return this.xorEncrypt(jsonString, this.KEY);
  }

  // 解密数据
  static decrypt(encryptedData: string): any {
    const decryptedString = this.xorDecrypt(encryptedData, this.KEY);
    return JSON.parse(decryptedString);
  }

  // 生成请求签名
  static generateSignature(data: any, timestamp: number): string {
    const dataString = JSON.stringify(data) + timestamp.toString();
    return this.xorEncrypt(dataString, this.KEY).substring(0, 16);
  }

  // 验证请求签名
  static verifySignature(data: any, timestamp: number, signature: string): boolean {
    const expectedSignature = this.generateSignature(data, timestamp).substring(0, 16);
    return signature === expectedSignature;
  }
}
