import { useState, useEffect, useCallback } from 'react';
import { Livre, Lecture, StreakData } from '../@types';
import { storageService } from '../services/storageService';

export const useReadingData = () => {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- CHARGEMENT DES DONNÉES ---
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [storedLivres, storedLectures] = await Promise.all([
        storageService.getLivres(),
        storageService.getLectures(),
      ]);
      setLivres(storedLivres);
      setLectures(storedLectures);
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // --- LOGIQUE DE CALCUL DES PAGES DU JOUR ---
  const pagesAujourdHui = lectures
    .filter(l => new Date(l.date).toDateString() === new Date().toDateString())
    .reduce((sum, l) => sum + l.pagesLues, 0);

  // --- LOGIQUE DE CALCUL DU STREAK (SÉRIE) ---
  const calculateStreak = (): StreakData => {
    if (lectures.length === 0) {
      return { currentStreak: 0, lastReadingDate: null, isStreakActiveToday: false };
    }

    // Extraire les dates uniques et les trier (plus récent au plus ancien)
    const datesLues = Array.from(
      new Set(lectures.map(l => new Date(l.date).toDateString()))
    ).map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());

    const aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);

    const derniereDateLecture = new Date(datesLues[0]);
    derniereDateLecture.setHours(0, 0, 0, 0);

    const diffTemps = aujourdHui.getTime() - derniereDateLecture.getTime();
    const diffJours = Math.floor(diffTemps / (1000 * 60 * 60 * 24));

    // Si plus de 1 jour d'écart, la série est brisée
    if (diffJours > 1) {
      return { currentStreak: 0, lastReadingDate: derniereDateLecture.toISOString(), isStreakActiveToday: false };
    }

    let streak = 0;
    let dateVerification = new Date(derniereDateLecture);

    for (const dateLecture of datesLues) {
      const d = new Date(dateLecture);
      d.setHours(0, 0, 0, 0);

      if (d.getTime() === dateVerification.getTime()) {
        streak++;
        dateVerification.setDate(dateVerification.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      currentStreak: streak,
      lastReadingDate: derniereDateLecture.toISOString(),
      isStreakActiveToday: diffJours === 0
    };
  };

  // --- ACTION : AJOUTER UNE LECTURE ---
  const addLecture = async (pages: number, livreId: string | null) => {
    const nouvelle: Lecture = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      pagesLues: pages,
      livreId
    };

    const majLectures = [...lectures, nouvelle];
    let majLivres = [...livres];

    if (livreId) {
      majLivres = livres.map(l =>
        l.id === livreId ? { ...l, lues: l.lues + pages } : l
      );
    }

    await storageService.saveLectures(majLectures);
    await storageService.saveLivres(majLivres);

    setLectures(majLectures);
    setLivres(majLivres);
  };

  // --- ACTION : AJOUTER UN LIVRE ---
 const createLivre = async (titre: string, totalPages: number) => {
  const nouveauLivre: Livre = {
    id: Date.now().toString(),
    titre,
    total: totalPages,
    lues: 0,
  };

  const majLivres = [...livres, nouveauLivre];
  await storageService.saveLivres(majLivres);
  setLivres(majLivres);
};
  // --- ACTION : SUPPRIMER UN LIVRE ---
 const deleteLivre = async (livreId: string) => {
     console.error("test");
   try {
     // 1. Filtrer la liste pour enlever le livre
     const majLivres = livres.filter(l => l.id !== livreId);

     // 2. Optionnel : Supprimer aussi les sessions de lecture liées à ce livre
     const majLectures = lectures.filter(lect => lect.livreId !== livreId);

     // 3. Sauvegarder les nouvelles listes
     await storageService.saveLivres(majLivres);
     await storageService.saveLectures(majLectures);

     // 4. Mettre à jour l'état local pour rafraîchir l'écran
     setLivres(majLivres);
     setLectures(majLectures);
   } catch (error) {
     console.error("Erreur lors de la suppression :", error);
   }
 };

  return {
    livres,
    lectures,
    isLoading,
    pagesAujourdHui,
    streak: calculateStreak(),
    refreshData,
    addLecture,
    createLivre,
    deleteLivre
  };
};