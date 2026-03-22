export interface FitnessMediaItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  description: string;
}

export interface FitnessAction {
  id: string;
  categoryId: string;
  name: string;
  subtitle: string;
  targetMuscles: string[];
  difficulty: '初级' | '中级' | '进阶';
  steps: string[];
  commonMistakes: string[];
  safetyTips: string[];
  media: FitnessMediaItem[];
}

export interface FitnessCategory {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  actionIds: string[];
}

export interface EquipmentGuide {
  id: string;
  name: string;
  subtitle: string;
  targetAreas: string[];
  howToUse: string[];
  precautions: string[];
  relatedActionIds: string[];
}

export const fitnessCategories: FitnessCategory[] = [
  {
    id: 'chest',
    title: '胸部',
    subtitle: '推举与夹胸发力',
    summary: '聚焦胸大肌训练，适合做卧推、夹胸和俯卧撑类动作参考。',
    actionIds: ['push-up', 'dumbbell-bench-press'],
  },
  {
    id: 'shoulders',
    title: '肩部',
    subtitle: '推举与侧平举控制',
    summary: '围绕前三角、中束和肩袖稳定，适合提升肩部发力与姿势控制。',
    actionIds: ['dumbbell-shoulder-press', 'lateral-raise'],
  },
  {
    id: 'back',
    title: '背部',
    subtitle: '下拉与划船节奏',
    summary: '帮助理解背阔肌、菱形肌和后链发力，适合改善拉类训练动作。',
    actionIds: ['lat-pulldown', 'seated-row'],
  },
  {
    id: 'legs',
    title: '腿部',
    subtitle: '蹲起与下肢稳定',
    summary: '覆盖股四头、臀腿后侧与基础下肢动作，适合新手安全入门。',
    actionIds: ['goblet-squat', 'romanian-deadlift'],
  },
];

