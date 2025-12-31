import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  progress: number; // Une valeur entre 0 et 1 (ex: 0.75 pour 75%)
  color?: string;   // Couleur de la barre de progression
  backgroundColor?: string; // Couleur de l'arrière-plan
  height?: number;  // Hauteur de la barre
  borderRadius?: number; // Rayon des bords
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = '#007AFF', // Couleur par défaut
  backgroundColor = '#E0E0E0', // Couleur de fond par défaut
  height = 8,
  borderRadius = 4,
}) => {
  const normalizedProgress = Math.max(0, Math.min(1, progress)); // S'assure que progress est entre 0 et 1

  return (
    <View style={[styles.container, { backgroundColor, height, borderRadius }]}>
      <View
        style={[
          styles.fill,
          { width: `${normalizedProgress * 100}%`, backgroundColor: color, borderRadius }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden', // Pour que le borderRadius s'applique bien au remplissage
  },
  fill: {
    height: '100%',
  },
});