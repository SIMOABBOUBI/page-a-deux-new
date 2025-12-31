import React, { useState,useCallback } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity,
  Modal, TextInput, SafeAreaView, ActivityIndicator, Alert, Platform
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { PlusCircle, BookOpen, Flame ,Trash2 } from 'lucide-react-native';

import { useReadingData } from '../hooks/useReadingData';
import { ProgressBar } from '../components/ProgressBar';
import { COLORS } from '../constants/theme';
import { useNavigation, useFocusEffect} from '@react-navigation/native';

export const HomeScreen = () => {
  const { livres, pagesAujourdHui, streak, isLoading, addLecture,refreshData,deleteLivre } = useReadingData();
  const [modalVisible, setModalVisible] = useState(false);
  const [inputPages, setInputPages] = useState('');
  const [livreIdSelectionne, setLivreIdSelectionne] = useState<string | null>(null);
  const navigation = useNavigation<any>(); // Utilise le hook de navigation

  const handleEnregistrer = async () => {
    const pages = parseInt(inputPages);
    if (isNaN(pages) || pages <= 0) return;

    await addLecture(pages, livreIdSelectionne);

    setModalVisible(false);
    setInputPages('');
    setLivreIdSelectionne(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

const confirmDelete = (id: string, titre: string) => {
  if (Platform.OS === 'web') {
    const siConfirme = confirm(`Supprimer "${titre}" ?`);
    if (siConfirme) deleteLivre(id);
  } else {
    Alert.alert(
      "Confirmation",
      `Supprimer "${titre}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: () => deleteLivre(id) }
      ],
      { cancelable: true }
    );
  }
};

 // --- LOGIQUE DE RAFRAÎCHISSEMENT AUTOMATIQUE ---
  useFocusEffect(
    useCallback(() => {
      refreshData(); // Cette fonction va relire le stockage local (AsyncStorage)
    }, [refreshData])
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* HEADER AVEC STREAK */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appTitle}>Page à Deux</Text>
          </View>
          <View style={[styles.streakBadge, streak.isStreakActiveToday && styles.streakActive]}>
            <Flame color={streak.isStreakActiveToday ? "white" : "#CCC"} size={18} />
            <Text style={[styles.streakText, streak.isStreakActiveToday && {color: 'white'}]}>
              {streak.currentStreak}
            </Text>
          </View>
        </View>

        {/* STATS DU JOUR */}
        <View style={styles.dailyCard}>
          <Text style={styles.cardLabel}>PAGES LUES AUJOURD'HUI</Text>
          <Text style={styles.pagesTotal}>{pagesAujourdHui}</Text>
        </View>

        <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddBook')} // C'est ici que la magie opère !
         >
            <PlusCircle color="white" size={24} />
            <Text style={styles.addButtonText}>AJOUTER UN LIVRE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <PlusCircle color="white" size={24} />
          <Text style={styles.addButtonText}>NOTER UNE LECTURE</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Ma Bibliothèque</Text>

        {livres.length === 0 && (
          <Text style={styles.emptyText}>Aucun livre. Ajoutez-en un pour commencer !</Text>
        )}

       {livres.map(livre => (
         <View key={livre.id} style={styles.bookCard}>
           <BookOpen color={COLORS.primary} size={22} />
           <View style={styles.bookDetails}>
             <Text style={styles.bookTitle}>{livre.titre}</Text>
             <Text style={styles.bookProgress}>{livre.lues} / {livre.total} pages</Text>
             <ProgressBar
               progress={livre.lues / livre.total}
               color={COLORS.primary}
               height={6}
             />
           </View>

           {/* Bouton de suppression */}
           <TouchableOpacity
             onPress={() => confirmDelete(livre.id, livre.titre)}
             style={styles.deleteButton}
           >
             <Trash2 color="#FF3B30" size={20} />
           </TouchableOpacity>
         </View>
       ))}
      </ScrollView>

      {/* MODAL LECTURE */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Session de lecture</Text>

            <Text style={styles.label}>Livre (optionnel) :</Text>
            <ScrollView horizontal style={styles.chipScroll} showsHorizontalScrollIndicator={false}>
              {livres.map(l => (
                <TouchableOpacity
                  key={l.id}
                  onPress={() => setLivreIdSelectionne(l.id === livreIdSelectionne ? null : l.id)}
                  style={[styles.chip, l.id === livreIdSelectionne && styles.chipActive]}
                >
                  <Text style={[styles.chipText, l.id === livreIdSelectionne && {color: 'white'}]}>{l.titre}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput
              style={styles.input}
              placeholder="Nombre de pages lues"
              keyboardType="numeric"
              value={inputPages}
              onChangeText={setInputPages}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleEnregistrer}>
              <Text style={styles.saveButtonText}>ENREGISTRER</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={{color: '#999'}}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 25 },
  welcomeText: { fontSize: 16, color: '#999' },
  appTitle: { fontSize: 28, fontWeight: '900', color: '#1A1A1A' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 5 },
  streakActive: { backgroundColor: '#FF9500' },
  streakText: { fontWeight: 'bold', color: '#AAA' },
  dailyCard: { backgroundColor: 'white', padding: 25, borderRadius: 25, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardLabel: { fontSize: 11, fontWeight: 'bold', color: '#BBB', letterSpacing: 1 },
  pagesTotal: { fontSize: 42, fontWeight: 'bold', color: '#1A1A1A', marginTop: 5 },
  addButton: { backgroundColor: COLORS.primary, flexDirection: 'row', height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 20 },
  addButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 35, marginBottom: 15 },
  bookCard: { backgroundColor: 'white', padding: 15, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  bookDetails: { flex: 1, marginLeft: 15, gap: 4 },
  bookTitle: { fontWeight: 'bold', fontSize: 16 },
  bookProgress: { fontSize: 12, color: '#999', marginBottom: 5 },
  emptyText: { textAlign: 'center', color: '#CCC', marginTop: 30, fontStyle: 'italic' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 30, padding: 25 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 10 },
  chipScroll: { marginBottom: 20 },
  chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 15, backgroundColor: '#F0F0F0', marginRight: 8 },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: '#666' },
  input: { backgroundColor: '#F5F5F5', padding: 18, borderRadius: 15, fontSize: 18, marginBottom: 20 },
  saveButton: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 15, alignItems: 'center' },
  saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { marginTop: 15, alignItems: 'center' },
  deleteButton: {padding: 10,marginLeft: 5}
});