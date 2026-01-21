import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { useProject } from '../../../context/ProjectContext';
import UpgradeProCard from './UpgradeProCard';

interface StatusCardProps {
  iconSource: ImageSourcePropType;
  title: string;
  status: 'LIVE' | 'PENDING' | 'INACTIVE';
  value?: string | number;
  show?: boolean;
}

const StatusCard: React.FC<StatusCardProps> = ({
  iconSource,
  title,
  status,
  value,
  show = true,
}) => {
  if (!show) return null;

  const statusColor = status === 'LIVE' ? '#27AE60' : '#F59E0B';
  const statusBgColor = status === 'LIVE' ? '#D1FAE5' : '#FEF3C7';

  return (
    <View style={styles.statusCard}>
      {/* Background Watermark Icon */}
      {/* <View style={styles.watermarkContainer}>
        <Image source={iconSource} style={styles.watermarkIcon} resizeMode="contain" />
      </View> */}

      {/* Header with Icon and Title */}
      <View style={styles.statusCardHeader}>
        <View style={styles.iconContainer}>
          <Image source={iconSource} style={styles.statusIcon} resizeMode="contain" />
        </View>
        <Text style={styles.statusTitle}>{title}</Text>
      </View>

      {/* Status Badge */}
      <View style={styles.statusBadgeContainer}>
        <View style={[styles.statusBadge, { backgroundColor: statusBgColor }]}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
        </View>
      </View>

      {/* Value (for Remaining Quota) */}
      {value !== undefined && <Text style={styles.statusValue}>{value}</Text>}
    </View>
  );
};

interface LeftPanelProps {
  // These will come from API
  companyName?: string;
  whatsappStatus?: 'LIVE' | 'PENDING' | 'INACTIVE';
  qualityRating?: 'LOW' | 'MEDIUM' | 'HIGH';
  remainingQuota?: number;
  showWhatsappStatus?: boolean;
  showQualityRating?: boolean;
  showRemainingQuota?: boolean;
  showUpgradePro?: boolean;
  onExplorePlans?: () => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  companyName,
  whatsappStatus = 'LIVE',
  qualityRating = 'HIGH',
  remainingQuota = 250,
  showWhatsappStatus = true,
  showQualityRating = true,
  showRemainingQuota = true,
  showUpgradePro = true,
  onExplorePlans,
}) => {
  const { selectedProject } = useProject();
  const displayCompanyName = companyName || selectedProject?.name || 'Company Name';
  const companyInitial = displayCompanyName.charAt(0).toUpperCase();

  // Map quality rating to status display
  const qualityStatus: 'LIVE' | 'PENDING' | 'INACTIVE' =
    qualityRating === 'HIGH' ? 'LIVE' : qualityRating === 'MEDIUM' ? 'PENDING' : 'INACTIVE';

  return (
    <View style={styles.container}>
      {/* Company Welcome Section */}
      <View style={styles.companySection}>
        <View style={styles.companyAvatar}>
          <Text style={styles.companyInitial}>{companyInitial}</Text>
        </View>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.companyName} numberOfLines={2}>
          {displayCompanyName}
        </Text>
      </View>

      {/* Status Cards */}
      <View style={styles.statusCardsContainer}>
        <StatusCard
          iconSource={require('../../../../assets/images/whatsapp_Api_status.png')}
          title="WHATSAPP BUSINESS API STATUS"
          status={whatsappStatus}
          show={showWhatsappStatus}
        />
        <StatusCard
          iconSource={require('../../../../assets/images/quality_rating.png')}
          title="QUALITY RATING"
          status={qualityStatus}
          show={showQualityRating}
        />
        <StatusCard
          iconSource={require('../../../../assets/images/remaining_quota.png')}
          title="REMAINING QUOTA"
          status="LIVE"
          value={remainingQuota}
          show={showRemainingQuota}
        />
      </View>

      {/* Upgrade to PRO Card */}
      {showUpgradePro && (
        <View style={styles.upgradeCardContainer}>
          <UpgradeProCard onExplorePlans={onExplorePlans} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 318,
    padding: 16,
    gap: 16,
    backgroundColor: '#FFFFFF',
    borderRightColor: '#EAECF0',
  },
  companySection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  companyAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#155A03',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  companyInitial: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Albert Sans',
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#667085',
    marginBottom: 4,
    fontFamily: 'Albert Sans',
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0C111D',
    textAlign: 'center',
    fontFamily: 'Albert Sans',
  },
  statusCardsContainer: {
    gap: 12,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAECF0',
    gap: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  watermarkContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    opacity: 0.1,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  watermarkIcon: {
    width: 60,
    height: 60,
    tintColor: '#98A2B3',
  },
  statusCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  statusIcon: {
    width: 20,
    height: 20,
  },
  statusTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#0C111D',
    fontFamily: 'Albert Sans',
    textTransform: 'uppercase',
    lineHeight: 16,
  },
  statusBadgeContainer: {
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Albert Sans',
    textTransform: 'uppercase',
  },
  statusValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0C111D',
    fontFamily: 'Albert Sans',
    marginTop: 4,
  },
  upgradeCardContainer: {
    marginTop: 'auto',
  },
});

export default LeftPanel;