export const fitnessActions: FitnessAction[] = [
  {
    id: 'push-up',
    categoryId: 'chest',
    name: '俯卧撑',
    subtitle: '自重胸部基础动作',
    targetMuscles: ['胸大肌', '三头肌', '核心'],
    difficulty: '初级',
    steps: ['双手略宽于肩支撑地面，身体保持一条直线。', '屈肘下放至胸口接近地面。', '向上推起回到起始姿势，保持核心稳定。'],
    commonMistakes: ['塌腰或抬臀过高', '肘部完全外张导致肩压过大'],
    safetyTips: ['下放时保持颈部中立', '若力量不足可先从跪姿开始'],
    media: [
      { id: 'push-up-image', type: 'image', title: '俯卧撑标准示意图', description: '展示身体成一直线与下放路径。' },
      { id: 'push-up-video', type: 'video', title: '俯卧撑讲解占位', description: '后续可替换为动作视频或动图。' },
    ],
  },
  {
    id: 'dumbbell-bench-press',
    categoryId: 'chest',
    name: '哑铃卧推',
    subtitle: '胸部稳定推举',
    targetMuscles: ['胸大肌', '前三角', '三头肌'],
    difficulty: '中级',
    steps: ['平躺在卧推椅上，双脚稳踩地面。', '哑铃位于胸侧上方，手腕保持中立。', '向上推至手臂接近伸直，再可控下放。'],
    commonMistakes: ['下放过深造成肩前顶', '推起时手腕后折'],
    safetyTips: ['选择可控重量', '起落哑铃时注意肩关节稳定'],
    media: [
      { id: 'bench-image', type: 'image', title: '哑铃卧推示意图', description: '重点展示肩胛收紧与推举轨迹。' },
    ],
  },
  {
    id: 'dumbbell-shoulder-press',
    categoryId: 'shoulders',
    name: '哑铃肩推',
    subtitle: '肩部基础推举',
    targetMuscles: ['三角肌前束', '三角肌中束', '核心'],
    difficulty: '中级',
    steps: ['坐姿或站姿握持哑铃于肩侧。', '收紧核心，向上推起至头顶上方。', '缓慢下放回肩侧，避免借力晃动。'],
    commonMistakes: ['腰部过度后仰', '哑铃路径过于向前'],
    safetyTips: ['先稳定核心再推举', '肩不适时减小动作范围'],
    media: [
      { id: 'shoulder-press-image', type: 'image', title: '哑铃肩推示意图', description: '展示肘部位置与头顶锁定点。' },
    ],
  },
  {
    id: 'lateral-raise',
    categoryId: 'shoulders',
    name: '哑铃侧平举',
    subtitle: '肩中束控制训练',
    targetMuscles: ['三角肌中束'],
    difficulty: '初级',
    steps: ['双手自然下垂握哑铃。', '手肘微屈，将哑铃抬至肩高。', '控制下放速度，避免利用惯性摆动。'],
    commonMistakes: ['耸肩代偿', '举过肩高太多'],
    safetyTips: ['使用轻重量', '感受肩部发力而非上斜方发力'],
    media: [
      { id: 'lateral-raise-image', type: 'image', title: '侧平举示意图', description: '展示肩高控制与手肘微屈角度。' },
    ],
  },
  {
    id: 'lat-pulldown',
    categoryId: 'back',
    name: '高位下拉',
    subtitle: '背阔肌拉力训练',
    targetMuscles: ['背阔肌', '肱二头肌', '中下斜方肌'],
    difficulty: '初级',
    steps: ['固定大腿，双手略宽于肩握杆。', '挺胸下拉至锁骨附近。', '控制还原，保持肩胛稳定上举。'],
    commonMistakes: ['身体过度后仰借力', '下拉到胸口以下过深'],
    safetyTips: ['先沉肩再发力', '不要猛拉猛放'],
    media: [
      { id: 'lat-pulldown-image', type: 'image', title: '高位下拉示意图', description: '展示挺胸、沉肩与拉杆终点。' },
    ],
  },
  {
    id: 'seated-row',
    categoryId: 'back',
    name: '坐姿划船',
    subtitle: '背部水平拉训练',
    targetMuscles: ['菱形肌', '背阔肌', '后束'],
    difficulty: '初级',
    steps: ['坐稳并保持胸椎延展。', '拉把手靠近腹部，同时夹紧肩胛。', '缓慢前送手柄但不完全松掉背部张力。'],
    commonMistakes: ['耸肩拉动', '还原时身体前趴'],
    safetyTips: ['避免用腰猛甩', '保持核心轻度紧张'],
    media: [
      { id: 'seated-row-video', type: 'video', title: '坐姿划船讲解占位', description: '后续可替换为更详细的视频示范。' },
    ],
  },
  {
    id: 'goblet-squat',
    categoryId: 'legs',
    name: '高脚杯深蹲',
    subtitle: '下肢基础蹲起',
    targetMuscles: ['股四头肌', '臀大肌', '核心'],
    difficulty: '初级',
    steps: ['双手抱住哑铃贴近胸前站立。', '屈髋屈膝下蹲，膝盖跟随脚尖方向。', '脚跟发力站起，回到直立姿势。'],
    commonMistakes: ['膝内扣', '下蹲时塌腰'],
    safetyTips: ['保持脚跟稳定', '从小重量开始练习蹲深与平衡'],
    media: [
      { id: 'goblet-squat-image', type: 'image', title: '高脚杯深蹲示意图', description: '展示抱铃姿势与下蹲深度控制。' },
    ],
  },
  {
    id: 'romanian-deadlift',
    categoryId: 'legs',
    name: '罗马尼亚硬拉',
    subtitle: '臀腿后侧铰链动作',
    targetMuscles: ['臀大肌', '腘绳肌', '下背稳定肌群'],
    difficulty: '中级',
    steps: ['双手持哑铃或杠铃站稳。', '屈髋向后坐，保持背部平直下放至小腿中部附近。', '臀部发力回到站立姿势。'],
    commonMistakes: ['弓背下放', '膝盖过度前移变成深蹲'],
    safetyTips: ['优先练习髋铰链模式', '重量增加前确保背部中立稳定'],
    media: [
      { id: 'rdl-image', type: 'image', title: '罗马尼亚硬拉示意图', description: '展示髋部后移与背部中立。' },
    ],
  },
];

