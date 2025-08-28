import React, { useState, useEffect } from "react";
import { X, Key, Check, AlertCircle, Settings } from "lucide-react";
import { apiService } from "../services/api";
import { ApiModel } from "../types/api";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: "zh" | "en";
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    provider?: string;
    message?: string;
  } | null>(null);
  const [models, setModels] = useState<ApiModel[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedProvider, setSelectedProvider] = useState<string>("aihubmix");

  useEffect(() => {
    if (isOpen) {
      loadModels();
      // Load saved API key from localStorage
      const savedApiKey = localStorage.getItem("mtg_ai_api_key");
      if (savedApiKey) {
        setApiKey(savedApiKey);
      }
      // Load saved model from localStorage
      const savedModel = localStorage.getItem("mtg_ai_selected_model");
      if (savedModel) {
        setSelectedModel(savedModel);
      }
      // Load saved provider from localStorage
      const savedProvider = localStorage.getItem("mtg_ai_selected_provider");
      if (savedProvider) {
        setSelectedProvider(savedProvider);
      }
    }
  }, [isOpen]);

  const loadModels = async () => {
    setModelsLoading(true);
    try {
      const modelsData = await apiService.getModels(selectedProvider);
      setModels(modelsData);
      // If no model is selected, select gpt-4o-mini by default
      if (!selectedModel && modelsData.length > 0) {
        const defaultModel = modelsData.find(
          (model) => model.id === "gpt-4o-mini"
        );
        if (defaultModel) {
          setSelectedModel(defaultModel.id);
        } else {
          // Fallback to first model if gpt-4o-mini not found
          setSelectedModel(modelsData[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load models:", error);
    } finally {
      setModelsLoading(false);
    }
  };

  const handleValidateApiKey = async () => {
    if (!apiKey?.trim()) return;

    setIsValidating(true);
    setValidationResult(null);

    try {
      const result = await apiService.validateApiKey(apiKey);
      setValidationResult(result);

      if (result.valid) {
        localStorage.setItem("mtg_ai_api_key", apiKey);
      }
    } catch (error) {
      setValidationResult({
        valid: false,
        message:
          language === "zh"
            ? "验证失败，请检查网络连接"
            : "Validation failed, please check your connection",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem("mtg_ai_selected_model", modelId);
  };

  const handleProviderChange = (provider: string) => {
    setSelectedProvider(provider);
    localStorage.setItem("mtg_ai_selected_provider", provider);
    // 当提供商改变时，重新加载模型列表
    loadModels();
  };

  const handleSave = () => {
    if (apiKey?.trim()) {
      localStorage.setItem("mtg_ai_api_key", apiKey);
    }
    if (selectedModel) {
      localStorage.setItem("mtg_ai_selected_model", selectedModel);
    }
    onClose();
  };

  const handleClear = () => {
    setApiKey("");
    setValidationResult(null);
    localStorage.removeItem("mtg_ai_api_key");
    localStorage.removeItem("mtg_ai_selected_model");
    localStorage.removeItem("mtg_ai_selected_provider");
    setSelectedModel("");
    setSelectedProvider("aihubmix");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-800 border border-dark-600 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-600">
          <h2 className="text-xl font-bold text-white">
            {language === "zh" ? "设置" : "Settings"}
          </h2>
          <button
            onClick={onClose}
            className="text-dark-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* API Key Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Key className="h-5 w-5" />
              {language === "zh" ? "API 密钥" : "API Key"}
            </h3>

            <div className="space-y-3">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={
                  language === "zh"
                    ? "输入您的 AI API 密钥"
                    : "Enter your AI API key"
                }
                className="input-field"
              />

              <div className="flex gap-2">
                <button
                  onClick={handleValidateApiKey}
                  disabled={!apiKey?.trim() || isValidating}
                  className="btn-secondary flex items-center gap-2"
                >
                  {isValidating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  {language === "zh" ? "验证" : "Validate"}
                </button>

                <button onClick={handleClear} className="btn-secondary">
                  {language === "zh" ? "清除" : "Clear"}
                </button>
              </div>

              {/* Validation Result */}
              {validationResult && (
                <div
                  className={`p-3 rounded-lg flex items-center gap-2 ${
                    validationResult.valid
                      ? "bg-green-900/20 border border-green-600 text-green-400"
                      : "bg-red-900/20 border border-red-600 text-red-400"
                  }`}
                >
                  {validationResult.valid ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <span className="text-sm">
                    {validationResult.message ||
                      (validationResult.valid
                        ? `${
                            language === "zh"
                              ? "验证成功"
                              : "Validation successful"
                          }${
                            validationResult.provider
                              ? ` (${validationResult.provider})`
                              : ""
                          }`
                        : `${
                            language === "zh" ? "验证失败" : "Validation failed"
                          }`)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Provider Selection */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {language === "zh" ? "API 提供商" : "API Provider"}
            </h3>

            <div className="space-y-3">
              <select
                value={selectedProvider}
                onChange={(e) => handleProviderChange(e.target.value)}
                className="input-field"
              >
                <option value="aihubmix">AIHubMix (推荐)</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="google">Google</option>
              </select>

              <div className="p-3 bg-dark-700 border border-dark-600 rounded-lg">
                <p className="text-sm text-white font-medium">
                  {language === "zh" ? "提供商说明" : "Provider Info"}:
                </p>
                <p className="text-sm text-dark-300">
                  {selectedProvider === "aihubmix" &&
                    (language === "zh"
                      ? "AIHubMix 提供多种AI模型，包括OpenAI、Anthropic、Google等"
                      : "AIHubMix provides multiple AI models including OpenAI, Anthropic, Google, etc.")}
                  {selectedProvider === "openai" &&
                    (language === "zh"
                      ? "OpenAI 官方API，需要OpenAI API密钥"
                      : "OpenAI official API, requires OpenAI API key")}
                  {selectedProvider === "anthropic" &&
                    (language === "zh"
                      ? "Anthropic Claude API，需要Anthropic API密钥"
                      : "Anthropic Claude API, requires Anthropic API key")}
                  {selectedProvider === "google" &&
                    (language === "zh"
                      ? "Google Gemini API，需要Google API密钥"
                      : "Google Gemini API, requires Google API key")}
                </p>
              </div>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {language === "zh" ? "AI 模型选择" : "AI Model Selection"}
            </h3>

            <div className="space-y-3">
              <select
                value={selectedModel}
                onChange={(e) => handleModelChange(e.target.value)}
                className="input-field"
                disabled={modelsLoading}
              >
                {modelsLoading ? (
                  <option value="">
                    {language === "zh" ? "加载中..." : "Loading..."}
                  </option>
                ) : models.length > 0 ? (
                  <>
                    <option value="">
                      {language === "zh" ? "选择模型" : "Select a model"}
                    </option>
                    {models.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} ({model.provider})
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="">
                    {language === "zh" ? "暂无可用模型" : "No models available"}
                  </option>
                )}
              </select>

              {selectedModel && (
                <div className="p-3 bg-dark-700 border border-dark-600 rounded-lg">
                  <p className="text-sm text-white font-medium">
                    {language === "zh" ? "当前选择" : "Currently selected"}:
                  </p>
                  <p className="text-sm text-dark-300">
                    {models.find((m) => m.id === selectedModel)?.name ||
                      selectedModel}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Available Models */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              {language === "zh" ? "可用模型" : "Available Models"}
            </h3>
            {modelsLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                <span className="ml-2 text-dark-300">
                  {language === "zh" ? "加载中..." : "Loading..."}
                </span>
              </div>
            ) : models.length > 0 ? (
              <div className="space-y-2">
                {models.map((model, index) => (
                  <div
                    key={index}
                    className={`bg-dark-700 border rounded-lg p-3 ${
                      model.id === selectedModel
                        ? "border-primary-500 bg-primary-500/10"
                        : "border-dark-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white">
                        {model.name}
                      </span>
                      <span className="text-xs text-dark-400 bg-dark-600 px-2 py-1 rounded">
                        {model.provider}
                      </span>
                    </div>
                    <p className="text-sm text-dark-300">ID: {model.id}</p>
                    {model.id === selectedModel && (
                      <p className="text-xs text-primary-400 mt-1">
                        {language === "zh" ? "✓ 已选择" : "✓ Selected"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-dark-300">
                {language === "zh" ? "暂无可用模型" : "No models available"}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="bg-dark-700 border border-dark-600 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">
              {language === "zh" ? "关于设置" : "About Settings"}
            </h4>
            <p className="text-sm text-dark-300 leading-relaxed">
              {language === "zh"
                ? "您可以配置API密钥和选择AI模型。不同的模型可能有不同的性能和响应速度。设置会保存在您的浏览器本地。"
                : "You can configure your API key and select an AI model. Different models may have varying performance and response speeds. Settings are saved locally in your browser."}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-dark-600">
          <button onClick={onClose} className="btn-secondary">
            {language === "zh" ? "取消" : "Cancel"}
          </button>
          <button onClick={handleSave} className="btn-primary">
            {language === "zh" ? "保存" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
