import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../theme/colors';
import DashboardHeader from './dashboard/chatsDashboard/DashboardHeader';
import CreateCampaignSidePanel from './CreateCampaignSidePanel';
import AddContactSidePanel from './AddContactSidePanel';
import { apiService, Contact } from '../services/api';
import { useProject } from '../context/ProjectContext';
import { useApiCall } from '../hooks/useApiCall';

const ContactsPage: React.FC = () => {
  const { selectedProject } = useProject();
  const [contactsList, setContactsList] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [isBroadcastPanelOpen, setIsBroadcastPanelOpen] = useState(false);
  const [isAddContactPanelOpen, setIsAddContactPanelOpen] = useState(false);

  const fetchContactsAPI = useApiCall((projectId?: string) => apiService.getContacts(projectId), {
    showErrorToast: true,
    errorMessage: 'Failed to load contacts',
    onSuccess: (data) => {
      if (data) {
        setContactsList(data);
      }
    },
  });

  useEffect(() => {
    if (selectedProject) {
      fetchContactsAPI.execute(selectedProject.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject]);

  const filteredContacts = React.useMemo(() => {
    let filtered = contactsList;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.mobileNumber.includes(searchQuery)
      );
    }

    // Filter by tab (in a real app, this would filter by status)
    // For now, we'll just return all chats
    return filtered;
  }, [contactsList, searchQuery]);

  const allSelected = useMemo(
    () => selectedIds.size === filteredContacts.length && filteredContacts.length > 0,
    [selectedIds.size, filteredContacts.length]
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
      if (prev.size === filteredContacts.length) {
        return new Set();
      }
      return new Set(filteredContacts.map((c) => c.id));
    });
  };

  const selectedCount = selectedIds.size;

  const openBroadcastPanel = () => {
    setIsBroadcastPanelOpen(true);
  };

  const closeBroadcastPanel = () => {
    setIsBroadcastPanelOpen(false);
  };

  const openAddContactPanel = () => {
    setIsAddContactPanelOpen(true);
  };

  const closeAddContactPanel = () => {
    setIsAddContactPanelOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <DashboardHeader onSearchChange={setSearchQuery} onThemeToggle={() => {}} title="Contacts" />

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
          {selectedCount > 0 && (
            <View style={styles.selectedInfoContainer}>
              <Text style={styles.selectedInfoText}>
                {selectedCount} Contact{selectedCount > 1 ? 's' : ''} Selected
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.broadcastButton}
            onPress={openBroadcastPanel}
            disabled={selectedCount === 0}
          >
            <Text style={styles.broadcastButtonText}>Broadcast</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addContactButton} onPress={openAddContactPanel}>
            <Text style={styles.addContactButtonText}>+ Add Contact</Text>
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

            <Text style={[styles.headerCell, styles.nameCol]}>Name</Text>
            <Text style={[styles.headerCell, styles.mobileCol]}>Mobile Number</Text>
            <Text style={[styles.headerCell, styles.tagsCol]}>Tags</Text>
            <Text style={[styles.headerCell, styles.sourceCol]}>Source</Text>
            <Text style={[styles.headerCell, styles.statusCol]}>Status</Text>
            <Text style={[styles.headerCell, styles.stateCol]}>State</Text>
            <Text style={[styles.headerCell, styles.lastActiveCol]}>Last Active</Text>
            <Text style={[styles.headerCell, styles.optedInCol]}>Opted In</Text>
            <Text style={[styles.headerCell, styles.mauStatusCol]}>MAU Status</Text>
            <Text style={[styles.headerCell, styles.waStatusCol]}>WA Conversation Status</Text>
          </View>

          {filteredContacts.map((contact) => {
            const selected = selectedIds.has(contact.id);
            const rowStyle = selected ? styles.rowSelected : styles.rowSoftSelected;

            return (
              <View key={contact.id} style={[styles.tableRow, rowStyle]}>
                <TouchableOpacity
                  style={styles.checkboxCell}
                  onPress={() => handleToggleRow(contact.id)}
                >
                  <View style={[styles.checkbox, selected && styles.checkboxChecked]}>
                    {selected && <View style={styles.checkboxTick} />}
                  </View>
                </TouchableOpacity>

                <Text style={[styles.bodyCell, styles.nameCol]} numberOfLines={1}>
                  {contact.name}
                </Text>
                <Text style={[styles.bodyCell, styles.mobileCol]} numberOfLines={1}>
                  {contact.mobileNumber}
                </Text>
                <Text style={[styles.bodyCell, styles.tagsCol]} numberOfLines={1}>
                  {contact.tags}
                </Text>
                <Text style={[styles.bodyCell, styles.sourceCol]} numberOfLines={1}>
                  {contact.source}
                </Text>
                <View style={[styles.bodyCellStatus, styles.statusCol]}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>{contact.status}</Text>
                </View>
                <Text style={[styles.bodyCell, styles.stateCol]} numberOfLines={1}>
                  {contact.state}
                </Text>
                <Text style={[styles.bodyCell, styles.lastActiveCol]} numberOfLines={1}>
                  {contact.lastActive}
                </Text>
                <Text style={[styles.bodyCell, styles.optedInCol]} numberOfLines={1}>
                  {contact.optedIn}
                </Text>
                <Text style={[styles.bodyCell, styles.mauStatusCol]} numberOfLines={1}>
                  {contact.mauStatus}
                </Text>
                <Text style={[styles.bodyCell, styles.waStatusCol]} numberOfLines={1}>
                  {contact.conversationStatus}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Right slide-in panels */}
      <CreateCampaignSidePanel isOpen={isBroadcastPanelOpen} onClose={closeBroadcastPanel} />
      <AddContactSidePanel isOpen={isAddContactPanelOpen} onClose={closeAddContactPanel} />
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
  selectedInfoContainer: {
    paddingVertical: 2,
  },
  selectedInfoText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FF8D28',
  },
  broadcastButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 6,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  broadcastButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  addContactButton: {
    borderWidth: 1,
    borderColor: '#344054',
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 6,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addContactButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#344054',
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
    width: 215,
  },
  mobileCol: {
    width: 220,
  },
  tagsCol: {
    width: 270,
  },
  sourceCol: {
    width: 220,
  },
  statusCol: {
    width: 112,
  },
  stateCol: {
    width: 177,
  },
  lastActiveCol: {
    width: 141,
  },
  optedInCol: {
    width: 141,
  },
  mauStatusCol: {
    width: 141,
  },
  waStatusCol: {
    width: 166,
  },
  sidePanelOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
  },
  sidePanel: {
    width: 900,
    maxWidth: '100%',
    height: '100%',
    backgroundColor: '#F9FBFC',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: -8, height: 0 },
    elevation: 8,
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sidePanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
  },
  sidePanelTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  sidePanelCloseButton: {
    padding: 4,
    color: '#EAECF0', //grey light
  },
  sidePanelCloseIcon: {
    fontSize: 20,
    color: colors.text,
  },
  sidePanelScroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  sidePanelScrollContent: {
    paddingBottom: 24,
    paddingTop: 24,
    paddingHorizontal: 8,
    gap: 24,
  },
  fieldGroup: {
    width: '100%',
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  fieldRequired: {
    color: colors.error,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: '#FFFFFF',
  },
  previewInput: {
    height: 140,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 16,
    height: 44,
  },
  selectPlaceholder: {
    fontSize: 14,
    color: colors.textLight,
  },
  selectChevron: {
    fontSize: 16,
    color: colors.textLight,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  toggleSwitch: {
    width: 40,
    height: 22,
    borderRadius: 12,
    backgroundColor: '#D0D5DD',
    paddingHorizontal: 2,
    justifyContent: 'center',
  },
  toggleSwitchOn: {
    backgroundColor: colors.primary,
  },
  toggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: 0 }],
  },
  toggleThumbOn: {
    transform: [{ translateX: 16 }],
  },
  toggleLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionGroup: {
    gap: 12,
    marginTop: 16,
  },
  fieldLabelInline: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  startDateRow: {
    flexDirection: 'row',
    gap: 16,
  },
  startDateCol: {
    flex: 1,
  },
  testSection: {
    gap: 16,
  },
  testDividerTop: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D0D5DD',
    marginVertical: 12,
  },
  testDividerBottom: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D0D5DD',
    marginTop: 12,
  },
  testRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 80,
    marginTop: 24,
  },
  testLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  testInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  testInputWrapper: {
    flex: 1,
  },
  testInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    width: 215,
  },
  testSendButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: colors.primary,
    width: 100,
    alignItems: 'center',
  },
  testSendButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  costRow: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F5F7F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  costLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  costValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  excludeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  excludeTextContainer: {
    flex: 1,
  },
  excludeTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  excludeDescription: {
    fontSize: 12,
    color: colors.textMuted,
  },
  sidePanelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#D0D5DD',
  },
  footerCancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#344054',
    minWidth: 168,
    alignItems: 'center',
  },
  footerCancelText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footerPrimaryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.primary,
    minWidth: 168,
    alignItems: 'center',
  },
  footerPrimaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  sidePanelContent: {
    gap: 24,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAECF0',
    backgroundColor: '#FFFFFF',
  },
});

export default ContactsPage;
