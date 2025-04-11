import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { WatchlistProvider } from './context/WatchlistContext';
import { StatusBar } from 'react-native';

import Toast from 'react-native-toast-message';
import { toastConfig } from './components/ToastConfig'; // opțional, dacă ai unul custom

export default function App() {
  return (
    <WatchlistProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <AppNavigator />
      </NavigationContainer>
      <Toast config={toastConfig} />
    </WatchlistProvider>
  );
}
