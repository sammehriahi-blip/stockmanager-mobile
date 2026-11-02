import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProductsProvider } from './src/context/ProductsContext';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme';

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bg, primary: colors.ink, card: colors.card, text: colors.text },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ProductsProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="dark" />
          <AppNavigator />
        </NavigationContainer>
      </ProductsProvider>
    </SafeAreaProvider>
  );
}