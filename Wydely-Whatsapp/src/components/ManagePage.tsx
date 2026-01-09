import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Linking,
} from 'react-native';
import colors from '../theme/colors';
import { apiService, TemplateOption } from '../services/api';
import { useApiCall } from '../hooks/useApiCall';
import SearchIconHeader from './icons/SearchIconHeader';
import SunIconHeader from './icons/SunIconHeader';
import CloseIcon from './icons/CloseIcon';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import CreateTemplateSidePanel from './CreateTemplateSidePanel';
import TemplateMessageList from './TemplateMessageList';
import nav_item_7 from '../../assets/images/nav_item_7.png';

type StatusTab = 'explore' | 'all' | 'draft' | 'pending' | 'approved' | 'actionRequired';
type FilterChip = 'trending' | 'general' | 'topRated' | 'ecommerce' | 'education' | 'banking';
type SidebarNav =
  | 'template'
  | 'optin'
  | 'liveChat'
  | 'campaign'
  | 'agents'
  | 'apiKey'
  | 'billing'
  | 'notifications';

const ManagePage: React.FC = () => {
  const [activeSidebarNav, setActiveSidebarNav] = useState<SidebarNav>('template');
  const [activeStatusTab, setActiveStatusTab] = useState<StatusTab>('explore');
  const [activeFilter, setActiveFilter] = useState<FilterChip | null>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateOption | null>(null);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [isCreateTemplatePanelOpen, setIsCreateTemplatePanelOpen] = useState(false);

  const fetchTemplatesAPI = useApiCall(() => apiService.getAllTemplates(), {
    showErrorToast: true,
    errorMessage: 'Failed to load templates',
    onSuccess: (data) => {
      if (data) {
        setTemplates(data);
      }
    },
  });

  const loading = fetchTemplatesAPI.isLoading;
  const error = fetchTemplatesAPI.error;

  useEffect(() => {
    if (activeSidebarNav === 'template') {
      fetchTemplatesAPI.execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSidebarNav]);

  const filteredTemplates = React.useMemo(() => {
    let filtered = templates;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (template) =>
          template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status tab (for now, just return all - can be enhanced later)
    // Filter by filter chip (for now, just return all - can be enhanced later)

    return filtered;
  }, [templates, searchQuery]);

  const sidebarNavItems: { id: SidebarNav; label: string }[] = [
    { id: 'template', label: 'Template Message' },
    { id: 'optin', label: 'Optin Management' },
    { id: 'liveChat', label: 'Live Chat Settings' },
    { id: 'campaign', label: 'Campaign Settings' },
    { id: 'agents', label: 'Agents' },
    { id: 'apiKey', label: 'API Key' },
    { id: 'billing', label: 'Billing & Usage' },
    { id: 'notifications', label: 'Notification Preferences' },
  ];

  const statusTabs: { id: StatusTab; label: string }[] = [
    { id: 'explore', label: 'Explore' },
    { id: 'all', label: 'All' },
    { id: 'draft', label: 'Draft' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'actionRequired', label: 'Action Required' },
  ];

  const filterChips: { id: FilterChip; label: string }[] = [
    { id: 'trending', label: 'Trending' },
    { id: 'general', label: 'General' },
    { id: 'topRated', label: 'Top Rated' },
    { id: 'ecommerce', label: 'Ecommerce' },
    { id: 'education', label: 'Education' },
    { id: 'banking', label: 'Banking' },
  ];

  const renderContent = () => {
    switch (activeSidebarNav) {
      case 'template':
        return (
          <TemplateMessageList
            loading={loading}
            error={error}
            templates={templates}
            filteredTemplates={filteredTemplates}
            activeStatusTab={activeStatusTab}
            setActiveStatusTab={setActiveStatusTab}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            searchQuery={searchQuery}
            onPreviewTemplate={(template) => {
              setPreviewTemplate(template);
              setIsPreviewModalVisible(true);
            }}
            statusTabs={statusTabs}
            filterChips={filterChips}
            fetchTemplates={fetchTemplatesAPI.execute}
          />
        );
      default:
        return (
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderText}>
              {sidebarNavItems.find((n) => n.id === activeSidebarNav)?.label}
            </Text>
            <Text style={styles.placeholderSubtext}>Coming soon</Text>
          </View>
        );
    }
  };

  const renderPreviewModal = () => {
    if (!previewTemplate) return null;

    return (
      <Modal
        visible={isPreviewModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsPreviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>Message Preview</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setIsPreviewModalVisible(false)}
              >
                <CloseIcon width={24} height={24} color="#1C1C1C" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.modalContent}>
              <View style={styles.messagePreviewContainer}>
                {/* Avatar and Message */}
                <View style={styles.messageRow}>
                  {/* Avatar */}
                  <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                      <View style={styles.avatarIcon} />
                    </View>
                  </View>

                  {/* Message Bubble */}
                  <View style={styles.messageBubbleContainer}>
                    <View style={styles.messageBubble}>
                      <Text style={styles.messageText}>{previewTemplate.message}</Text>
                    </View>
                    {/* External Link Button */}
                    {previewTemplate.content.button && previewTemplate.buttonText && (
                      <TouchableOpacity
                        style={styles.externalLinkButton}
                        onPress={async () => {
                          if (previewTemplate.buttonCta) {
                            try {
                              const canOpen = await Linking.canOpenURL(previewTemplate.buttonCta);
                              if (canOpen) {
                                await Linking.openURL(previewTemplate.buttonCta);
                              }
                            } catch (error) {
                              console.error('Error opening URL:', error);
                            }
                          }
                        }}
                      >
                        <ExternalLinkIcon width={16} height={16} color="#4C9EDC" />
                        <Text style={styles.externalLinkText}>{previewTemplate.buttonText}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Use Template Button */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.useTemplateButton}
                    onPress={() => {
                      // Handle use template action
                      setIsPreviewModalVisible(false);
                    }}
                  >
                    <Text style={styles.useTemplateButtonText}>Use this Template</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* Left Sidebar */}
      <View style={styles.sidebar}>
        {/* Sidebar Header */}
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarHeaderTitle}>Manage</Text>
        </View>
        <View style={styles.sidebarContent}>
          {sidebarNavItems.map((item) => {
            const isActive = activeSidebarNav === item.id;
            return (
              <React.Fragment key={item.id}>
                <TouchableOpacity
                  style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
                  onPress={() => setActiveSidebarNav(item.id)}
                >
                  <Image source={nav_item_7} style={styles.sidebarItemImage} />
                  <Text style={[styles.sidebarItemText, isActive && styles.sidebarItemTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
                {item.id !== sidebarNavItems[sidebarNavItems.length - 1].id && (
                  <View style={styles.sidebarDivider} />
                )}
              </React.Fragment>
            );
          })}
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {sidebarNavItems.find((item) => item.id === activeSidebarNav)?.label || 'Manage'}
          </Text>
          {activeSidebarNav === 'template' && (
            <View style={styles.headerCenter}>
              <View style={styles.searchContainer}>
                <SearchIconHeader width={16} height={16} color="rgba(28, 28, 28, 0.20)" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  placeholderTextColor="rgba(28, 28, 28, 0.20)"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity
                style={styles.createTemplateButton}
                onPress={() => setIsCreateTemplatePanelOpen(true)}
              >
                <Text style={styles.createTemplateButtonText}>+ New Template</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.themeButton}>
            <SunIconHeader width={20} height={20} color="#1C1C1C" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {renderContent()}
      </View>

      {/* Preview Modal */}
      {renderPreviewModal()}

      {/* Create Template Side Panel */}
      <CreateTemplateSidePanel
        isOpen={isCreateTemplatePanelOpen}
        onClose={() => setIsCreateTemplatePanelOpen(false)}
        onTemplateCreated={() => {
          fetchTemplatesAPI.execute();
          setIsCreateTemplatePanelOpen(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F9FBFC',
  },
  sidebarItemImage: {
    width: 20,
    height: 20,
  },
  sidebar: {
    width: 255,
    backgroundColor: colors.bg,
    borderRightWidth: 1,
    borderRightColor: '#EAECF0',
  },
  sidebarHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(28, 28, 28, 0.10)',
  },
  sidebarHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1C',
    fontFamily: 'Albert Sans',
  },
  sidebarContent: {
    flex: 1,
  },
  sidebarItem: {
    height: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.bg,
    gap: 12,
  },
  sidebarItemActive: {
    backgroundColor: 'rgba(218, 237, 213, 0.7)',
  },
  sidebarItemText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#101828',
    fontFamily: 'Albert Sans',
  },
  sidebarItemTextActive: {
    fontWeight: '500',
    color: '#0B2E02',
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: '#EAECF0',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(28, 28, 28, 0.10)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1C',
    fontFamily: 'Albert Sans',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 28, 28, 0.05)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
    width: 310,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#000000',
    fontFamily: 'Albert Sans',
    padding: 0,
  },
  createTemplateButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#155A03',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createTemplateButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Albert Sans',
  },
  themeButton: {
    padding: 0,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 450,
    backgroundColor: '#F9FBFC',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    height: 74,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: colors.bg,
    borderBottomWidth: 2,
    borderBottomColor: '#F5F5F5',
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#101828',
    fontFamily: 'Manrope',
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 24,
  },
  messagePreviewContainer: {
    gap: 24,
  },
  messageRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  avatarContainer: {
    width: 36,
    height: 36,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBD8FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4338CA',
  },
  messageBubbleContainer: {
    flex: 1,
    gap: 4,
  },
  messageBubble: {
    backgroundColor: '#DCE6FF',
    borderRadius: 12,
    padding: 12,
    maxWidth: 330,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0C111D',
    lineHeight: 16.1,
    fontFamily: 'Albert Sans',
  },
  externalLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  externalLinkText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4C9EDC',
    fontFamily: 'Albert Sans',
  },
  modalActions: {
    borderTopWidth: 1,
    borderTopColor: '#D0D5DD',
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  useTemplateButton: {
    backgroundColor: '#155A03',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 168,
  },
  useTemplateButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Albert Sans',
  },
});

export default ManagePage;
