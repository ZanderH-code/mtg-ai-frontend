import React from "react";
import { ExternalLink, Info, Search } from "lucide-react";
import { Card } from "../types/api";
import CardComponent from "./CardComponent";
import LoadingSpinner from "./LoadingSpinner";

interface ResultsSectionProps {
  cards: Card[];
  scryfallQuery: string;
  totalCards: number;
  language: "zh" | "en";
  isLoading?: boolean;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({
  cards,
  scryfallQuery,
  totalCards,
  language,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="card">
        <LoadingSpinner
          message={
            language === "zh" ? "正在搜索卡牌..." : "Searching for cards..."
          }
          size="lg"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Query Info */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">
            {language === "zh" ? "搜索结果" : "Search Results"}
          </h2>
          <span className="text-dark-300">
            {language === "zh" ? "找到" : "Found"} {cards.length}{" "}
            {language === "zh" ? "张卡牌" : "cards"}
            {totalCards > cards.length &&
              ` (${language === "zh" ? "共" : "of"} ${totalCards})`}
          </span>
        </div>

        {/* Scryfall Query */}
        <div className="bg-dark-700 border border-dark-600 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-primary-400" />
            <span className="text-sm font-medium text-white">
              {language === "zh" ? "Scryfall 查询" : "Scryfall Query"}:
            </span>
          </div>
          <code className="text-sm text-dark-300 font-mono break-all">
            {scryfallQuery}
          </code>
          <a
            href={`https://scryfall.com/search?q=${encodeURIComponent(
              scryfallQuery
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 text-sm ml-2 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            {language === "zh" ? "在 Scryfall 中查看" : "View on Scryfall"}
          </a>
        </div>
      </div>

      {/* Cards Grid */}
      {cards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <CardComponent
              key={`${card.name}-${index}`}
              card={card}
              language={language}
            />
          ))}
        </div>
      ) : (
        /* No Results */
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {language === "zh" ? "没有找到卡牌" : "No cards found"}
          </h3>
          <p className="text-dark-300 mb-4">
            {language === "zh"
              ? "尝试使用不同的搜索词或检查拼写"
              : "Try using different search terms or check your spelling"}
          </p>
          <div className="flex items-center justify-center gap-2 text-dark-400">
            <Search className="h-4 w-4" />
            <span className="text-sm">
              {language === "zh" ? "搜索查询" : "Search query"}: {scryfallQuery}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;
