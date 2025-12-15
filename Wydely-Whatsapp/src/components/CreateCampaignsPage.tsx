import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface CampaignCardProps {
  title: string;
  description: string;
  iconColor: string;
  iconImage: any;
  onPress?: () => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  title,
  description,
  iconColor,
  iconImage,
  onPress,
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
      <Image source={iconImage} style={styles.iconImage} resizeMode="contain" />
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
  </TouchableOpacity>
);

const CreateCampaignsPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleCampaignPress = (campaignId: string) => {
    if (campaignId === 'broadcast') {
      navigation.navigate('BroadcastCampaign');
    } else {
      console.log(`Selected: ${campaignId}`);
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Dashboard', { initialIcon: 'campaigns' });
    }
  };

  const campaigns = [
    {
      id: 'broadcast',
      title: 'Broadcast Campaign',
      description:
        'Choose and filter your existing audience to send personalized template or regular messages.',
      iconColor: '#6898FF',
      iconImage: require('../../assets/images/broadcast_campaign.png'),
    },
    {
      id: 'api',
      title: 'API',
      description:
        'Select a template and integrate your existing systems with our API for automated messaging.',
      iconColor: '#FB923C',
      iconImage: require('../../assets/images/api_campaign.png'),
    },
    {
      id: 'csv',
      title: 'CSV Broadcast',
      description:
        'Upload your audience via CSV to send personalized template or regular messages in bulk.',
      iconColor: '#FBBF24',
      iconImage: require('../../assets/images/csv_campaign.png'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={handleBack}>
          <ArrowLeftIcon width={24} height={24} style={{ marginRight: 4 }} />
          <Text style={styles.headerTitle}>Campaigns</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.heading}>Choose Your Campaign Type</Text>
          </View>
          <View style={styles.cardsContainer}>
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                title={campaign.title}
                description={campaign.description}
                iconColor={campaign.iconColor}
                iconImage={campaign.iconImage}
                onPress={() => handleCampaignPress(campaign.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  },
  pageHeader: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(28, 28, 28, 0.1)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1C',
    fontFamily: 'Albert Sans',
    lineHeight: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  content: {
    width: '100%',
    maxWidth: 960,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F2F9',
    padding: 48,
  },
  header: {
    marginBottom: 32,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#170F49',
    fontFamily: 'Albert Sans',
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  card: {
    flex: 1,
    minWidth: 250,
    maxWidth: 288,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F2F9',
    padding: 20,
    alignItems: 'center',
    gap: 29,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#170F49',
    textAlign: 'center',
    fontFamily: 'Albert Sans',
  },
  cardDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6F6C8F',
    textAlign: 'center',
    lineHeight: 16.8,
    fontFamily: 'Albert Sans',
  },
});

export default CreateCampaignsPage;
