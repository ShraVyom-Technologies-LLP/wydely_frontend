import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../theme/colors';
import DashboardHeader from './dashboard/chatsDashboard/DashboardHeader';

type Contact = {
  id: string;
  name: string;
  mobileNumber: string;
  tags: string;
  source: string;
  status: 'Inactive' | 'Active';
  state: string;
  lastActive: string;
  optedIn: 'Yes' | 'No' | '-';
  mauStatus: 'Active' | 'Inactive';
  conversationStatus: 'Active' | 'Inactive';
};

const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Gungun jangra',
    mobileNumber: '919634272019',
    tags: 'Bagwell Avenue Ocala',
    source: 'WA Business App',
    status: 'Inactive',
    state: 'Handled by Assistant',
    lastActive: '12:34, 29 Sep 2025',
    optedIn: 'Yes',
    mauStatus: 'Inactive',
    conversationStatus: 'Inactive',
  },
  {
    id: '2',
    name: 'Rajan Gupta',
    mobileNumber: '919414360211',
    tags: 'Washburn Baton Rouge',
    source: 'Organic',
    status: 'Inactive',
    state: 'Handled by Assistant',
    lastActive: '12:34, 29 Sep 2025',
    optedIn: 'No',
    mauStatus: 'Active',
    conversationStatus: 'Inactive',
  },
  {
    id: '3',
    name: 'Abhishek Bajaj',
    mobileNumber: '919827838928',
    tags: 'Nest Lane Olivette',
    source: 'WA Business App',
    status: 'Inactive',
    state: 'Handled by Assistant',
    lastActive: '-',
    optedIn: 'Yes',
    mauStatus: 'Active',
    conversationStatus: 'Inactive',
  },
];

const ContactsPage: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(['2']));

  const allSelected = useMemo(() => selectedIds.size === MOCK_CONTACTS.length, [selectedIds.size]);

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
      if (prev.size === MOCK_CONTACTS.length) {
        return new Set();
      }
      return new Set(MOCK_CONTACTS.map((c) => c.id));
    });
  };

  const selectedCount = selectedIds.size;

  return (
    <View style={styles.container}>
      {/* Header */}
      <DashboardHeader onSearchChange={() => {}} onThemeToggle={() => {}} title="Contacts" />

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

          <TouchableOpacity style={styles.broadcastButton}>
            <Text style={styles.broadcastButtonText}>Broadcast</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addContactButton}>
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

          {MOCK_CONTACTS.map((contact, index) => {
            const selected = selectedIds.has(contact.id);
            const rowStyle =
              index === 1 ? styles.rowSelected : index === 2 ? styles.rowSoftSelected : undefined;

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
});

export default ContactsPage;
