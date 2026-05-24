export interface BirthdayWish {
  title: string;
  message: string;
  shortQuote: string;
  threeWishes: string[];
  predictions: string[];
}

export interface ScrapbookItem {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  sticker: string; // 'heart' | 'star' | 'balloon' | 'flower' | 'cake'
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StarWish {
  id: string;
  wishText: string;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
}