export const equipmentGuides: EquipmentGuide[] = [
  {
    id: 'dumbbell',
    name: '哑铃',
    subtitle: '基础自由重量器械',
    targetAreas: ['胸部', '肩部', '手臂', '腿部'],
    howToUse: ['根据动作选择合适重量。', '起始和结束都保持手腕稳定。', '动作过程中避免借力甩动。'],
    precautions: ['不要在疲劳时强行上大重量', '重物起落注意周围空间'],
    relatedActionIds: ['dumbbell-bench-press', 'dumbbell-shoulder-press', 'lateral-raise', 'goblet-squat'],
  },
  {
    id: 'barbell',
    name: '杠铃',
    subtitle: '复合动作核心器械',
    targetAreas: ['胸部', '背部', '腿部'],
    howToUse: ['装片前确认卡扣固定。', '保持对称握距与站位。', '优先在保护架或同伴保护下训练。'],
    precautions: ['不要独自挑战极限重量', '起杠前先确认肩背与站位稳定'],
    relatedActionIds: ['romanian-deadlift'],
  },
  {
    id: 'smith-machine',
    name: '史密斯机',
    subtitle: '固定轨迹推拉器械',
    targetAreas: ['胸部', '肩部', '腿部'],
    howToUse: ['调节高度与安全挂钩位置。', '沿固定轨迹完成推举或深蹲。', '结束前先挂回安全点。'],
    precautions: ['固定轨迹并不代表完全安全', '仍需注意膝髋与肩关节角度'],
    relatedActionIds: ['goblet-squat'],
  },
  {
    id: 'cable-machine',
    name: '龙门架',
    subtitle: '多角度拉力训练',
    targetAreas: ['胸部', '背部', '肩部'],
    howToUse: ['根据动作调节滑轮高度。', '确认把手与卡扣连接稳固。', '沿目标肌群方向控制发力。'],
    precautions: ['重心要稳，避免被拉力牵扯失衡', '还原阶段同样要控制'],
    relatedActionIds: ['lat-pulldown', 'seated-row'],
  },
  {
    id: 'bench',
    name: '卧推椅',
    subtitle: '推举支撑平台',
    targetAreas: ['胸部', '肩部'],
    howToUse: ['调节椅背角度。', '肩胛后缩下沉贴稳椅面。', '双脚踩稳地面后再开始推举。'],
    precautions: ['椅面不稳时不要训练', '起落器械需提前规划路径'],
    relatedActionIds: ['dumbbell-bench-press'],
  },
  {
    id: 'leg-press',
    name: '腿举机',
    subtitle: '下肢推蹬训练',
    targetAreas: ['股四头肌', '臀部'],
    howToUse: ['双脚与肩同宽放置踏板。', '解锁后可控下放至舒适角度。', '脚跟发力推回起始位置。'],
    precautions: ['避免膝盖完全锁死', '下放过深时注意骨盆稳定'],
    relatedActionIds: ['goblet-squat'],
  },
  {
    id: 'row-machine',
    name: '划船机',
    subtitle: '背部有氧结合器械',
    targetAreas: ['背部', '腿部', '心肺'],
    howToUse: ['脚固定在踏板上。', '先腿后背再手完成拉动。', '还原顺序相反，保持节奏。'],
    precautions: ['不要只用手拉', '腰背疲劳时降低强度'],
    relatedActionIds: ['seated-row'],
  },
  {
    id: 'lat-pulldown-machine',
    name: '高位下拉器',
    subtitle: '背阔肌专项器械',
    targetAreas: ['背阔肌', '上背'],
    howToUse: ['调节膝垫高度固定身体。', '挺胸沉肩后再下拉。', '在可控范围内缓慢还原。'],
    precautions: ['避免颈后下拉', '不要依靠身体大幅摆动'],
    relatedActionIds: ['lat-pulldown'],
  },
];

export const getActionsForCategory = (categoryId: string) => (
  fitnessActions.filter((action) => action.categoryId === categoryId)
);

export const getEquipmentForAction = (actionId: string) => (
  equipmentGuides.filter((equipment) => equipment.relatedActionIds.includes(actionId))
);
