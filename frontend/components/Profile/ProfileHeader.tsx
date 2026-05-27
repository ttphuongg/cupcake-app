import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ActivityIndicator, Image } from 'react-native';
import { ChevronLeft, Camera, Edit2 } from 'lucide-react-native';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { useRouter } from 'expo-router';

interface ProfileHeaderProps {
  user: any;
  isEditing: boolean;
  isLoading: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onPickImage?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isEditing,
  isLoading,
  onEdit,
  onCancel,
  onSave,
  onPickImage,
}) => {
  const router = useRouter();
  
  return (
    <View style={styles.pinkHeader}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <ChevronLeft size={28} color={Colors.white} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.avatarContainer} 
        onPress={onPickImage} 
        disabled={isLoading || !isEditing}
      >
        {user?.avatar_url ? (
          <Image source={{ uri: user.avatar_url }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{(user?.name ?? 'U')[0].toUpperCase()}</Text>
          </View>
        )}
        {isEditing && (
          <View style={styles.cameraIconBadge}>
            <Camera size={14} color={Colors.mutedForeground} />
          </View>
        )}
      </TouchableOpacity>
      
      {!isEditing ? (
        <TouchableOpacity style={styles.editPillBtn} onPress={onEdit}>
          <Edit2 size={14} color={Colors.white} style={{ marginRight: 6 }} />
          <Text style={styles.editPillText}>Sửa hồ sơ</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.editActions}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelEditBtn}>
            <Text style={styles.cancelEditText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSave} style={[styles.saveBtn, isLoading && { opacity: 0.7 }]} disabled={isLoading}>
            {isLoading ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.saveBtnText}>Lưu</Text>}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pinkHeader: {
    backgroundColor: '#E8A0BF', // Solid pink matching Figma
    paddingTop: Platform.OS === 'android' ? 44 : 54,
    paddingHorizontal: 16,
    paddingBottom: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  backBtn: { position: 'absolute', top: Platform.OS === 'android' ? 44 : 54, left: 16, zIndex: 10 },
  avatarContainer: { position: 'relative', marginTop: 20, marginBottom: 12 },
  avatarCircle: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.white,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarImage: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.white,
  },
  avatarLetter: { fontSize: 36, fontWeight: '800', color: Colors.primary },
  cameraIconBadge: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: Colors.white, width: 26, height: 26, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center', ...Shadows.sm,
  },
  editPillBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.xl,
  },
  editPillText: { color: Colors.white, fontSize: 13, fontWeight: '600' },
  editActions: { flexDirection: 'row', gap: 8 },
  cancelEditBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.md, backgroundColor: Colors.white },
  cancelEditText: { fontSize: 13, color: Colors.primaryDark, fontWeight: '600' },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: Radius.md, backgroundColor: Colors.primaryDark, minWidth: 50, alignItems: 'center' },
  saveBtnText: { fontSize: 13, color: 'white', fontWeight: '700' },
});
