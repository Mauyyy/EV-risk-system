export const chargingSites = [
  {
    id: 'east-yard',
    name: '东苑宿舍区充电棚',
    mapName: '东苑 A区',
    area: '宿舍区',
    totalPorts: 128,
    onlinePorts: 116,
    activeSessions: 74,
    riskScore: 91,
    riskLevel: '高风险',
    alertCount: 5,
    load: 86,
    status: '需要干预',
    trend: '+12%',
    tags: ['晚高峰', '飞线高发', '通道拥挤']
  },
  {
    id: 'library-north',
    name: '图书馆北侧充电点',
    mapName: '图书馆北',
    area: '教学区',
    totalPorts: 86,
    onlinePorts: 83,
    activeSessions: 41,
    riskScore: 58,
    riskLevel: '中风险',
    alertCount: 2,
    load: 63,
    status: '持续观察',
    trend: '+4%',
    tags: ['人员密集', '遮挡较多']
  },
  {
    id: 'innovation-park',
    name: '科创园集中充电区',
    mapName: '科创园',
    area: '园区',
    totalPorts: 156,
    onlinePorts: 151,
    activeSessions: 68,
    riskScore: 34,
    riskLevel: '低风险',
    alertCount: 1,
    load: 52,
    status: '运行平稳',
    trend: '-8%',
    tags: ['新建点位', '光照良好']
  },
  {
    id: 'west-gate',
    name: '西门换乘充电站',
    mapName: '西门换乘',
    area: '交通口',
    totalPorts: 96,
    onlinePorts: 88,
    activeSessions: 57,
    riskScore: 73,
    riskLevel: '中风险',
    alertCount: 3,
    load: 79,
    status: '复核中',
    trend: '+7%',
    tags: ['短时快充', '车流波动']
  }
]

export const overviewMetrics = [
  { label: '在线充电端口', value: 438, unit: '个', trend: '较昨日 +4.8%', tone: 'blue' },
  { label: '当前充电会话', value: 240, unit: '次', trend: '晚高峰上升', tone: 'cyan' },
  { label: '中高风险事件', value: 10, unit: '条', trend: '5 条待复核', tone: 'red' },
  { label: '平均预警提前量', value: 6.8, unit: 'min', trend: '覆盖 3/5/10 min', tone: 'green' }
]

export const riskTimeline = [
  { time: '08:00', low: 78, medium: 12, high: 2, score: 22 },
  { time: '10:00', low: 86, medium: 16, high: 3, score: 28 },
  { time: '12:00', low: 81, medium: 19, high: 4, score: 36 },
  { time: '14:00', low: 74, medium: 22, high: 5, score: 47 },
  { time: '16:00', low: 66, medium: 28, high: 7, score: 63 },
  { time: '18:00', low: 58, medium: 34, high: 11, score: 78 },
  { time: '20:00', low: 70, medium: 25, high: 6, score: 51 },
  { time: '22:00', low: 83, medium: 15, high: 3, score: 31 }
]

export const riskTypeStats = [
  { name: '温升异常', value: 8 },
  { name: '飞线充电', value: 6 },
  { name: '线缆横穿', value: 5 },
  { name: '电流波动', value: 4 },
  { name: '杂物堆放', value: 3 },
  { name: '图像遮挡', value: 2 }
]

export const windowComparison = [
  { window: '3 min', recall: 78, precision: 82, lead: 8.5, stability: 74 },
  { window: '5 min', recall: 89, precision: 88, lead: 6.8, stability: 91 },
  { window: '10 min', recall: 94, precision: 90, lead: 3.2, stability: 95 }
]

