import React from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Key } from "lucide-react";
import { ApiExample } from "../types/api";

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  language: "zh" | "en";
  examples: ApiExample;
  onExampleClick: (example: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  hasApiKey: boolean;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  onKeyPress,
  isLoading,
  language,
  examples,
  onExampleClick,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  hasApiKey,
}) => {
  const sortOptions = [
    { value: "name", label: language === "zh" ? "名称" : "Name" },
    { value: "set", label: language === "zh" ? "系列" : "Set" },
    { value: "released", label: language === "zh" ? "发布日期" : "Released" },
    { value: "rarity", label: language === "zh" ? "稀有度" : "Rarity" },
    { value: "color", label: language === "zh" ? "颜色" : "Color" },
    { value: "cmc", label: language === "zh" ? "法术力费用" : "CMC" },
    { value: "power", label: language === "zh" ? "力量" : "Power" },
    { value: "toughness", label: language === "zh" ? "防御力" : "Toughness" },
    { value: "edhrec", label: "EDHREC" },
    { value: "artist", label: language === "zh" ? "艺术家" : "Artist" },
  ];

  return (
    <div className="card p-8">
      {/* API Key Warning */}
      {!hasApiKey && (
        <div className="mb-6 bg-yellow-900/20 border border-yellow-600 rounded-lg p-4 flex items-center gap-3">
          <Key className="h-5 w-5 text-yellow-400 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-yellow-300">
              {language === "zh" ? "需要配置API密钥" : "API Key Required"}
            </h3>
            <p className="text-sm text-yellow-200">
              {language === "zh"
                ? "请先在设置中配置有效的AI API密钥才能使用搜索功能"
                : "Please configure a valid AI API key in settings to use the search feature"}
            </p>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder={
                hasApiKey
                  ? language === "zh"
                    ? "输入自然语言描述，例如：红色飞行生物"
                    : "Enter natural language description, e.g., red flying creatures"
                  : language === "zh"
                  ? "请先配置API密钥"
                  : "Please configure API key first"
              }
              className="input-field pl-12"
              disabled={isLoading || !hasApiKey}
            />
          </div>
          <button
            onClick={onSearch}
            disabled={isLoading || !hasApiKey}
            className="btn-primary flex items-center gap-2 min-w-[120px] justify-center"
            title={`isLoading: ${isLoading}, hasQuery: ${!!searchQuery?.trim()}, hasApiKey: ${hasApiKey}`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Search className="h-5 w-5" />
            )}
            {language === "zh" ? "搜索" : "Search"}
          </button>
        </div>
      </div>

      {/* Sort Options */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-dark-300 text-sm font-medium">
            {language === "zh" ? "排序方式" : "Sort by"}:
          </span>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-dark-700 border border-dark-600 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-primary-500"
            disabled={!hasApiKey}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center gap-2 bg-dark-700 hover:bg-dark-600 border border-dark-600 text-white px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!hasApiKey}
          >
            {sortOrder === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
            {sortOrder === "asc"
              ? language === "zh"
                ? "升序"
                : "Ascending"
              : language === "zh"
              ? "降序"
              : "Descending"}
          </button>
        </div>
      </div>

      {/* Examples */}
      {examples[language] && examples[language].length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            {language === "zh" ? "搜索示例" : "Search Examples"}:
          </h3>
          {language === "zh" && (
            <p className="text-sm text-dark-300 mb-3">
              💡 <strong>提示</strong>：使用"瞬间"可以搜索即时法术，如"红色瞬间"、"蓝色瞬间"等
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {examples[language].map((example, index) => (
              <button
                key={index}
                onClick={() => onExampleClick(example)}
                className="bg-dark-700 hover:bg-dark-600 border border-dark-600 text-white px-3 py-2 rounded-lg text-sm transition-colors hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!hasApiKey}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSection;
