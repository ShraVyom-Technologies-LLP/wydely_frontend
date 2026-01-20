import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import colors from '../theme/colors';
import { TemplateOption } from '../services/api';
import LoadingScreen from './LoadingScreen';
import templateImage from '../../assets/images/template_img.png';
import defaultTemplateImage from '../../assets/images/template_image_default.png';

type StatusTab = 'explore' | 'all' | 'draft' | 'pending' | 'approved' | 'actionRequired';
type FilterChip = 'trending' | 'general' | 'topRated' | 'ecommerce' | 'education' | 'banking';

interface TemplateMessageListProps {
  loading: boolean;
  error: string | null;
  templates: TemplateOption[];
  filteredTemplates: TemplateOption[];
  activeStatusTab: StatusTab;
  setActiveStatusTab: (tab: StatusTab) => void;
  activeFilter: FilterChip | null;
  setActiveFilter: (filter: FilterChip | null) => void;
  searchQuery: string;
  onPreviewTemplate: (template: TemplateOption) => void;
  statusTabs: { id: StatusTab; label: string }[];
  filterChips: { id: FilterChip; label: string }[];
  fetchTemplates: () => void;
}

const TemplateMessageList: React.FC<TemplateMessageListProps> = ({
  loading,
  error,
  templates,
  filteredTemplates,
  activeStatusTab,
  setActiveStatusTab,
  activeFilter,
  setActiveFilter,
  searchQuery,
  onPreviewTemplate,
  statusTabs,
  filterChips,
  fetchTemplates,
}) => {
  if (loading && templates.length === 0) {
    return <LoadingScreen message="Loading templates..." error={null} onRetry={undefined} />;
  }

  if (error && templates.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTemplates}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.templateContent}>
      {/* Status Tabs */}
      <View style={styles.statusTabsContainer}>
        {statusTabs.map((tab) => {
          const isActive = activeStatusTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.statusTab, isActive && styles.statusTabActive]}
              onPress={() => setActiveStatusTab(tab.id)}
            >
              <Text style={[styles.statusTabText, isActive && styles.statusTabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Filter Chips */}
      <View style={styles.filterChipsContainer}>
        {filterChips.map((chip) => {
          const isActive = activeFilter === chip.id;
          return (
            <TouchableOpacity
              key={chip.id}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setActiveFilter(isActive ? null : chip.id)}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Template Grid */}
      <ScrollView
        style={styles.templateGridScroll}
        contentContainerStyle={styles.templateGridContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTemplates.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No templates found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try adjusting your search' : 'No templates available'}
            </Text>
          </View>
        ) : (
          <View style={styles.templateGrid}>
            {filteredTemplates.map((template) => (
              <View key={template.id} style={styles.templateCard}>
                <Text style={styles.templateCardTitle}>{template.title}</Text>

                {/* Image placeholder - replace with actual image when available */}
                {template.content.image ? (
                  <View style={styles.templateImageContainer}>
                    <Image source={templateImage} style={styles.templateImagePlaceholder} />
                  </View>
                ) : (
                  <View style={styles.templateImageContainer}>
                    <Image source={defaultTemplateImage} style={styles.templateImagePlaceholder} />
                  </View>
                )}

                {/* Badges */}
                <View style={styles.templateBadges}>
                  {template.content.text && (
                    <View style={[styles.badge, styles.badgeText]}>
                      <Text style={styles.badgeTextLabel}>Text</Text>
                    </View>
                  )}
                  {template.content.image && (
                    <View style={[styles.badge, styles.badgeImage]}>
                      <Text style={styles.badgeImageLabel}>Image</Text>
                    </View>
                  )}
                  {template.content.button && (
                    <View style={[styles.badge, styles.badgeButton]}>
                      <Text style={styles.badgeButtonLabel}>Button</Text>
                    </View>
                  )}
                </View>

                {/* Template Content */}
                <Text style={styles.templateCardContent} numberOfLines={4}>
                  {template.message}
                </Text>

                {/* Action Buttons */}
                <View style={styles.templateCardActions}>
                  <TouchableOpacity
                    style={styles.previewButton}
                    onPress={() => onPreviewTemplate(template)}
                  >
                    <Text style={styles.previewButtonText}>Preview</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selectButton}>
                    <Text style={styles.selectButtonText}>Select</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  templateContent: {
    flex: 1,
  },
  statusTabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#EAECF0',
    paddingHorizontal: 16,
    alignItems: 'center',
    height: 44,
    gap: 28,
  },
  statusTab: {
    height: 44,
    justifyContent: 'center',
    paddingVertical: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  statusTabActive: {
    borderBottomColor: '#155A03',
  },
  statusTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#667085',
    fontFamily: 'Albert Sans',
  },
  statusTabTextActive: {
    fontWeight: '600',
    color: '#155A03',
  },
  filterChipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    height: 35,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: '#DBD8FF',
    borderColor: '#4338CA',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475467',
    fontFamily: 'Albert Sans',
  },
  filterChipTextActive: {
    fontWeight: '600',
    color: '#4338CA',
  },
  templateGridScroll: {
    flex: 1,
  },
  templateGridContent: {
    padding: 24,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  templateCard: {
    width: 277,
    backgroundColor: colors.bg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAECF0',
    padding: 24,
    gap: 20,
  },
  templateCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1C',
    fontFamily: 'Albert Sans',
  },
  templateImageContainer: {
    width: '100%',
    height: 96,
    borderRadius: 8,
    overflow: 'hidden',
  },
  templateImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F7F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateBadges: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  badge: {
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    backgroundColor: '#E2FFEB',
    borderWidth: 1,
    borderColor: '#00932C',
  },
  badgeTextLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#00932C',
    fontFamily: 'Albert Sans',
  },
  badgeImage: {
    backgroundColor: '#FFEFF8',
    borderWidth: 1,
    borderColor: '#CA388B',
  },
  badgeImageLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#CA388B',
    fontFamily: 'Albert Sans',
  },
  badgeButton: {
    backgroundColor: '#E5EFFF',
    borderWidth: 1,
    borderColor: '#3E88FF',
  },
  badgeButtonLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3E88FF',
    fontFamily: 'Albert Sans',
  },
  templateCardContent: {
    fontSize: 12,
    fontWeight: '400',
    color: '#344054',
    lineHeight: 16,
    fontFamily: 'Albert Sans',
  },
  templateCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  previewButton: {
    flex: 1,
    height: 28,
    borderWidth: 1,
    borderColor: '#344054',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#344054',
    fontFamily: 'Albert Sans',
  },
  selectButton: {
    flex: 1,
    height: 28,
    backgroundColor: '#155A03',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Albert Sans',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textMuted,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default TemplateMessageList;
