import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useAppTheme } from '@/context/ThemeContext';
import { AppStateProvider } from '@/context/AppStateContext';
import { ToastBanner } from '@/components/common/ToastBanner';

const ThemedRoot: React.FC = () => {
  const { mode, colors } = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Slot />
      <ToastBanner />
    </View>
  );
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <ThemedRoot />
      </AppStateProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});