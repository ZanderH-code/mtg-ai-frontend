import React, { useState, useEffect } from "react";
import { Search, Settings, Globe, Zap, Info, AlertCircle } from "lucide-react";
import SearchSection from "./components/SearchSection";
import ResultsSection from "./components/ResultsSection";
import SettingsModal from "./components/SettingsModal";
import WelcomeSection from "./components/WelcomeSection";
import { Card, ApiExample } from "./types/api";
import { apiService } from "./services/api";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<"zh" | "en">("zh");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Card[]>([]);
  const [scryfallQuery, setScryfallQuery] = useState("");
  const [totalCards, setTotalCards] = useState(0);
  const [apiProvider, setApiProvider] = useState<string>("");
  const [showSettings, setShowSettings] = useState(false);
  const [examples, setExamples] = useState<ApiExample>({ zh: [], en: [] });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [error, setError] = useState<string>("");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    loadExamples();
    checkApiKey();
  }, []);

  const checkApiKey = () => {
    const hasKey = apiService.hasApiKey();
    setHasApiKey(hasKey);
  };

  const loadExamples = async () => {
    try {
      const examplesData = await apiService.getExamples();
      setExamples(examplesData);
    } catch (error) {
      console.error("Failed to load examples:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

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
        query: searchQuery,
        language,
        sort: sortBy,
        order: sortOrder,
      });

      setSearchResults(response.cards);
      setScryfallQuery(response.scryfall_query);
      setTotalCards(response.total_cards);
      setApiProvider(response.api_provider || "");
    } catch (error: any) {
      console.error("Search failed:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        (language === "zh"
          ? "搜索失败，请稍后重试"
          : "Search failed, please try again later");
      setError(errorMessage);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setSearchQuery(example);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSearch();
    }
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
    checkApiKey(); // 重新检查API密钥状态
  };

  const handleGetStarted = () => {
    setShowWelcome(false);
    setShowSettings(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-primary-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {language === "zh" ? "MTG AI 搜索工具" : "MTG AI Search Tool"}
                </h1>
                <p className="text-primary-100 text-sm">
                  {language === "zh"
                    ? "使用自然语言搜索万智牌卡牌"
                    : "Search Magic: The Gathering cards using natural language"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* API Key Status */}
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    hasApiKey ? "bg-green-400" : "bg-red-400"
                  }`}
                ></div>
                <span className="text-xs text-white/80">
                  {hasApiKey
                    ? language === "zh"
                      ? "API已配置"
                      : "API Configured"
                    : language === "zh"
                    ? "需要API密钥"
                    : "API Key Required"}
                </span>
              </div>

              {/* Language Toggle */}
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setLanguage("zh")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    language === "zh"
                      ? "bg-white text-primary-600"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <Globe className="h-4 w-4 inline mr-1" />
                  中文
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    language === "en"
                      ? "bg-white text-primary-600"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <Globe className="h-4 w-4 inline mr-1" />
                  English
                </button>
              </div>

              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(true)}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
                title={language === "zh" ? "设置" : "Settings"}
              >
                <Settings className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* API Status */}
          {apiProvider && (
            <div className="mt-4 flex items-center justify-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                <Info className="h-3 w-3 mr-1" />
                {language === "zh" ? "API 提供商" : "API Provider"}:{" "}
                {apiProvider}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <span className="text-red-300">{error}</span>
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          {showWelcome && !hasApiKey && (
            <WelcomeSection
              language={language}
              onGetStarted={handleGetStarted}
            />
          )}

          {/* Search Section */}
          {(!showWelcome || hasApiKey) && (
            <SearchSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              onKeyPress={handleKeyPress}
              isLoading={isLoading}
              language={language}
              examples={examples}
              onExampleClick={handleExampleClick}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              hasApiKey={hasApiKey}
            />
          )}

          {/* Results Section */}
          {(searchResults.length > 0 || isLoading) && (
            <ResultsSection
              cards={searchResults}
              scryfallQuery={scryfallQuery}
              totalCards={totalCards}
              language={language}
              isLoading={isLoading}
            />
          )}
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          isOpen={showSettings}
          onClose={handleSettingsClose}
          language={language}
        />
      )}
    </div>
  );
}

export default App;
