import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import colors from '../theme/colors';
import DashboardHeader from './dashboard/chatsDashboard/DashboardHeader';
import { RootStackParamList } from '../navigation/types';
import { apiService, Campaign } from '../services/api';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ExistingCampaignsPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [campaignsList, setCampaignsList] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const fetchCampaigns = async () => {
      const result = await apiService.getExistingCampaigns();
      if (result.success) {
        setCampaignsList(result.data ?? []);
      }
    };
    fetchCampaigns();
  }, []);

  const filteredCampaigns = useMemo(() => {
    let filtered = campaignsList;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((campaign) =>
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by tab (in a real app, this would filter by status)
    // For now, we'll just return all chats
    return filtered;
  }, [campaignsList, searchQuery]);

  const allSelected = useMemo(
    () => selectedIds.size === filteredCampaigns.length,
    [selectedIds.size, filteredCampaigns.length]
  );

  const handleToggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleAll = () => {
    setSelectedIds((prev) => {
      if (prev.size === filteredCampaigns.length) {
        return new Set();
      }
      return new Set(filteredCampaigns.map((c) => c.id));
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <DashboardHeader onSearchChange={setSearchQuery} onThemeToggle={() => {}} title="Campaigns" />

      {/* Sub-header row */}
      <View style={styles.subHeader}>
        <View style={styles.subHeaderLeft}>
          <TouchableOpacity style={styles.subHeaderTab}>
            <Text style={styles.subHeaderTabText}>All</Text>
            <View style={styles.subHeaderTabBadge}>
              <Text style={styles.subHeaderTabBadgeText}>1</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.subHeaderRight}>
          <TouchableOpacity
            style={styles.newCampaignButton}
            onPress={() => navigation.navigate('CreateCampaigns')}
          >
            <Text style={styles.newCampaignButtonText}>New Campaign</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Table */}
      <ScrollView horizontal bounces={false} contentContainerStyle={styles.tableScrollContent}>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <TouchableOpacity
              style={[styles.checkboxCell, styles.headerCheckboxCell]}
              onPress={handleToggleAll}
            >
              <View style={[styles.checkbox, allSelected && styles.checkboxChecked]}>
                {allSelected && <View style={styles.checkboxTick} />}
              </View>
            </TouchableOpacity>

            <Text style={[styles.headerCell, styles.nameCol]}>Campaign Name</Text>
            <Text style={[styles.headerCell, styles.typeCol]}>Type</Text>
            <Text style={[styles.headerCell, styles.createdCol]}>Created At</Text>
            <Text style={[styles.headerCell, styles.statusCol]}>Status</Text>
            <Text style={[styles.headerCell, styles.audienceCol]}>Audience</Text>
          </View>

          {filteredCampaigns.map((campaign) => {
            const selected = selectedIds.has(campaign.id);
            const rowStyle = selected ? styles.rowSelected : styles.rowSoftSelected;

            return (
              <View key={campaign.id} style={[styles.tableRow, rowStyle]}>
                <TouchableOpacity
                  style={styles.checkboxCell}
                  onPress={() => handleToggleRow(campaign.id)}
                >
                  <View style={[styles.checkbox, selected && styles.checkboxChecked]}>
                    {selected && <View style={styles.checkboxTick} />}
                  </View>
                </TouchableOpacity>

                <Text style={[styles.bodyCell, styles.nameCol]} numberOfLines={1}>
                  {campaign.name}
                </Text>
                <Text style={[styles.bodyCell, styles.typeCol]} numberOfLines={1}>
                  {campaign.type === 'broadcast' ? 'Broadcast' : 'API'}
                </Text>
                <Text style={[styles.bodyCell, styles.createdCol]} numberOfLines={1}>
                  {campaign.createdAt}
                </Text>
                <View style={[styles.bodyCellStatus, styles.statusCol]}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>{campaign.status}</Text>
                </View>
                <Text style={[styles.bodyCell, styles.audienceCol]} numberOfLines={1}>
                  {campaign.audience}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#EAECF0', // Grey/100 from design
    height: 44,
  },
  subHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subHeaderTab: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingVertical: 4,
    gap: 6,
  },
  subHeaderTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  subHeaderTabBadge: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subHeaderTabBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  subHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  newCampaignButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 6,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newCampaignButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  tableScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  table: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(28,28,28,0.05)',
    backgroundColor: '#FFFFFF',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(28,28,28,0.2)',
    minHeight: 40,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(28,28,28,0.05)',
  },
  rowSelected: {
    backgroundColor: '#DAEDD5', // Primary/100
  },
  rowSoftSelected: {
    backgroundColor: '#F7F9FB', // primary/light from design
  },
  checkboxCell: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCheckboxCell: {},
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(28,28,28,0.4)',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#0B2E02',
    borderColor: '#0B2E02',
  },
  checkboxTick: {
    position: 'absolute',
    left: 4,
    top: 3,
    width: 8,
    height: 5,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }],
  },
  headerCell: {
    fontSize: 12,
    color: 'rgba(28,28,28,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bodyCell: {
    fontSize: 12,
    color: '#0C111D',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bodyCellStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#98A2B3',
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#344054',
  },
  nameCol: {
    width: 360,
  },
  typeCol: {
    width: 270,
  },
  createdCol: {
    width: 390,
  },
  statusCol: {
    width: 200,
  },
  audienceCol: {
    width: 380,
  },
});

export default ExistingCampaignsPage;
