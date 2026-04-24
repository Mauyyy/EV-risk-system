export const overviewCards = [
  {
    title: '风险仪表盘展示',
    subtitle: '全局风险态势、充电点位分布、风险趋势',
    stats: ['1286 个在线点位', '37 辆风险车辆', '96.7% 识别准确率'],
    type: 'dashboard'
  },
  {
    title: '异常识别展示',
    subtitle: '充电区域异常多视角监测',
    stats: ['4 路视频证据', '42 项时序特征', '18 秒内完成识别'],
    type: 'vision'
  },
  {
    title: '移动端告警展示',
    subtitle: '多设备实时告警、应急响应与处理',
    stats: ['三级告警推送', '闭环工单追踪', '移动端确认反馈'],
    type: 'mobile'
  }
]

export const abilityTags = ['预警前移', '分级输出', '闭环处理', '场景可复用']

export const overviewMetrics = [
  { label: '在线充电点位', value: 1286, unit: '个', trend: '+4.8%', level: 'normal' },
  { label: '今日风险预警', value: 18, unit: '条', trend: '+3', level: 'danger' },
  { label: '平均响应时长', value: 2.8, unit: '分钟', trend: '-31%', level: 'normal' },
  { label: '闭环处置率', value: 94.6, unit: '%', trend: '+5.2%', level: 'normal' }
]

export const riskDistribution = [
  { value: 62, name: '低风险' },
  { value: 26, name: '中风险' },
  { value: 12, name: '高风险' }
]

export const stationLoad = ['滨江能源站', '科创园站', '东湖快充站', '大学城超充站', '枫桥换电站', '城北综合站'].map((name, index) => ({
  name,
  pointCount: [216, 188, 154, 236, 172, 139][index],
  load: [72, 84, 63, 91, 78, 58][index],
  risk: [16, 27, 12, 42, 22, 9][index]
}))

export const riskTimeline = [
  { time: '00:00', thermal: 24, voltage: 18, current: 16, score: 20 },
  { time: '04:00', thermal: 29, voltage: 21, current: 18, score: 25 },
  { time: '08:00', thermal: 43, voltage: 32, current: 29, score: 38 },
  { time: '12:00', thermal: 57, voltage: 46, current: 41, score: 54 },
  { time: '16:00', thermal: 76, voltage: 63, current: 58, score: 72 },
  { time: '20:00', thermal: 49, voltage: 39, current: 34, score: 45 },
  { time: '24:00', thermal: 35, voltage: 27, current: 24, score: 31 }
]

export const alerts = [
  { id: 'AL-20260424-018', time: '2026-04-24 15:42', station: '大学城超充站 A 区', riskType: '温升持续加速', level: '高风险', status: '处置中' },
  { id: 'AL-20260424-017', time: '2026-04-24 14:16', station: '滨江能源站 C03', riskType: '电流波动异常', level: '中风险', status: '已派单' },
  { id: 'AL-20260424-016', time: '2026-04-24 13:28', station: '枫桥换电站 B08', riskType: 'BMS 通信中断', level: '中风险', status: '人工确认' },
  { id: 'AL-20260424-015', time: '2026-04-24 11:05', station: '科创园站 D01', riskType: '电压离散度偏高', level: '低风险', status: '持续观察' },
  { id: 'AL-20260424-014', time: '2026-04-24 10:22', station: '东湖快充站 F06', riskType: '现场烟雾疑似遮挡', level: '高风险', status: '现场复核' },
  { id: 'AL-20260424-013', time: '2026-04-24 09:37', station: '城北综合站 E11', riskType: '环境温湿度异常', level: '低风险', status: '已闭环' }
]

export const evidenceSteps = [
  { title: '数据采集', desc: '同步采集充电桩遥测、BMS 报文、站端环境与现场图像。', status: '已完成' },
  { title: '风险识别', desc: '识别温升斜率、电压离散、电流波动和画面异常证据。', status: '已完成' },
  { title: '分级预警', desc: '融合时序与视觉置信度，输出高、中、低三级风险。', status: '已完成' },
  { title: '告警推送', desc: '向值守屏、移动端和工单系统同步推送处置建议。', status: '已完成' },
  { title: '人工确认', desc: '运维人员复核充电点位、车辆状态和现场画面。', status: '进行中' },
  { title: '闭环处置', desc: '降功率、断电隔离、留存证据并形成复盘记录。', status: '待完成' }
]

export const modelFactors = [
  { factor: '温升斜率', weight: 31, description: '识别电芯或连接器异常发热趋势' },
  { factor: '电压离散度', weight: 24, description: '衡量单体电压一致性退化风险' },
  { factor: '电流波动', weight: 19, description: '定位接触不良与功率模块扰动' },
  { factor: '视觉异常', weight: 16, description: '融合烟雾、遮挡、人员靠近等现场证据' },
  { factor: '环境修正', weight: 10, description: '结合温湿度与站点负载修正阈值' }
]

export const modelFlow = [
  '短时充电数据 + 现场图像证据',
  '特征提取',
  '置信度融合',
  '风险评分',
  '分级预警'
]

export const confidenceCards = [
  { label: '时序置信度 s_ts', value: '0.87', desc: '由温升、电压、电流等短时序列计算' },
  { label: '视觉置信度 s_vi', value: '0.79', desc: '由现场图像异常证据与多视角一致性计算' },
  { label: '融合风险分数 R', value: '92', desc: '综合置信度、阈值规则与站点修正后输出' }
]
