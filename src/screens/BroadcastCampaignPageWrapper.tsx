import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import Sidebar from '../components/dashboard/Sidebar';
import BroadcastCampaignPage from '../components/BroadcastCampaignPage';
import colors from '../theme/colors';

type NavigationProp = StackNavigationProp<RootStackParamList>;

// Responsive breakpoint
const isMobile = () => {
  const { width } = Dimensions.get('window');
  return width < 768;
};

export default function BroadcastCampaignPageWrapper() {
  const navigation = useNavigation<NavigationProp>();
  const [activeIcon, setActiveIcon] = useState('campaigns');
  const [showSidebar, setShowSidebar] = useState(false);
  const mobile = isMobile();

  const handleIconPress = (icon: string) => {
    setActiveIcon(icon);
    if (mobile) setShowSidebar(false);

    // Navigate to Dashboard and let it handle the icon state
    navigation.navigate('Dashboard', { initialIcon: icon });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Sidebar - Hidden on mobile unless toggled */}
        {(!mobile || showSidebar) && (
          <View style={[styles.sidebarContainer, mobile && styles.sidebarMobile]}>
            <Sidebar activeIcon={activeIcon} onIconPress={handleIconPress} />
          </View>
        )}

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          <BroadcastCampaignPage />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.bg,
    minHeight: 0,
    minWidth: 0,
  },
  sidebarContainer: {
    width: 60,
    flexShrink: 0,
  },
  sidebarMobile: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  mainContent: {
    flex: 1,
    minHeight: 0,
    minWidth: 0,
  },
});
