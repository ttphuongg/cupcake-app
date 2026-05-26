import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ActivityIndicator, Image } from 'react-native';
import { ChevronLeft, Camera, Edit2 } from 'lucide-react-native';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { BASE_URL } from '@/constants/config';

interface ProfileHeaderProps {
  user: any;
  isEditing: boolean;
  isLoading: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onPickImage?: () => void;
  editData?: any;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isEditing,
  isLoading,
  onEdit,
  onCancel,
  onSave,
  onPickImage,
  editData,
}) => {
  const router = useRouter();

  const currentAvatarUrl = editData?.avatar_url || user?.avatar_url;
  const SERVER_URL = BASE_URL.replace('/api/v1', '');
  // Xử lý đường dẫn tương đối (backend trả về /uploads/avatars/...)
  const fullAvatarUrl = currentAvatarUrl 
    ? (currentAvatarUrl.startsWith('http') ? currentAvatarUrl : `${SERVER_URL}${currentAvatarUrl}`)
    : null;
  
  return (
    <View style={styles.pinkHeader}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <ChevronLeft size={28} color={Colors.white} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.avatarContainer} 
        onPress={() => {
          if (isEditing && onPickImage) onPickImage();
        }}
        activeOpacity={isEditing ? 0.7 : 1}
      >
        <View style={styles.avatarCircle}>
          {fullAvatarUrl ? (
            <Image source={{ uri: fullAvatarUrl }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarLetter}>{user?.name ? user.name[0].toUpperCase() : 'U'}</Text>
          )}
        </View>
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
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  backBtn: { position: 'absolute', top: Platform.OS === 'android' ? 44 : 54, left: 16, zIndex: 10 },
  avatarContainer: { position: 'relative', marginTop: 20, marginBottom: 12 },
  avatarCircle: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.white,
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' },
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
