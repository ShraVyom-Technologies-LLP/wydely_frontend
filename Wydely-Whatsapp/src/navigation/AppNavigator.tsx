import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import { RootStackParamList } from './types';
import SignUpPage from '../screens/SignUpPage';
import LoginPage from '../screens/LoginPage';
import OTPVerificationPage from '../screens/OTPVerificationPage';
import DashboardPageWrapper from '../screens/DashboardPageWrapper';
import BroadcastCampaignPageWrapper from '../screens/BroadcastCampaignPageWrapper';
import BroadcastCampaignPreviewPageWrapper from '../screens/BroadcastCampaignPreviewPageWrapper';
import CreateCampaignsPageWrapper from '../screens/CreateCampaignsPageWrapper';

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
      BroadcastCampaign: '/campaigns/broadcast',
      BroadcastCampaignPreview: '/campaigns/broadcast/preview',
      CreateCampaigns: '/campaigns/create',
    },
  },
};

const AppNavigator = () => {
  return (
    <NavigationContainer linking={Platform.OS === 'web' ? linking : undefined}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          cardStyle: { flex: 1 }, // ✅ critical for web ScrollView
        }}
      >
        <Stack.Screen name="SignUp" component={SignUpPage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="OTP" component={OTPVerificationPage} />
        <Stack.Screen name="Dashboard" component={DashboardPageWrapper} />
        <Stack.Screen name="BroadcastCampaign" component={BroadcastCampaignPageWrapper} />
        <Stack.Screen
          name="BroadcastCampaignPreview"
          component={BroadcastCampaignPreviewPageWrapper}
        />
        <Stack.Screen name="CreateCampaigns" component={CreateCampaignsPageWrapper} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
