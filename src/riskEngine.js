const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export function softmaxWeights(tsScore, visionScore, tsConfidence, visionConfidence) {
  const zTs = tsConfidence * 1.35 + (tsScore / 100) * 0.65
  const zVision = visionConfidence * 1.35 + (visionScore / 100) * 0.65
  const expTs = Math.exp(zTs)
  const expVision = Math.exp(zVision)
  const total = expTs + expVision

  return {
    tsWeight: expTs / total,
    visionWeight: expVision / total
  }
}

export function getWindowSequence(caseItem, minutes) {
  return caseItem.sequence.filter((item) => item.minute <= minutes)
}

export function extractShortWindowFeatures(caseItem, minutes = 5) {
  const sequence = getWindowSequence(caseItem, minutes)
  const first = sequence[0]
  const last = sequence[sequence.length - 1]
  const currentValues = sequence.map((item) => item.current)
  const powerValues = sequence.map((item) => item.power)
  const voltageValues = sequence.map((item) => item.voltage)
  const currentRange = Math.max(...currentValues) - Math.min(...currentValues)
  const powerRange = Math.max(...powerValues) - Math.min(...powerValues)
  const voltageDrop = first.voltage - last.voltage
  const tempSlope = (last.temp - first.temp) / Math.max(last.minute - first.minute, 1)

  return {
    tempSlope: Number(tempSlope.toFixed(2)),
    currentRange: Number(currentRange.toFixed(2)),
    powerRange: Number(powerRange.toFixed(0)),
    voltageDrop: Number(voltageDrop.toFixed(2))
  }
}

export function classifyRisk(score) {
  if (score >= 80) return '高风险'
  if (score >= 50) return '中风险'
  return '低风险'
}

export function levelTone(level) {
  if (level === '高风险') return 'danger'
  if (level === '中风险') return 'warning'
  return 'success'
}

export function buildRiskDecision(caseItem, minutes = 5) {
  const windowScores = getWindowSequence(caseItem, minutes).map((item) => item.score)
  const tsWindowScore = windowScores.length ? windowScores[windowScores.length - 1] : caseItem.tsScore
  const { tsWeight, visionWeight } = softmaxWeights(
    tsWindowScore,
    caseItem.visionScore,
    caseItem.tsConfidence,
    caseItem.visionConfidence
  )
  const fused = tsWeight * tsWindowScore + visionWeight * caseItem.visionScore
  const hardRuleKeywords = ['飞线', '拖地线缆', '线缆横穿', '电池外观', '外置电池包']
  const hasHardRule = caseItem.detections.some(
    (item) =>
      item.confidence >= 0.86 &&
      hardRuleKeywords.some((keyword) => item.label.includes(keyword))
  )
  const score = clamp(Math.round(hasHardRule ? Math.max(fused, 86) : fused), 0, 100)
  const level = hasHardRule ? '高风险' : classifyRisk(score)

  const adviceMap = {
    高风险: ['立即降功率或停止充电', '现场复核并拍照留证', '必要时断电隔离并通知后勤值班'],
    中风险: ['延长 10 分钟跟踪窗口', '复查视觉遮挡与现场通道', '保留事件并推送巡查提醒'],
    低风险: ['自动记录样本', '维持常规巡检', '用于正常模式校准']
  }

  return {
    score,
    level,
    tone: levelTone(level),
    tsWeight,
    visionWeight,
    hasHardRule,
    features: extractShortWindowFeatures(caseItem, minutes),
    advice: adviceMap[level]
  }
}
