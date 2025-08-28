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
  },
});

// 获取存储的API密钥
const getStoredApiKey = (): string | null => {
  return localStorage.getItem("mtg_ai_api_key");
};

export const apiService = {
  // Search for cards
  async searchCards(request: SearchRequest): Promise<SearchResponse> {
    // 自动添加API密钥
    const apiKey = getStoredApiKey();
    const requestWithKey = {
      ...request,
      api_key: apiKey || undefined,
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
  async getModels(): Promise<ApiModel[]> {
    const response = await api.get<ApiModelsResponse>("/api/models");
    return response.data.models || [];
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

  // 获取当前API地址
  getApiUrl(): string {
    return API_BASE_URL;
  },
};

export default apiService;
