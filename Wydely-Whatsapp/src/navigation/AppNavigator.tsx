import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import { RootStackParamList } from './types';
import SignUpPage from '../screens/SignUpPage';
import LoginPage from '../screens/LoginPage';
import OTPVerificationPage from '../screens/OTPVerificationPage';
import DashboardPageWrapper from '../screens/DashboardPageWrapper';
import ProfilePage from '../screens/ProfilePage';

const Stack = createStackNavigator<RootStackParamList>();

// Web URL configuration
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['http://localhost:8081', 'https://your-domain.com'],
  config: {
    screens: {
      SignUp: '/signup',
      Login: '/login',
      OTP: '/otp',
      Dashboard: '/dashboard',
      Profile: '/profile',
    },
  },
};

const AppNavigator = () => {
  return (
    <NavigationContainer linking={Platform.OS === 'web' ? linking : undefined}>
      <Stack.Navigator
        initialRouteName="SignUp"
        screenOptions={{
          headerShown: false, // Hide default header for custom designs
        }}
      >
        <Stack.Screen name="SignUp" component={SignUpPage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="OTP" component={OTPVerificationPage} />
        <Stack.Screen name="Dashboard" component={DashboardPageWrapper} />
        <Stack.Screen name="Profile" component={ProfilePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
