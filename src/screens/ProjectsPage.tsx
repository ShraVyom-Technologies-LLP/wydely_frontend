import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import colors from '../theme/colors';
import { RootStackParamList } from '../navigation/types';
import { useProject } from '../context/ProjectContext';
import { useApiCall } from '../hooks/useApiCall';
import { apiService } from '../services/api';
import { Project } from '../utils/types';
import LoadingWidget from '../components/LoadingWidget';
import WydelyLogoIcon from '../../assets/images/Wydely.png';

type ProjectsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Projects'>;

// Status icons as simple text for now (can be replaced with SVG icons later)
const VerifiedIcon = () => (
  <View style={styles.statusIcon}>
    <Text style={styles.statusIconText}>✓</Text>
  </View>
);

const PendingIcon = () => (
  <View style={styles.statusIcon}>
    <Text style={styles.statusIconText}>⏱</Text>
  </View>
);

const ArrowRightIcon = () => (
  <View style={styles.arrowIcon}>
    <Text style={styles.arrowIconText}>→</Text>
  </View>
);

interface ProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onView }) => {
  const isVerified = project.status === 'verified';
  // Soft tint gradient overlay: white base card + transparent gradient overlay
  // Verified: soft green tint from top-left
  // Pending: soft grey tint from top-left
  const gradientColors: [string, string, string] = isVerified
    ? [
        'rgba(218, 237, 213, 0.55)', // stronger green tint (top-left)
        'rgba(255, 255, 255, 0.95)', // almost white
        '#FFFFFF', // pure white
      ]
    : [
        'rgba(208, 213, 221, 0.55)', // stronger grey tint (top-left)
        'rgba(255, 255, 255, 0.95)', // almost white
        '#FFFFFF', // pure white
      ];
  // Stretch the green/grey color further by moving the transition point later
  const gradientLocations: [number, number, number] = [0, 0.85, 1.0];

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      return `Created at ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    } catch {
      return `Created at ${dateString}`;
    }
  };

  const cardContent = (
    <>
      <View style={styles.cardHeader}>
        <View style={styles.phoneBadge}>
          <Text style={styles.phoneBadgeText}>{project.wabaPhoneNumber}</Text>
        </View>
        <View style={styles.statusContainer}>
          {isVerified ? <VerifiedIcon /> : <PendingIcon />}
          <Text style={[styles.statusText, isVerified && styles.statusTextVerified]}>
            {isVerified ? 'Verified' : 'Pending'}
          </Text>
        </View>
      </View>

      <Text style={styles.projectName}>{project.name}</Text>

      <Text style={styles.activePlan}>
        <Text style={styles.activePlanLabel}>Active Plan:</Text>{' '}
        <Text style={styles.activePlanValue}>{project.activePlan}</Text>
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.createdDate}>{formatDate(project.createdAt)}</Text>
        <Pressable
          style={styles.viewButton}
          onPress={() => onView(project)}
          android_ripple={{ color: colors.primaryMuted }}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </Pressable>
      </View>
    </>
  );

  // White base card with gradient overlay (works on both web and native)
  return (
    <View style={styles.projectCard}>
      {/* Soft tint gradient overlay */}
      <LinearGradient
        colors={gradientColors}
        locations={gradientLocations}
        start={{ x: 0.05, y: 0.0 }}
        end={{ x: 0.95, y: 1.0 }}
        style={styles.gradientOverlay}
        pointerEvents="none"
      />
      {cardContent}
    </View>
  );
};

export default function ProjectsPage() {
  const navigation = useNavigation<ProjectsScreenNavigationProp>();
  const { projects, setSelectedProject, refreshProjects, isLoading } = useProject();
  const [projectName, setProjectName] = useState('');

  // Note: Projects are automatically loaded by ProjectContext on mount
  // No need to call refreshProjects() here to avoid duplicate API calls

  const createProjectApi = useApiCall((name: string) => apiService.createProject({ name }), {
    showErrorToast: true,
    errorMessage: 'Failed to create project',
    onSuccess: () => {
      setProjectName('');
      refreshProjects();
    },
  });

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;
    await createProjectApi.execute(projectName.trim());
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    navigation.navigate('Dashboard');
  };

  // Get user name from localStorage or use default
  const getUserName = () => {
    if (typeof window !== 'undefined') {
      // Try to get from user profile or use default
      return 'Abhinav'; // This should come from user context/profile
    }
    return 'User';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={WydelyLogoIcon} style={styles.logo} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome, {getUserName()}</Text>
        </View>

        {/* Main Content Card */}
        <View style={styles.mainCard}>
          {/* Create New Project Section - Single Line */}
          <View style={styles.createSection}>
            <View style={styles.createRow}>
              <Text style={styles.createTitle}>Create New Project</Text>
              <TextInput
                style={styles.createInput}
                placeholder="Enter Project Name"
                placeholderTextColor={colors.textLight}
                value={projectName}
                onChangeText={setProjectName}
                onSubmitEditing={handleCreateProject}
                returnKeyType="done"
              />
              <Pressable
                style={[
                  styles.createButton,
                  (!projectName.trim() || createProjectApi.isLoading) &&
                    styles.createButtonDisabled,
                ]}
                onPress={handleCreateProject}
                disabled={!projectName.trim() || createProjectApi.isLoading}
                android_ripple={{ color: colors.primaryDark }}
              >
                <Text style={styles.createButtonText}>
                  {createProjectApi.isLoading ? 'Creating...' : 'Create'}
                </Text>
                <ArrowRightIcon />
              </Pressable>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Projects Grid */}
            <View style={styles.projectsGrid}>
              {isLoading && projects.length === 0 ? (
                <LoadingWidget />
              ) : projects.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No projects yet</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Create your first project to get started
                  </Text>
                </View>
              ) : (
                projects.map((project) => (
                  <ProjectCard key={project.id} project={project} onView={handleViewProject} />
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  },
  header: {
    height: 56,
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(28, 28, 28, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  logoContainer: {
    height: 28,
    width: 88,
  },
  logo: {
    width: 88,
    height: 28,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
    paddingLeft: 121,
    paddingRight: 121,
  },
  welcomeSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 34,
  },
  mainCard: {
    marginHorizontal: 24,
    marginTop: 20,
    backgroundColor: colors.bg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F2F9',
    shadowColor: 'rgba(25, 33, 61, 0.06)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    padding: 48,
  },
  createSection: {
    gap: 32,
  },
  createRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    width: '100%',
  },
  createTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 23,
    minWidth: 180,
    marginRight: 600,
  },
  createInput: {
    flex: 1,
    height: 44,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.text,
    shadowColor: 'rgba(25, 33, 61, 0.04)',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 1,
    ...(Platform.OS === 'web' &&
      ({
        outline: 'none',
      } as any)),
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 17,
    borderRadius: 8,
    minWidth: 121,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 25,
  },
  arrowIcon: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIconText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    borderTopWidth: 1,
    borderTopColor: '#98A2B3',
    borderStyle: 'dashed',
    ...(Platform.OS === 'web' && {
      borderStyle: 'dashed',
      borderTopStyle: 'dashed',
    }),
  },
  projectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  projectCard: {
    width: 448,
    minHeight: 218,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF', // IMPORTANT: white base card
    borderWidth: 1,
    borderColor: '#F1F2F9',
    shadowColor: 'rgba(74, 58, 255, 0.06)',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 3,
    gap: 20,
    overflow: 'hidden', // IMPORTANT: clip gradient to rounded corners
    position: 'relative',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phoneBadge: {
    backgroundColor: 'rgba(83, 112, 212, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  phoneBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4338CA',
    textTransform: 'uppercase',
    lineHeight: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconText: {
    fontSize: 14,
    color: colors.primary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#101828',
    lineHeight: 15,
  },
  statusTextVerified: {
    color: colors.primary,
  },
  projectName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#170F49',
    lineHeight: 24,
  },
  activePlan: {
    fontSize: 14,
    fontWeight: '600',
    color: '#170F49',
    lineHeight: 24,
  },
  activePlanLabel: {
    color: '#475467',
  },
  activePlanValue: {
    color: colors.text,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  createdDate: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textLight,
    lineHeight: 24,
  },
  viewButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 17,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 107,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    lineHeight: 25,
  },
  emptyState: {
    width: '100%',
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
