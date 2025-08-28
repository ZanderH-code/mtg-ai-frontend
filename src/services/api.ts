import axios from "axios";
import {
  SearchRequest,
  SearchResponse,
  ApiExample,
  ApiModel,
  ApiModelsResponse,
  ApiValidationResponse,
} from "../types/api";
import { SimpleEncryption } from "../utils/simpleEncryption";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://mtg-ai-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "X-Client-Version": "1.0.0",
  },
});

// 启用简化的加密拦截器
// 请求拦截器 - 加密请求数据
api.interceptors.request.use(
  (config) => {
    try {
      if (config.data) {
        console.log("🔐 开始加密请求数据...");
        console.log("🔐 原始请求数据:", config.data);
        const encryptedPayload = SimpleEncryption.createEncryptedPayload(
          config.data
        );
        config.data = encryptedPayload;
        console.log("✅ 请求数据加密完成");
        console.log("✅ 加密后的数据:", config.data);
      }
    } catch (error) {
      console.error("❌ 请求加密失败:", error);
      console.error("❌ 原始请求数据:", config.data);
    }
    return config;
  },
  (error) => {
    console.error("❌ 请求拦截器错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器 - 解密响应数据
api.interceptors.response.use(
  (response) => {
    try {
      if (response.data && SimpleEncryption.isEncrypted(response.data)) {
        console.log("🔓 开始解密响应数据...");
        console.log("🔓 加密响应数据:", response.data);
        response.data = SimpleEncryption.decrypt(response.data.encrypted_data);
        console.log("✅ 响应数据解密完成");
        console.log("✅ 解密后的数据:", response.data);
      }
    } catch (error) {
      console.error("❌ 响应解密失败:", error);
      console.error("❌ 原始响应数据:", response.data);
    }
    return response;
  },
  (error) => {
    console.error("❌ API请求失败:", error);
    console.error("❌ 错误响应:", error.response?.data);
    return Promise.reject(error);
  }
);

// 获取存储的API密钥
const getStoredApiKey = (): string | null => {
  return localStorage.getItem("mtg_ai_api_key");
};

// 获取存储的模型ID
const getStoredModel = (): string | null => {
  return localStorage.getItem("mtg_ai_selected_model");
};

export const apiService = {
  // Search for cards
  async searchCards(request: SearchRequest): Promise<SearchResponse> {
    // 自动添加API密钥、模型和提供商
    const apiKey = getStoredApiKey();
    const model = getStoredModel();
    const provider = this.getSelectedProvider();
    const requestWithKey = {
      ...request,
      api_key: apiKey || undefined,
      model: model || undefined,
      provider: provider,
    };

    const response = await api.post<SearchResponse>(
      "/api/search",
      requestWithKey
    );
    return response.data;
  },

  // Get search examples
  async getExamples(): Promise<ApiExample> {
    const response = await api.get<ApiExample>("/api/examples");
    return response.data;
  },

  // Get available models
  async getModels(provider?: string): Promise<ApiModel[]> {
    try {
      const params = provider ? { provider } : {};
      const response = await api.get<ApiModelsResponse>("/api/models", {
        params,
      });
      return response.data.models || [];
    } catch (error) {
      console.error("Failed to get models:", error);
      return [];
    }
  },

  // Validate API key
  async validateApiKey(apiKey: string): Promise<ApiValidationResponse> {
    const response = await api.post<ApiValidationResponse>(
      "/api/validate-key",
      {
        api_key: apiKey,
      }
    );
    return response.data;
  },

  // 检查API密钥是否存在
  hasApiKey(): boolean {
    return !!getStoredApiKey();
  },

  // 获取API密钥
  getApiKey(): string | null {
    return getStoredApiKey();
  },

  // 获取当前选择的模型
  getSelectedModel(): string | null {
    return getStoredModel();
  },

  // 获取当前选择的提供商
  getSelectedProvider(): string {
    return localStorage.getItem("mtg_ai_selected_provider") || "aihubmix";
  },

  // 获取当前API地址
  getApiUrl(): string {
    return API_BASE_URL;
  },
};

export default apiService;
