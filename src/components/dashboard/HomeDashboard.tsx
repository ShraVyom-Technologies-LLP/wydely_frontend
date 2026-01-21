import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import DashboardHeader from './chatsDashboard/DashboardHeader';
import LeftPanel from './home/LeftPanel';
import CreditsBanner from './home/CreditsBanner';
import SetupKYCCard from './home/SetupKYCCard';
import UserProfileCard from './home/UserProfileCard';
import BalanceCards from './home/BalanceCards';
import TrainingCallCard from './home/TrainingCallCard';
import ReferEarnCard from './home/ReferEarnCard';
import MobileAppCard from './home/MobileAppCard';
import CustomizeWhatsAppLinkCard from './home/CustomizeWhatsAppLinkCard';
import WhatsAppWebsiteButtonCard from './home/WhatsAppWebsiteButtonCard';

const isMobile = () => Dimensions.get('window').width < 768;

interface HomeDashboardProps {
  onSearchChange?: (text: string) => void;
  onThemeToggle?: () => void;
  // Visibility flags from API
  showCreditsBanner?: boolean;
  showSetupKYC?: boolean;
  showTrainingCall?: boolean;
  showReferEarn?: boolean;
  showCustomizeLink?: boolean;
  showWebsiteButton?: boolean;
  showUserProfile?: boolean;
  showBalanceCards?: boolean;
  showMobileApp?: boolean;
  showLeftPanel?: boolean;
  showUpgradePro?: boolean;
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onSearchChange,
  onThemeToggle,
  showCreditsBanner = true,
  showSetupKYC = true,
  showTrainingCall = true,
  showReferEarn = true,
  showCustomizeLink = true,
  showWebsiteButton = true,
  showUserProfile = true,
  showBalanceCards = true,
  showMobileApp = true,
  showLeftPanel = true,
  showUpgradePro = true,
}) => {
  const mobile = isMobile();

  return (
    <View style={styles.container}>
      <DashboardHeader
        onSearchChange={onSearchChange}
        onThemeToggle={onThemeToggle}
        title="Dashboard"
        showCompanyInfo={true}
      />
      <View style={styles.contentContainer}>
        {/* Left Panel - Company Info & Status Cards */}
        {!mobile && showLeftPanel && (
          <View style={styles.leftPanelContainer}>
            <LeftPanel showUpgradePro={showUpgradePro} />
          </View>
        )}

        {/* Main Content Area */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Credits Banner */}
          <CreditsBanner show={showCreditsBanner} />

          {/* Middle Section - Main Cards */}
          <View style={styles.middleSection}>
            <SetupKYCCard show={showSetupKYC} />
            <View style={styles.cardsGrid}>
              {showTrainingCall && (
                <View style={styles.cardWrapper}>
                  <TrainingCallCard />
                </View>
              )}
              {showReferEarn && (
                <View style={styles.cardWrapper}>
                  <ReferEarnCard />
                </View>
              )}
              {showCustomizeLink && (
                <View style={styles.cardWrapper}>
                  <CustomizeWhatsAppLinkCard />
                </View>
              )}
              {showWebsiteButton && (
                <View style={styles.cardWrapper}>
                  <WhatsAppWebsiteButtonCard />
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Right Panel - User Profile & Balance Cards */}
        {!mobile && (
          <View style={styles.rightPanelContainer}>
            {showUserProfile && <UserProfileCard />}
            {showBalanceCards && <BalanceCards />}
            {showMobileApp && <MobileAppCard />}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanelContainer: {
    width: 318,
    borderRightWidth: 1,
    borderRightColor: '#EAECF0',
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    ...(Platform.OS === 'web' && {
      paddingBottom: 32,
    }),
  },
  middleSection: {
    flex: 1,
    gap: 16,
    minWidth: 0,
  },
  rightPanelContainer: {
    width: 320,
    padding: 16,
    gap: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#EAECF0',
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web' && {
      overflowY: 'auto',
    }),
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  cardWrapper: {
    flex: 1,
    minWidth: 280,
    maxWidth: 400,
  },
});

export default HomeDashboard;
