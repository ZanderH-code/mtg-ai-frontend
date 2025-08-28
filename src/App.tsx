import React, { useState, useEffect } from "react";
import { Settings, Info, Globe } from "lucide-react";
import SearchSection from "./components/SearchSection";
import ResultsSection from "./components/ResultsSection";
import SettingsModal from "./components/SettingsModal";
import WelcomeSection from "./components/WelcomeSection";
import { apiService } from "./services/api";
import { Card, ApiExample } from "./types/api";

function App() {
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [examples, setExamples] = useState<ApiExample>({ zh: [], en: [] });
  const [error, setError] = useState<string>("");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>("");

  useEffect(() => {
    loadExamples();
    checkApiKey();
    checkSelectedModel();
  }, []);

  const loadExamples = async () => {
    try {
      const examplesData = await apiService.getExamples();
      setExamples(examplesData);
    } catch (error) {
      console.error("Failed to load examples:", error);
    }
  };

  const checkApiKey = () => {
    const hasKey = apiService.hasApiKey();
    setHasApiKey(hasKey);
  };

  const checkSelectedModel = () => {
    const model = apiService.getSelectedModel();
    setSelectedModel(model || "");
  };

  const handleSearch = async (
    query: string,
    sortBy: string,
    sortOrder: string
  ) => {
    if (!hasApiKey) {
      setError(
        language === "zh"
          ? "请先在设置中配置API密钥"
          : "Please configure API key in settings first"
      );
      setShowSettings(true);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiService.searchCards({
        query,
        language,
        sort: sortBy,
        order: sortOrder,
      });

      setCards(response.cards);
    } catch (error: any) {
      console.error("Search error:", error);
      setError(
        error.response?.data?.detail ||
          error.message ||
          (language === "zh"
            ? "搜索失败，请重试"
            : "Search failed, please try again")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
    checkApiKey();
    checkSelectedModel();
  };

  const handleGetStarted = () => {
    setShowWelcome(false);
    setShowSettings(true);
  };

  const toggleLanguage = () => {
    setLanguage(language === "zh" ? "en" : "zh");
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-600 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary-500">
              MTG AI Search
            </h1>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
            >
              <Globe className="h-4 w-4" />
              {language === "zh" ? "EN" : "中文"}
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {/* API Key Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  hasApiKey ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm text-dark-300">
                {hasApiKey
                  ? language === "zh"
                    ? "API已配置"
                    : "API Configured"
                  : language === "zh"
                  ? "API未配置"
                  : "API Not Configured"}
              </span>
            </div>

            {/* Selected Model */}
            {selectedModel && (
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-dark-400" />
                <span className="text-sm text-dark-300">
                  {language === "zh" ? "模型" : "Model"}: {selectedModel}
                </span>
              </div>
            )}

            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              <Settings className="h-4 w-4" />
              {language === "zh" ? "设置" : "Settings"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        {/* Global Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-600 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Welcome Section */}
        {showWelcome && !hasApiKey && (
          <WelcomeSection language={language} onGetStarted={handleGetStarted} />
        )}

        {/* Search Section */}
        {(showWelcome === false || hasApiKey) && (
          <SearchSection
            language={language}
            examples={examples}
            onSearch={handleSearch}
            isLoading={isLoading}
            hasApiKey={hasApiKey}
          />
        )}

        {/* Results Section */}
        <ResultsSection
          cards={cards}
          language={language}
          isLoading={isLoading}
        />
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={handleSettingsClose}
        language={language}
      />
    </div>
  );
}

export default App;
