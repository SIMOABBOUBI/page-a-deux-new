import AsyncStorage from '@react-native-async-storage/async-storage';
import { Livre, Lecture } from '../@types';

const KEYS = {
  LIVRES: '@livres_v2',
  LECTURES: '@lectures_v2',
};

export const storageService = {
  async getLivres(): Promise<Livre[]> {
    const data = await AsyncStorage.getItem(KEYS.LIVRES);
    return data ? JSON.parse(data) : [];
  },

  async saveLivres(livres: Livre[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.LIVRES, JSON.stringify(livres));
  },

  async getLectures(): Promise<Lecture[]> {
    const data = await AsyncStorage.getItem(KEYS.LECTURES);
    return data ? JSON.parse(data) : [];
  },

  async saveLectures(lectures: Lecture[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.LECTURES, JSON.stringify(lectures));
  }
};