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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [scryfallQuery, setScryfallQuery] = useState("");
  const [totalCards, setTotalCards] = useState(0);

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
    console.log("API Key check:", {
      hasKey,
      storedKey: apiService.getApiKey(),
    });
    setHasApiKey(hasKey);
  };

  const checkSelectedModel = () => {
    const model = apiService.getSelectedModel();
    setSelectedModel(model || "");
  };

  const handleSearch = async () => {
    console.log("handleSearch called", { searchQuery, hasApiKey });

    if (!hasApiKey) {
      setError(
        language === "zh"
          ? "请先在设置中配置API密钥"
          : "Please configure API key in settings first"
      );
      setShowSettings(true);
      return;
    }

    if (!searchQuery?.trim()) {
      setError(
        language === "zh" ? "请输入搜索内容" : "Please enter search content"
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Sending search request with sort params:", {
        sortBy,
        sortOrder,
      });
      const requestData = {
        query: searchQuery,
        language,
        sort: sortBy,
        order: sortOrder,
      };
      console.log("Full request data:", requestData);
      const response = await apiService.searchCards(requestData);

      setCards(response.cards);
      setScryfallQuery(response.scryfall_query || "");
      setTotalCards(response.total_cards || response.cards.length);
    } catch (error: any) {
      console.error("Search error:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);
      
      // 处理422验证错误
      if (error.response?.status === 422) {
        const validationErrors = error.response?.data?.detail;
        console.error("Validation errors:", validationErrors);
        setError(
          `数据验证失败: ${JSON.stringify(validationErrors)}` ||
          (language === "zh"
            ? "请求数据格式错误，请检查输入"
            : "Request data format error, please check input")
        );
      } else {
        setError(
          error.response?.data?.detail ||
            error.message ||
            (language === "zh"
              ? "搜索失败，请重试"
              : "Search failed, please try again")
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
    checkApiKey();
    checkSelectedModel();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && hasApiKey) {
      handleSearch();
    }
  };

  const handleExampleClick = (example: string) => {
    setSearchQuery(example);
  };

  // 当排序方式改变时自动搜索
  const handleSortByChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    // 如果有搜索结果且API密钥已配置，则自动重新搜索
    if (cards.length > 0 && hasApiKey && searchQuery.trim()) {
      handleSearch();
    }
  };

  // 当排序顺序改变时自动搜索
  const handleSortOrderChange = (newSortOrder: "asc" | "desc") => {
    setSortOrder(newSortOrder);
    // 如果有搜索结果且API密钥已配置，则自动重新搜索
    if (cards.length > 0 && hasApiKey && searchQuery.trim()) {
      handleSearch();
    }
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
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
            onKeyPress={handleKeyPress}
            isLoading={isLoading}
            language={language}
            examples={examples}
            onExampleClick={handleExampleClick}
            sortBy={sortBy}
            setSortBy={handleSortByChange}
            sortOrder={sortOrder}
            setSortOrder={handleSortOrderChange}
            hasApiKey={hasApiKey}
          />
        )}

        {/* Results Section */}
        <ResultsSection
          cards={cards}
          scryfallQuery={scryfallQuery}
          totalCards={totalCards}
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
