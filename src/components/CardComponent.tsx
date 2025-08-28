import React, { useState } from "react";
import { ExternalLink, Image as ImageIcon } from "lucide-react";
import { Card } from "../types/api";

interface CardComponentProps {
  card: Card;
  language: "zh" | "en";
}

const CardComponent: React.FC<CardComponentProps> = ({ card, language }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getCardImage = () => {
    if (!card.image_uris) return null;

    // Prefer normal size, fallback to small, then png
    return (
      card.image_uris.normal || card.image_uris.small || card.image_uris.png
    );
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const formatManaCost = (manaCost?: string) => {
    if (!manaCost) return "";

    // Convert Scryfall mana symbols to readable format
    return manaCost
      .replace(/\{W\}/g, "⚪")
      .replace(/\{U\}/g, "🔵")
      .replace(/\{B\}/g, "⚫")
      .replace(/\{R\}/g, "🔴")
      .replace(/\{G\}/g, "🟢")
      .replace(/\{C\}/g, "⚫")
      .replace(/\{(\d+)\}/g, "$1");
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case "common":
        return "text-gray-400";
      case "uncommon":
        return "text-green-400";
      case "rare":
        return "text-blue-400";
      case "mythic":
        return "text-orange-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="card group">
      {/* Card Image */}
      <div className="relative aspect-[745/1040] bg-dark-700 overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        )}

        {!imageError && getCardImage() ? (
          <img
            src={getCardImage()}
            alt={card.name}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-dark-400">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">
                {language === "zh" ? "图片不可用" : "Image unavailable"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3">
        {/* Card Name and Mana Cost */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-white text-lg leading-tight flex-1">
            {card.name}
          </h3>
          {card.mana_cost && (
            <span className="text-lg font-mono text-white flex-shrink-0">
              {formatManaCost(card.mana_cost)}
            </span>
          )}
        </div>

        {/* Card Type */}
        <p className="text-dark-300 text-sm italic">{card.type_line}</p>

        {/* Rarity */}
        {card.rarity && (
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium uppercase tracking-wide ${getRarityColor(
                card.rarity
              )}`}
            >
              {card.rarity}
            </span>
          </div>
        )}

        {/* Card Text */}
        {card.oracle_text && (
          <div className="text-sm text-dark-200 leading-relaxed">
            {card.oracle_text.split("\n").map((line, index) => (
              <p key={index} className="mb-1">
                {line}
              </p>
            ))}
          </div>
        )}

        {/* External Link */}
        <a
          href={card.scryfall_uri}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 text-sm transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          {language === "zh" ? "在 Scryfall 中查看" : "View on Scryfall"}
        </a>
      </div>
    </div>
  );
};

export default CardComponent;

