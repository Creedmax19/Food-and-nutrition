import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Heart, Award, ChefHat, MapPin, Bell, Shield, CircleHelp as HelpCircle, LogOut, CreditCard as Edit, Camera, X, Save } from 'lucide-react-native';

export default function ProfileScreen() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const [userProfile, setUserProfile] = useState({
    name: 'Amara Okafor',
    email: 'amara.okafor@email.com',
    location: 'Lagos, Nigeria',
    joinDate: 'January 2024',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    bio: 'Passionate about African cuisine and sharing family recipes with the world.',
    dietaryPreferences: ['Pescatarian', 'Low Sodium'],
    cookingLevel: 'Intermediate',
    favoriteRegion: 'West Africa',
    healthGoals: ['Weight Management', 'Heart Health']
  });

  const [editForm, setEditForm] = useState({
    name: userProfile.name,
    bio: userProfile.bio,
    location: userProfile.location,
  });

  const [achievements] = useState([
    {
      id: 1,
      title: 'Recipe Explorer',
      description: 'Tried 25 different recipes',
      icon: '🍽️',
      earned: true,
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Cultural Ambassador',
      description: 'Cooked dishes from 4 African regions',
      icon: '🌍',
      earned: true,
      date: '2024-01-20'
    },
    {
      id: 3,
      title: 'Master Chef',
      description: 'Successfully completed 50 recipes',
      icon: '👨‍🍳',
      earned: false,
      progress: 32
    },
    {
      id: 4,
      title: 'Meal Planner',
      description: 'Planned meals for 30 consecutive days',
      icon: '📅',
      earned: false,
      progress: 18
    }
  ]);

  const [stats] = useState({
    recipesCooked: 32,
    mealsPlanned: 156,
    favoriteRecipes: 18,
    streakDays: 12,
    totalCookingTime: '24 hours',
    caloriesSaved: 2400
  });

  const saveProfile = () => {
    setUserProfile(prev => ({
      ...prev,
      name: editForm.name,
      bio: editForm.bio,
      location: editForm.location,
    }));
    setShowEditModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#E07A5F', '#F4A261']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{userProfile.name}</Text>
              <View style={styles.locationContainer}>
                <MapPin size={14} color="#2C1810" />
                <Text style={styles.userLocation}>{userProfile.location}</Text>
              </View>
              <Text style={styles.joinDate}>Member since {userProfile.joinDate}</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setShowEditModal(true)}>
              <Edit size={20} color="#2C1810" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => setShowSettingsModal(true)}>
              <Settings size={20} color="#2C1810" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.userBio}>{userProfile.bio}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <ChefHat size={24} color="#E07A5F" />
            <Text style={styles.statNumber}>{stats.recipesCooked}</Text>
            <Text style={styles.statLabel}>Recipes Cooked</Text>
          </View>
          <View style={styles.statCard}>
            <Heart size={24} color="#F4A261" />
            <Text style={styles.statNumber}>{stats.favoriteRecipes}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statCard}>
            <Award size={24} color="#3D5A80" />
            <Text style={styles.statNumber}>{stats.streakDays}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View 
                key={achievement.id} 
                style={[
                  styles.achievementCard,
                  !achievement.earned && styles.lockedAchievement
                ]}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.earned && styles.lockedText
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDescription,
                  !achievement.earned && styles.lockedText
                ]}>
                  {achievement.description}
                </Text>
                
                {achievement.earned ? (
                  <View style={styles.earnedBadge}>
                    <Text style={styles.earnedText}>Earned</Text>
                  </View>
                ) : (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${(achievement.progress / 50) * 100}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {achievement.progress}/50
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Dietary Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dietary Preferences</Text>
          <View style={styles.preferencesContainer}>
            {userProfile.dietaryPreferences.map((preference, index) => (
              <View key={index} style={styles.preferenceTag}>
                <Text style={styles.preferenceText}>{preference}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.addPreferenceButton}>
              <Text style={styles.addPreferenceText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Health Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Goals</Text>
          <View style={styles.goalsContainer}>
            {userProfile.healthGoals.map((goal, index) => (
              <View key={index} style={styles.goalCard}>
                <Text style={styles.goalText}>{goal}</Text>
                <View style={styles.goalProgress}>
                  <Text style={styles.goalProgressText}>On Track</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Heart size={20} color="#E07A5F" />
              <Text style={styles.actionText}>Favorite Recipes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <ChefHat size={20} color="#3D5A80" />
              <Text style={styles.actionText}>Cooking History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Award size={20} color="#F4A261" />
              <Text style={styles.actionText}>All Achievements</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <HelpCircle size={20} color="#8B7355" />
              <Text style={styles.actionText}>Help & Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <X size={24} color="#2C1810" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Name</Text>
              <TextInput
                style={styles.formInput}
                value={editForm.name}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, name: text }))}
                placeholder="Enter your name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Bio</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={editForm.bio}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, bio: text }))}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Location</Text>
              <TextInput
                style={styles.formInput}
                value={editForm.location}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, location: text }))}
                placeholder="Enter your location"
              />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
              <Save size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={showSettingsModal}
        animationType="slide"
        presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Settings</Text>
            <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
              <X size={24} color="#2C1810" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.settingsSection}>
              <Text style={styles.settingsTitle}>Notifications</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Bell size={20} color="#8B7355" />
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#E0E0E0', true: '#E07A5F' }}
                  thumbColor={notificationsEnabled ? '#FFFFFF' : '#C4C4C4'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <MapPin size={20} color="#8B7355" />
                  <Text style={styles.settingLabel}>Location Services</Text>
                </View>
                <Switch
                  value={locationEnabled}
                  onValueChange={setLocationEnabled}
                  trackColor={{ false: '#E0E0E0', true: '#E07A5F' }}
                  thumbColor={locationEnabled ? '#FFFFFF' : '#C4C4C4'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Shield size={20} color="#8B7355" />
                  <Text style={styles.settingLabel}>Offline Mode</Text>
                </View>
                <Switch
                  value={offlineMode}
                  onValueChange={setOfflineMode}
                  trackColor={{ false: '#E0E0E0', true: '#E07A5F' }}
                  thumbColor={offlineMode ? '#FFFFFF' : '#C4C4C4'}
                />
              </View>
            </View>

            <View style={styles.settingsSection}>
              <Text style={styles.settingsTitle}>Account</Text>
              
              <TouchableOpacity style={styles.settingButton}>
                <Shield size={20} color="#8B7355" />
                <Text style={styles.settingButtonText}>Privacy & Security</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingButton}>
                <HelpCircle size={20} color="#8B7355" />
                <Text style={styles.settingButtonText}>Help & Support</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.settingButton, styles.logoutButton]}>
                <LogOut size={20} color="#F44336" />
                <Text style={[styles.settingButtonText, styles.logoutText]}>
                  Sign Out
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E07A5F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 14,
    color: '#2C1810',
    opacity: 0.8,
  },
  joinDate: {
    fontSize: 12,
    color: '#2C1810',
    opacity: 0.6,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userBio: {
    fontSize: 14,
    color: '#2C1810',
    opacity: 0.8,
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8B7355',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 16,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lockedAchievement: {
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C1810',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#8B7355',
    textAlign: 'center',
    marginBottom: 12,
  },
  lockedText: {
    color: '#C4C4C4',
  },
  earnedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  earnedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E07A5F',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: '#8B7355',
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  preferenceTag: {
    backgroundColor: '#F2CC8F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  preferenceText: {
    fontSize: 12,
    color: '#2C1810',
    fontWeight: '600',
  },
  addPreferenceButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E07A5F',
    borderStyle: 'dashed',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addPreferenceText: {
    fontSize: 12,
    color: '#E07A5F',
    fontWeight: '600',
  },
  goalsContainer: {
    gap: 12,
  },
  goalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalText: {
    fontSize: 16,
    color: '#2C1810',
    fontWeight: '600',
  },
  goalProgress: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  goalProgressText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#2C1810',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E07A5F',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingsSection: {
    marginBottom: 32,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#2C1810',
    fontWeight: '600',
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  settingButtonText: {
    fontSize: 16,
    color: '#2C1810',
    fontWeight: '600',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#F44336',
  },
  logoutText: {
    color: '#F44336',
  },
});