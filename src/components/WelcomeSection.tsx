import React from "react";
import { Zap, Search, Globe, Settings, Sparkles } from "lucide-react";

interface WelcomeSectionProps {
  language: "zh" | "en";
  onGetStarted: () => void;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  language,
  onGetStarted,
}) => {
  const features = [
    {
      icon: <Search className="h-6 w-6" />,
      title: language === "zh" ? "自然语言搜索" : "Natural Language Search",
      description:
        language === "zh"
          ? "使用日常语言描述您要找的卡牌，AI会帮您转换为精确的搜索查询"
          : "Describe the cards you're looking for in everyday language, and AI will convert it to precise search queries",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: language === "zh" ? "双语支持" : "Bilingual Support",
      description:
        language === "zh"
          ? "支持中文和英文两种语言，无论您使用哪种语言都能轻松搜索"
          : "Support for both Chinese and English, search easily in your preferred language",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: language === "zh" ? "智能排序" : "Smart Sorting",
      description:
        language === "zh"
          ? "多种排序选项，按名称、系列、稀有度等快速找到您需要的卡牌"
          : "Multiple sorting options to quickly find cards by name, set, rarity, and more",
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: language === "zh" ? "API管理" : "API Management",
      description:
        language === "zh"
          ? "支持多种AI提供商，安全地管理您的API密钥"
          : "Support for multiple AI providers with secure API key management",
    },
  ];

  return (
    <div className="card p-8">
      <div className="text-center mb-8">
        <div className="bg-primary-500/20 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Zap className="h-10 w-10 text-primary-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">
          {language === "zh"
            ? "欢迎使用MTG AI搜索工具"
            : "Welcome to MTG AI Search Tool"}
        </h1>
        <p className="text-dark-300 text-lg max-w-2xl mx-auto">
          {language === "zh"
            ? "使用人工智能技术，让搜索万智牌卡牌变得简单而强大"
            : "Use AI technology to make searching Magic: The Gathering cards simple and powerful"}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-dark-700 border border-dark-600 rounded-lg p-6"
          >
            <div className="flex items-start gap-4">
              <div className="bg-primary-500/20 p-2 rounded-lg text-primary-400 flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-dark-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Get Started Button */}
      <div className="text-center">
        <button
          onClick={onGetStarted}
          className="btn-primary text-lg px-8 py-4"
        >
          {language === "zh" ? "开始使用" : "Get Started"}
        </button>
        <p className="text-dark-400 text-sm mt-4">
          {language === "zh"
            ? "点击开始使用按钮配置您的API密钥并开始搜索"
            : "Click Get Started to configure your API key and start searching"}
        </p>
      </div>
    </div>
  );
};

export default WelcomeSection;

