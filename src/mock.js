export const overviewMetrics = [
  { label: '在线充电桩', value: 1286, unit: '台', trend: '+4.8%', level: 'normal' },
  { label: '风险点位', value: 37, unit: '处', trend: '-12.5%', level: 'warning' },
  { label: '今日告警', value: 18, unit: '条', trend: '+3', level: 'danger' },
  { label: '模型准确率', value: 96.7, unit: '%', trend: '+1.2%', level: 'normal' }
]

export const riskDistribution = [
  { value: 62, name: '低风险' },
  { value: 26, name: '中风险' },
  { value: 12, name: '高风险' }
]

export const alertTypeStats = [
  { name: '温升异常', value: 7 },
  { name: '电压离散', value: 4 },
  { name: '电流波动', value: 3 },
  { name: 'BMS 通信', value: 2 },
  { name: '视觉异常', value: 2 }
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

export const closedLoopSteps = [
  { title: '感知采集', desc: '充电桩遥测、BMS 报文、现场图像同步接入' },
  { title: '融合分析', desc: '时序特征与视觉证据进行置信度融合' },
  { title: '风险分级', desc: '输出高、中、低三级风险与评分依据' },
  { title: '告警推送', desc: '多终端同步通知并生成处置建议' },
  { title: '处置反馈', desc: '人工确认、工单闭环、证据留存复盘' }
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
