import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { APP_DESCRIPTION, APP_DISPLAY_NAME, APP_FEEDBACK_EMAIL, APP_TAGLINE, APP_VERSION, colors } from '../constants';

interface AboutPanelProps {
  visible: boolean;
  onClose: () => void;
  onOpenBlog: () => void;
  onOpenFeedback: () => void;
}

export const AboutPanel: React.FC<AboutPanelProps> = ({
  visible,
  onClose,
  onOpenBlog,
  onOpenFeedback,
}) => {
  return (
    <Modal visible={visible} transparent animationType='slide' onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>关于 {APP_DISPLAY_NAME}</Text>
            <Text style={styles.subtitle}>{APP_TAGLINE}</Text>
          </View>
          <Pressable style={({ pressed }) => [styles.closeIcon, pressed && styles.closeIconPressed]} onPress={onClose}>
            <Ionicons name='close' size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>产品说明</Text>
            <Text style={styles.paragraph}>{APP_DESCRIPTION}</Text>
            <Text style={styles.paragraph}>本项目由 AI 辅助生成，但所有对外展示内容都经过人工整理与审核。</Text>
            <Text style={styles.paragraph}>当前版本完全免费，适合作为训练前节奏辅助和动作参考工具使用。</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>开发说明</Text>
            <Text style={styles.meta}>版本：{APP_VERSION}</Text>
            <Text style={styles.meta}>反馈邮箱：{APP_FEEDBACK_EMAIL}</Text>
            <Text style={styles.meta}>如博客或反馈链接尚未最终确认，可先通过邮箱联系。</Text>
          </View>
          <View style={styles.actionRow}>
            <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]} onPress={onOpenBlog}>
              <Ionicons name='globe-outline' size={16} color={colors.background} />
              <Text style={styles.primaryButtonText}>查看博客</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]} onPress={onOpenFeedback}>
              <Ionicons name='mail-outline' size={16} color={colors.primary} />
              <Text style={styles.secondaryButtonText}>提交反馈</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.55)' },
  sheet: {
    maxHeight: '78%',
    backgroundColor: colors.backgroundSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
  },
  handle: {
    alignSelf: 'center',
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    marginBottom: 18,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  subtitle: { marginTop: 4, fontSize: 13, color: colors.textSecondary },
  closeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeIconPressed: { backgroundColor: colors.surfacePressed },
  content: { paddingTop: 18, gap: 14 },
  card: {
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 10 },
  paragraph: { fontSize: 14, lineHeight: 22, color: colors.textSecondary, marginBottom: 8 },
  meta: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  primaryButtonPressed: { opacity: 0.88 },
  primaryButtonText: { fontSize: 14, fontWeight: '700', color: colors.background },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderActive,
  },
  secondaryButtonPressed: { backgroundColor: colors.surfacePressed },
  secondaryButtonText: { fontSize: 14, fontWeight: '700', color: colors.primary },
});
