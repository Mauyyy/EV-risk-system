export const overviewMetrics = [
  { label: '在线充电桩', value: 1286, unit: '台', trend: '+4.8%', level: 'normal' },
  { label: '风险车辆', value: 37, unit: '辆', trend: '-12.5%', level: 'warning' },
  { label: '今日告警', value: 18, unit: '条', trend: '+3', level: 'danger' },
  { label: '模型准确率', value: 96.7, unit: '%', trend: '+1.2%', level: 'normal' }
]

export const riskDistribution = [
  { value: 55, name: '正常' },
  { value: 26, name: '低风险' },
  { value: 13, name: '中风险' },
  { value: 6, name: '高风险' }
]

export const stationLoad = ['滨江站', '科创站', '东湖站', '大学城', '枢纽站'].map((name, index) => ({
  name,
  load: [72, 84, 63, 91, 78][index],
  risk: [12, 18, 9, 28, 16][index]
}))

export const riskTimeline = [
  { time: '00:00', thermal: 31, voltage: 24, current: 18, score: 22 },
  { time: '04:00', thermal: 36, voltage: 26, current: 23, score: 28 },
  { time: '08:00', thermal: 45, voltage: 34, current: 31, score: 39 },
  { time: '12:00', thermal: 61, voltage: 48, current: 44, score: 58 },
  { time: '16:00', thermal: 74, voltage: 62, current: 59, score: 71 },
  { time: '20:00', thermal: 52, voltage: 41, current: 35, score: 46 }
]

export const alerts = [
  { id: 'AL-20260424-018', time: '2026-04-24 15:42', station: '大学城超充站', pile: 'A12', vehicle: '浙A·Q8E21', type: '热失控先兆', score: 92, status: '处置中' },
  { id: 'AL-20260424-017', time: '2026-04-24 14:16', station: '滨江能源站', pile: 'C03', vehicle: '苏E·D7721', type: '电流波动异常', score: 78, status: '已派单' },
  { id: 'AL-20260424-016', time: '2026-04-24 13:28', station: '枢纽快充站', pile: 'B08', vehicle: '沪A·L920K', type: 'BMS 通信异常', score: 70, status: '已确认' },
  { id: 'AL-20260424-015', time: '2026-04-24 11:05', station: '科创园站', pile: 'D01', vehicle: '皖P·K1109', type: '电压离散度偏高', score: 66, status: '已关闭' }
]

export const evidenceSteps = [
  { title: '数据采集', desc: '充电桩遥测、BMS 报文、红外温度、站端环境数据同步入库' },
  { title: '特征抽取', desc: '提取温升斜率、电压离散度、电流谐波、SOC 异常跃迁等 42 项特征' },
  { title: '模型判别', desc: '时序模型输出风险分数 92，规则引擎命中“温升持续加速”证据' },
  { title: '告警联动', desc: '生成告警单，建议降功率、人工巡检并保留充电曲线快照' }
]

export const modelFactors = [
  { factor: '温升斜率', weight: 31, description: '识别电芯或连接器异常发热趋势' },
  { factor: '电压离散度', weight: 24, description: '衡量单体电压一致性退化风险' },
  { factor: '电流波动', weight: 19, description: '定位接触不良、功率模块扰动' },
  { factor: 'BMS 报文', weight: 16, description: '捕捉通信中断、状态码异常' },
  { factor: '环境修正', weight: 10, description: '结合温湿度和站点负载修正阈值' }
]
