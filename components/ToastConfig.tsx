// components/ToastConfig.ts
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ToastConfig } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
  custom: ({ text1 }) => (
    <View style={styles.toastContainer}>
      <Text style={styles.toastText}>{text1}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    backgroundColor: '#111',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginHorizontal: 20,
    marginTop: 10,
    borderColor: '#4f46e5',
    borderWidth: 1,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
