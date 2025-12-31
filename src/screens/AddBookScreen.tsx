import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  SafeAreaView, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useReadingData } from '../hooks/useReadingData';
import { COLORS } from '../constants/theme';
import { BookPlus } from 'lucide-react-native';

export const AddBookScreen = ({ navigation }: any) => {
  const [titre, setTitre] = useState('');
  const [pages, setPages] = useState('');
  const { createLivre } = useReadingData();

  const handleSave = async () => {
    const totalPages = parseInt(pages);

    if (!titre.trim() || isNaN(totalPages) || totalPages <= 0) {
      Alert.alert("Erreur", "Veuillez entrer un titre et un nombre de pages valide.");
      return;
    }

    await createLivre(titre, totalPages);
    Alert.alert("Succès", "Livre ajouté à votre bibliothèque !");
    navigation.goBack(); // Retourne à l'écran précédent
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <BookPlus color={COLORS.primary} size={48} />
          </View>

          <Text style={styles.title}>Nouveau Livre</Text>
          <Text style={styles.subtitle}>Ajoutez un ouvrage à votre collection pour suivre votre progression.</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Titre du livre</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: L'Étranger"
              value={titre}
              onChangeText={setTitre}
            />

            <Text style={styles.label}>Nombre total de pages</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 180"
              keyboardType="numeric"
              value={pages}
              onChangeText={setPages}
            />

            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>AJOUTER LE LIVRE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  flex: { flex: 1 },
  content: { flex: 1, padding: 30, justifyContent: 'center' },
  iconContainer: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.gray, textAlign: 'center', marginBottom: 40, paddingHorizontal: 20 },
  form: { gap: 15 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: -5 },
  input: {
    backgroundColor: COLORS.background,
    padding: 18,
    borderRadius: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF'
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  cancelButton: { marginTop: 10, alignItems: 'center' },
  cancelText: { color: COLORS.gray, fontWeight: '500' }
});