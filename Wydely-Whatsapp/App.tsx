import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { ToastProvider } from './src/context/ToastContext';

if (typeof window !== 'undefined') {
  require('./web-styles.css');
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <View style={styles.root}>
          <StatusBar style="dark" />
          <AppNavigator />
        </View>
      </ToastProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, minHeight: 0 },
});
