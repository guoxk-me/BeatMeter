import React, { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  TRAINING_DISCLAIMER,
  colors,
  equipmentGuides,
  fitnessActions,
  fitnessCategories,
  getActionsForCategory,
  getEquipmentForAction,
} from '../constants';
import type { EquipmentGuide, FitnessAction, FitnessCategory } from '../constants';
import type { TrainingSessionRecord } from '../hooks';

type FitnessScreen = 'home' | 'category' | 'action' | 'equipment-list' | 'equipment-detail';

interface FitnessGuidanceViewProps {
  recentTraining: TrainingSessionRecord | null;
  isTrainingActive: boolean;
  currentTrainingDurationMs: number;
  onStartTraining: () => void;
  onStopTraining: () => void;
  onOpenAbout: () => void;
}

const formatDuration = (durationMs: number) => {
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}分 ${seconds.toString().padStart(2, '0')}秒`;
};

const formatEndedAt = (endedAt: string) => {
  const date = new Date(endedAt);

  if (Number.isNaN(date.getTime())) {
    return '最近一次训练记录';
  }

  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const MediaCard: React.FC<{ media: FitnessAction['media'][number] }> = ({ media }) => {
  const isVideo = media.type === 'video';

  return (
    <View style={styles.mediaCard}>
      <View style={[styles.mediaPreview, isVideo ? styles.mediaPreviewVideo : styles.mediaPreviewImage]}>
        <Ionicons
          name={isVideo ? 'play-circle-outline' : 'image-outline'}
          size={26}
          color={colors.textPrimary}
        />
        <Text style={styles.mediaPreviewLabel}>{isVideo ? '视频占位' : '图片占位'}</Text>
      </View>
      <Text style={styles.mediaTitle}>{media.title}</Text>
      <Text style={styles.mediaDescription}>{media.description}</Text>
    </View>
  );
};

export const FitnessGuidanceView: React.FC<FitnessGuidanceViewProps> = ({
  recentTraining,
  isTrainingActive,
  currentTrainingDurationMs,
  onStartTraining,
  onStopTraining,
  onOpenAbout,
}) => {
  const [screen, setScreen] = useState<FitnessScreen>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);

  const selectedCategory = useMemo<FitnessCategory | null>(
    () => fitnessCategories.find((item) => item.id === selectedCategoryId) ?? null,
    [selectedCategoryId],
  );
  const selectedAction = useMemo<FitnessAction | null>(
    () => fitnessActions.find((item) => item.id === selectedActionId) ?? null,
    [selectedActionId],
  );
  const selectedEquipment = useMemo<EquipmentGuide | null>(
    () => equipmentGuides.find((item) => item.id === selectedEquipmentId) ?? null,
    [selectedEquipmentId],
  );
  const mediaActions = useMemo(
    () => fitnessActions.filter((action) => action.media.length > 0),
    [],
  );

  const handleOpenCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedActionId(null);
    setScreen('category');
  };

  const handleOpenAction = (actionId: string) => {
    setSelectedActionId(actionId);
    setScreen('action');
  };

  const handleOpenEquipmentDetail = (equipmentId: string) => {
    setSelectedEquipmentId(equipmentId);
    setScreen('equipment-detail');
  };

  const handleBack = () => {
    if (screen === 'action') {
      setScreen('category');
      return;
    }

    if (screen === 'equipment-detail') {
      setScreen('equipment-list');
      return;
    }

    setScreen('home');
  };

  const renderSectionHeader = (title: string, subtitle?: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );

  const renderHome = () => (
    <>
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitle}>健身指导</Text>
            <Text style={styles.heroSubtitle}>胸、肩、背、腿四大类动作与器械速查</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.aboutButton, pressed && styles.aboutButtonPressed]}
            onPress={onOpenAbout}
          >
            <Ionicons name='information-circle-outline' size={18} color={colors.primary} />
            <Text style={styles.aboutButtonText}>关于</Text>
          </Pressable>
        </View>

        <View style={styles.trainingCard}>
          <Text style={styles.trainingLabel}>训练计时</Text>
          <Text style={styles.trainingValue}>
            {isTrainingActive ? formatDuration(currentTrainingDurationMs) : '准备开始'}
          </Text>
          <Text style={styles.trainingSubtext}>
            {recentTraining
              ? `最近记录：${formatDuration(recentTraining.durationMs)} · ${formatEndedAt(recentTraining.endedAt)}`
              : '完成训练后会自动保存最近一次时长记录'}
          </Text>

          <View style={styles.trainingActions}>
            {isTrainingActive ? (
              <Pressable
                style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
                onPress={onStopTraining}
              >
                <Ionicons name='stop-circle-outline' size={16} color={colors.background} />
                <Text style={styles.primaryButtonText}>结束训练</Text>
              </Pressable>
            ) : (
              <Pressable
                style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
                onPress={onStartTraining}
              >
                <Ionicons name='play-circle-outline' size={16} color={colors.background} />
                <Text style={styles.primaryButtonText}>开始训练</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {renderSectionHeader('训练分类', '从目标肌群进入动作说明')}
      <View style={styles.grid}>
        {fitnessCategories.map((category) => (
          <Pressable
            key={category.id}
            style={({ pressed }) => [styles.card, styles.gridCard, pressed && styles.cardPressed]}
            onPress={() => handleOpenCategory(category.id)}
          >
            <Text style={styles.cardTitle}>{category.title}</Text>
            <Text style={styles.cardSubtitle}>{category.subtitle}</Text>
            <Text style={styles.cardBody}>{category.summary}</Text>
          </Pressable>
        ))}
      </View>

      {renderSectionHeader('器械指导', '查看常见器械的基础使用方式')}
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => setScreen('equipment-list')}
      >
        <Text style={styles.cardTitle}>器械清单</Text>
        <Text style={styles.cardSubtitle}>{equipmentGuides.length} 个常见器械条目</Text>
        <Text style={styles.cardBody}>包含目标部位、使用步骤和注意事项，适合训练前快速查阅。</Text>
      </Pressable>

      {renderSectionHeader('示意素材', '使用静态预置占位内容替代 AI 生成')}
      <View style={styles.stack}>
        {mediaActions.slice(0, 3).map((action) => (
          <Pressable
            key={action.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => {
              setSelectedCategoryId(action.categoryId);
              handleOpenAction(action.id);
            }}
          >
            <Text style={styles.cardTitle}>{action.name}</Text>
            <Text style={styles.cardSubtitle}>{action.media.map((item) => item.type === 'video' ? '视频占位' : '图片占位').join(' · ')}</Text>
            <Text style={styles.cardBody}>{action.subtitle}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.disclaimerCard}>
        <Ionicons name='shield-checkmark-outline' size={18} color={colors.primary} />
        <Text style={styles.disclaimerText}>{TRAINING_DISCLAIMER}</Text>
      </View>
    </>
  );

  const renderCategory = () => {
    if (!selectedCategory) {
      return renderHome();
    }

    const actions = getActionsForCategory(selectedCategory.id);

    return (
      <>
        <View style={styles.detailHero}>
          <Text style={styles.detailTitle}>{selectedCategory.title}</Text>
          <Text style={styles.detailSubtitle}>{selectedCategory.subtitle}</Text>
          <Text style={styles.detailBody}>{selectedCategory.summary}</Text>
        </View>
        {actions.map((action) => (
          <Pressable
            key={action.id}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => handleOpenAction(action.id)}
          >
            <Text style={styles.cardTitle}>{action.name}</Text>
            <Text style={styles.cardSubtitle}>{action.subtitle}</Text>
            <Text style={styles.cardBody}>{action.targetMuscles.join(' · ')}</Text>
          </Pressable>
        ))}
      </>
    );
  };

  const renderAction = () => {
    if (!selectedAction) {
      return renderHome();
    }

    const relatedEquipment = getEquipmentForAction(selectedAction.id);

    return (
      <>
        <View style={styles.detailHero}>
          <Text style={styles.detailTitle}>{selectedAction.name}</Text>
          <Text style={styles.detailSubtitle}>{selectedAction.subtitle}</Text>
          <Text style={styles.detailMeta}>目标肌群：{selectedAction.targetMuscles.join('、')}</Text>
          <Text style={styles.detailMeta}>难度：{selectedAction.difficulty}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>动作步骤</Text>
          {selectedAction.steps.map((step, index) => (
            <Text key={step} style={styles.listItem}>{index + 1}. {step}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>常见错误</Text>
          {selectedAction.commonMistakes.map((item) => (
            <Text key={item} style={styles.listItem}>• {item}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>安全提示</Text>
          {selectedAction.safetyTips.map((item) => (
            <Text key={item} style={styles.listItem}>• {item}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>示意素材</Text>
          <Text style={styles.cardBody}>当前版本使用静态预置图片/视频占位块，不依赖实时 AI 生成。</Text>
          <View style={styles.mediaGrid}>
            {selectedAction.media.map((media) => <MediaCard key={media.id} media={media} />)}
          </View>
        </View>

        {relatedEquipment.length ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>相关器械</Text>
            <View style={styles.stack}>
              {relatedEquipment.map((equipment) => (
                <Pressable
                  key={equipment.id}
                  style={({ pressed }) => [styles.inlineLinkCard, pressed && styles.cardPressed]}
                  onPress={() => {
                    setSelectedEquipmentId(equipment.id);
                    setScreen('equipment-detail');
                  }}
                >
                  <Text style={styles.inlineLinkTitle}>{equipment.name}</Text>
                  <Text style={styles.inlineLinkText}>{equipment.subtitle}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.disclaimerCard}>
          <Ionicons name='warning-outline' size={18} color={colors.primary} />
          <Text style={styles.disclaimerText}>{TRAINING_DISCLAIMER}</Text>
        </View>
      </>
    );
  };

  const renderEquipmentList = () => (
    <>
      <View style={styles.detailHero}>
        <Text style={styles.detailTitle}>器械指导</Text>
        <Text style={styles.detailSubtitle}>至少 8 个常见器械的快速说明</Text>
        <Text style={styles.detailBody}>选择器械后可查看目标部位、基础用法和注意事项。</Text>
      </View>
      {equipmentGuides.map((equipment) => (
        <Pressable
          key={equipment.id}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => handleOpenEquipmentDetail(equipment.id)}
        >
          <Text style={styles.cardTitle}>{equipment.name}</Text>
          <Text style={styles.cardSubtitle}>{equipment.subtitle}</Text>
          <Text style={styles.cardBody}>{equipment.targetAreas.join(' · ')}</Text>
        </Pressable>
      ))}
    </>
  );

  const renderEquipmentDetail = () => {
    if (!selectedEquipment) {
      return renderEquipmentList();
    }

    return (
      <>
        <View style={styles.detailHero}>
          <Text style={styles.detailTitle}>{selectedEquipment.name}</Text>
          <Text style={styles.detailSubtitle}>{selectedEquipment.subtitle}</Text>
          <Text style={styles.detailMeta}>适用区域：{selectedEquipment.targetAreas.join('、')}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>基础用法</Text>
          {selectedEquipment.howToUse.map((item, index) => (
            <Text key={item} style={styles.listItem}>{index + 1}. {item}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>注意事项</Text>
          {selectedEquipment.precautions.map((item) => (
            <Text key={item} style={styles.listItem}>• {item}</Text>
          ))}
        </View>

        <View style={styles.disclaimerCard}>
          <Ionicons name='shield-checkmark-outline' size={18} color={colors.primary} />
          <Text style={styles.disclaimerText}>{TRAINING_DISCLAIMER}</Text>
        </View>
      </>
    );
  };

  const titleMap: Record<FitnessScreen, string> = {
    home: '健身指导首页',
    category: selectedCategory?.title ?? '训练分类',
    action: selectedAction?.name ?? '动作详情',
    'equipment-list': '器械清单',
    'equipment-detail': selectedEquipment?.name ?? '器械详情',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.navRow}>
        {screen === 'home' ? (
          <View style={styles.navSpacer} />
        ) : (
          <Pressable style={({ pressed }) => [styles.navButton, pressed && styles.navButtonPressed]} onPress={handleBack}>
            <Ionicons name='arrow-back' size={16} color={colors.textPrimary} />
            <Text style={styles.navButtonText}>返回</Text>
          </Pressable>
        )}
        <Text style={styles.navTitle}>{titleMap[screen]}</Text>
        <Pressable
          style={({ pressed }) => [styles.navButton, pressed && styles.navButtonPressed]}
          onPress={() => {
            setScreen('home');
            setSelectedCategoryId(null);
            setSelectedActionId(null);
            setSelectedEquipmentId(null);
          }}
        >
          <Ionicons name='home-outline' size={16} color={colors.primary} />
          <Text style={[styles.navButtonText, styles.navButtonTextPrimary]}>首页</Text>
        </Pressable>
      </View>

      {screen === 'home' ? renderHome() : null}
      {screen === 'category' ? renderCategory() : null}
      {screen === 'action' ? renderAction() : null}
      {screen === 'equipment-list' ? renderEquipmentList() : null}
      {screen === 'equipment-detail' ? renderEquipmentDetail() : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 14,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 6,
  },
  navSpacer: {
    width: 74,
  },
  navTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  navButton: {
    minWidth: 74,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  navButtonPressed: {
    backgroundColor: colors.surfacePressed,
  },
  navButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  navButtonTextPrimary: {
    color: colors.primary,
  },
  heroCard: {
    borderRadius: 20,
    padding: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  heroTextWrap: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  aboutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderActive,
  },
  aboutButtonPressed: {
    backgroundColor: colors.surfacePressed,
  },
  aboutButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  trainingCard: {
    marginTop: 16,
    borderRadius: 16,
    padding: 16,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trainingLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  trainingValue: {
    marginTop: 8,
    fontSize: 30,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  trainingSubtext: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  trainingActions: {
    marginTop: 14,
  },
  sectionHeader: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCard: {
    width: '48%',
    minHeight: 136,
  },
  stack: {
    gap: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPressed: {
    backgroundColor: colors.surfacePressed,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: colors.primary,
  },
  cardBody: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  detailHero: {
    borderRadius: 18,
    padding: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  detailSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: colors.primary,
  },
  detailBody: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  detailMeta: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  listItem: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  mediaGrid: {
    gap: 12,
    marginTop: 14,
  },
  mediaCard: {
    borderRadius: 14,
    padding: 14,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mediaPreview: {
    height: 112,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mediaPreviewImage: {
    backgroundColor: colors.primarySubtle,
  },
  mediaPreviewVideo: {
    backgroundColor: colors.primaryMuted,
  },
  mediaPreviewLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  mediaTitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  mediaDescription: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  inlineLinkCard: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inlineLinkTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  inlineLinkText: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 14,
    padding: 14,
    backgroundColor: colors.primaryMuted,
    borderWidth: 1,
    borderColor: colors.borderActive,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  primaryButton: {
    height: 46,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
  },
  primaryButtonPressed: {
    opacity: 0.88,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.background,
  },
});
