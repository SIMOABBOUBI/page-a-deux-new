export interface Livre {
  id: string;
  titre: string;
  total: number;
  lues: number;
}

export interface Lecture {
  id: string;
  date: string;
  pagesLues: number;
  livreId: string | null;
}

export type RootTabParamList = {
  Accueil: undefined;
  Stats: undefined;
};

export interface StreakData {
  currentStreak: number;
  lastReadingDate: string | null;
  isStreakActiveToday: boolean;
}