export const riskCases = [
  {
    id: 'case-a12',
    title: 'A12 拖地线缆叠加温升异常',
    station: '东苑宿舍区充电棚 A区',
    port: 'A12',
    vehicle: '豫A-EV218',
    levelHint: '高风险',
    time: '2026-05-29 19:18',
    tsScore: 86,
    visionScore: 94,
    tsConfidence: 0.88,
    visionConfidence: 0.82,
    dataQuality: 93,
    imageQuality: 81,
    occlusion: 18,
    ruleHit: '拖地线缆高置信命中',
    status: '待现场复核',
    sceneFocus: '82% 9%',
    image: '/assets/camera-risk.png',
    detections: [
      { label: '拖地线缆', confidence: 0.93, severity: 'high', x: 30, y: 51, w: 58, h: 27 },
      { label: '线缆横穿通道', confidence: 0.87, severity: 'medium', x: 58, y: 63, w: 29, h: 15 },
      { label: '外置电池包', confidence: 0.76, severity: 'high', x: 45, y: 58, w: 9, h: 14 }
    ],
    sequence: [
      { minute: 0, voltage: 52.1, current: 7.9, power: 412, temp: 28.2, score: 21 },
      { minute: 1, voltage: 52.0, current: 8.5, power: 441, temp: 29.3, score: 34 },
      { minute: 2, voltage: 51.8, current: 9.2, power: 476, temp: 31.2, score: 49 },
      { minute: 3, voltage: 51.5, current: 9.8, power: 504, temp: 33.6, score: 66 },
      { minute: 4, voltage: 51.2, current: 10.6, power: 543, temp: 36.1, score: 79 },
      { minute: 5, voltage: 50.8, current: 11.4, power: 579, temp: 39.4, score: 91 },
      { minute: 8, voltage: 50.2, current: 10.9, power: 547, temp: 43.8, score: 96 },
      { minute: 10, voltage: 49.9, current: 10.6, power: 529, temp: 46.5, score: 98 }
    ]
  },
  {
    id: 'case-c03',
    title: 'C03 电流波动与遮挡干扰',
    station: '西门换乘充电站 C区',
    port: 'C03',
    vehicle: '豫A-EV533',
    levelHint: '中风险',
    time: '2026-05-29 18:42',
    tsScore: 68,
    visionScore: 49,
    tsConfidence: 0.91,
    visionConfidence: 0.54,
    dataQuality: 95,
    imageQuality: 57,
    occlusion: 46,
    ruleHit: '无硬约束命中',
    status: '持续观察',
    sceneFocus: '78% 9%',
    image: '/assets/camera-crowded.png',
    detections: [
      { label: '局部遮挡', confidence: 0.69, severity: 'medium', x: 49, y: 4, w: 10, h: 84 },
      { label: '车辆密集', confidence: 0.72, severity: 'medium', x: 8, y: 35, w: 76, h: 45 }
    ],
    sequence: [
      { minute: 0, voltage: 53.2, current: 6.9, power: 367, temp: 27.1, score: 18 },
      { minute: 1, voltage: 53.1, current: 7.6, power: 404, temp: 27.8, score: 26 },
      { minute: 2, voltage: 53.0, current: 6.4, power: 339, temp: 28.5, score: 31 },
      { minute: 3, voltage: 52.7, current: 8.9, power: 469, temp: 29.6, score: 52 },
      { minute: 4, voltage: 52.8, current: 6.1, power: 322, temp: 30.7, score: 57 },
      { minute: 5, voltage: 52.5, current: 9.4, power: 494, temp: 31.8, score: 69 },
      { minute: 8, voltage: 52.4, current: 7.8, power: 409, temp: 33.2, score: 65 },
      { minute: 10, voltage: 52.2, current: 7.4, power: 386, temp: 34.1, score: 62 }
    ]
  },
  {
    id: 'case-d01',
    title: 'D01 正常快充样本',
    station: '科创园集中充电区 D区',
    port: 'D01',
    vehicle: '豫A-EV089',
    levelHint: '低风险',
    time: '2026-05-29 15:06',
    tsScore: 28,
    visionScore: 22,
    tsConfidence: 0.94,
    visionConfidence: 0.89,
    dataQuality: 98,
    imageQuality: 91,
    occlusion: 8,
    ruleHit: '无硬约束命中',
    status: '自动记录',
    sceneFocus: '82% 9%',
    image: '/assets/camera-normal.png',
    detections: [
      { label: '车辆停放规范', confidence: 0.91, severity: 'low', x: 13, y: 31, w: 65, h: 34 },
      { label: '通道畅通', confidence: 0.88, severity: 'low', x: 65, y: 48, w: 31, h: 33 }
    ],
    sequence: [
      { minute: 0, voltage: 53.4, current: 6.2, power: 331, temp: 26.9, score: 13 },
      { minute: 1, voltage: 53.4, current: 6.3, power: 336, temp: 27.1, score: 16 },
      { minute: 2, voltage: 53.3, current: 6.4, power: 341, temp: 27.4, score: 19 },
      { minute: 3, voltage: 53.2, current: 6.4, power: 340, temp: 27.7, score: 23 },
      { minute: 4, voltage: 53.2, current: 6.5, power: 346, temp: 28.0, score: 26 },
      { minute: 5, voltage: 53.1, current: 6.5, power: 345, temp: 28.3, score: 28 },
      { minute: 8, voltage: 53.0, current: 6.4, power: 339, temp: 28.8, score: 29 },
      { minute: 10, voltage: 52.9, current: 6.3, power: 333, temp: 29.1, score: 30 }
    ]
  }
]

