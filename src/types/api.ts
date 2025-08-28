export interface Card {
  name: string;
  mana_cost?: string;
  type_line: string;
  oracle_text: string;
  image_uris?: {
    small?: string;
    normal?: string;
    large?: string;
    png?: string;
  };
  scryfall_uri: string;
  rarity?: string;
}

export interface SearchRequest {
  query: string;
  language: string;
  api_key?: string;
  model?: string;
  sort?: string;
  order?: string;
}

export interface SearchResponse {
  cards: Card[];
  scryfall_query: string;
  total_cards: number;
  api_provider?: string;
}

export interface ApiExample {
  zh: string[];
  en: string[];
}

export interface ApiModel {
  id: string;
  name: string;
  provider: string;
}

export interface ApiModelsResponse {
  success: boolean;
  models: ApiModel[];
  provider: string;
  message: string;
}

export interface ApiValidationResponse {
  valid: boolean;
  provider?: string;
  message?: string;
}
