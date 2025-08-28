import axios from "axios";
import {
  SearchRequest,
  SearchResponse,
  ApiExample,
  ApiModel,
  ApiModelsResponse,
  ApiValidationResponse,
} from "../types/api";

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

    // 记录掩码后的请求数据用于调试
    const maskedRequest = {
      ...requestWithKey,
      api_key: apiKey ? "***" : undefined,
    };
    console.log("Sending request to backend:", maskedRequest);

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
    console.log("Validating API key:", "***");
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

  // 获取API密钥（掩码版本）
  getApiKey(): string | null {
    const key = getStoredApiKey();
    if (!key) return null;
    if (key.length <= 8) return "*".repeat(key.length);
    return (
      key.substring(0, 4) +
      "*".repeat(key.length - 8) +
      key.substring(key.length - 4)
    );
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