export const alerts = [
  {
    id: 'AL-20260529-018',
    caseId: 'case-a12',
    level: '高风险',
    station: '东苑宿舍区充电棚 A区 A12',
    type: '拖地线缆 / 温升异常',
    time: '2026-05-29 19:18',
    status: '待现场复核',
    owner: '后勤值班员',
    response: '立即降功率、现场复核、必要时断电隔离'
  },
  {
    id: 'AL-20260529-017',
    caseId: 'case-c03',
    level: '中风险',
    station: '西门换乘充电站 C区 C03',
    type: '电流波动 / 图像遮挡',
    time: '2026-05-29 18:42',
    status: '持续观察',
    owner: '安防巡查',
    response: '复查画面遮挡，连续 10 分钟跟踪电流波动'
  },
  {
    id: 'AL-20260529-016',
    caseId: 'case-d01',
    level: '低风险',
    station: '科创园集中充电区 D区 D01',
    type: '常规快充',
    time: '2026-05-29 15:06',
    status: '自动记录',
    owner: '系统',
    response: '留存记录，无需人工干预'
  },
  {
    id: 'AL-20260529-015',
    caseId: 'case-a12',
    level: '中风险',
    station: '图书馆北侧充电点 B区 B09',
    type: '杂物堆放 / 通道占用',
    time: '2026-05-29 13:26',
    status: '已派单',
    owner: '物业班组',
    response: '清理阻塞物，复拍现场照片'
  }
]

export const closedLoopSteps = [
  { title: '风险记录', desc: '留存短时序列、视觉结果、分级依据与事件编号', status: '已完成' },
  { title: '告警复核', desc: '推送值班屏与移动端，现场确认异常对象', status: '进行中' },
  { title: '联动干预', desc: '按等级执行降功率、断电隔离、通道清理等操作', status: '待执行' },
  { title: '复盘归档', desc: '记录处置结果，反哺阈值和规则校准', status: '待执行' }
]

export const modelFactors = [
  { factor: '温升率', weight: 31, desc: '识别电池、连接器或充电器异常发热趋势' },
  { factor: '电流波动', weight: 22, desc: '定位接触不良、功率模块不稳和负载突变' },
  { factor: '电压离散', weight: 18, desc: '衡量充电过程中的异常偏移和衰退征兆' },
  { factor: '视觉异常', weight: 19, desc: '融合拖地线缆、通道风险、杂物堆放、电池外观异常' },
  { factor: '场景修正', weight: 10, desc: '结合夜间、区域、负载率等校园管理先验' }
]

export const techPipeline = [
  { title: '输入采集', desc: '短时序列 + 现场图像' },
  { title: '单模态识别', desc: '时序风险分数 / 视觉风险分数' },
  { title: '置信度评估', desc: '完整性、稳定性、清晰度、遮挡程度' },
  { title: '动态融合', desc: '样本级权重自适应分配' },
  { title: '分级处置', desc: '低 / 中 / 高风险与闭环建议' }
]

export const mobileMessages = [
  { level: '高风险', title: 'A12 拖地线缆 + 温升异常', time: '19:18', station: '东苑宿舍区充电棚', status: '待复核' },
  { level: '中风险', title: 'C03 电流波动', time: '18:42', station: '西门换乘充电站', status: '观察中' },
  { level: '中风险', title: 'B09 通道占用', time: '13:26', station: '图书馆北侧充电点', status: '已派单' },
  { level: '低风险', title: 'D01 常规快充记录', time: '15:06', station: '科创园集中充电区', status: '已记录' }
]
