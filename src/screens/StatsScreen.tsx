import React, { useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { useReadingData } from '../hooks/useReadingData';
import { COLORS } from '../constants/theme';
import { Trophy, Calendar, BookOpen } from 'lucide-react-native';
import { useFocusEffect} from '@react-navigation/native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const StatsScreen = () => {
  const { lectures, streak, refreshData } = useReadingData();

  // --- FORCE LA MISE À JOUR QUAND ON ARRIVE SUR CET ONGLET ---
  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData])
  );

  // --- LOGIQUE : Calculer les données des 7 derniers jours ---
  const statsSemaine = useMemo(() => {
    const jours = [];
    const aujourdHui = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(aujourdHui.getDate() - i);
      const dateString = d.toDateString();

      // Somme des pages pour ce jour précis
      const pagesDuJour = lectures
        .filter(l => new Date(l.date).toDateString() === dateString)
        .reduce((sum, l) => sum + l.pagesLues, 0);

      jours.push({
        label: d.toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase().replace('.', ''),
        value: pagesDuJour,
      });
    }
    return jours;
  }, [lectures]);

  const maxPages = Math.max(...statsSemaine.map(j => j.value), 10); // Minimum 10 pour l'échelle

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Statistiques</Text>

        {/* CARTE SÉRIE ACTUELLE */}
        <View style={styles.streakCard}>
          <Trophy color="white" size={32} />
          <View>
            <Text style={styles.streakLabel}>SÉRIE ACTUELLE</Text>
            <Text style={styles.streakValue}>{streak.currentStreak} Jours</Text>
          </View>
        </View>

        {/* GRAPHIQUE À BARRES CUSTOM */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>7 derniers jours (Pages)</Text>
          <View style={styles.chartContainer}>
           {statsSemaine.map((jour, index) => {
             const estAujourdHui = index === 6; // Le dernier élément est toujours aujourd'hui
             return (
               <View key={index} style={styles.barColumn}>
                 <View style={styles.barWrapper}>
                   <View
                     style={[
                       styles.bar,
                       { height: `${(jour.value / maxPages) * 100}%` },
                       jour.value > 0 ? (estAujourdHui ? {backgroundColor: COLORS.secondary} : styles.barActive) : styles.barEmpty
                     ]}
                   />
                 </View>
                 <Text style={[styles.barLabel, estAujourdHui && {color: COLORS.primary}]}>{jour.label}</Text>
                 <Text style={styles.barValue}>{jour.value}</Text>
               </View>
             );
           })}
          </View>
        </View>

        {/* RÉCAPITULATIF TOTAL */}
        <View style={styles.infoGrid}>
          <View style={styles.infoBox}>
            <Calendar color={COLORS.primary} size={24} />
            <Text style={styles.infoNum}>{lectures.length}</Text>
            <Text style={styles.infoText}>Sessions</Text>
          </View>
          <View style={styles.infoBox}>
            <BookOpen color={COLORS.primary} size={24} />
            <Text style={styles.infoNum}>
              {lectures.reduce((sum, l) => sum + l.pagesLues, 0)}
            </Text>
            <Text style={styles.infoText}>Pages totales</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  scrollContent: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#1A1A1A' },
  streakCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  streakLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 'bold' },
  streakValue: { color: 'white', fontSize: 28, fontWeight: '900' },
  chartCard: { backgroundColor: 'white', borderRadius: 25, padding: 20, marginBottom: 20 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#666', marginBottom: 25 },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 180 },
  barColumn: { alignItems: 'center', flex: 1 },
  barWrapper: { height: 120, width: '100%', justifyContent: 'flex-end', alignItems: 'center' },
  bar: { width: 12, borderRadius: 6 },
  barActive: { backgroundColor: COLORS.primary },
  barEmpty: { backgroundColor: '#F0F0F0' },
  barLabel: { fontSize: 10, color: '#AAA', marginTop: 10, fontWeight: 'bold' },
  barValue: { fontSize: 10, color: '#666', marginTop: 2 },
  infoGrid: { flexDirection: 'row', gap: 15 },
  infoBox: { flex: 1, backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center' },
  infoNum: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', marginTop: 8 },
  infoText: { fontSize: 12, color: '#999' }
});