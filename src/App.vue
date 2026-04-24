<template>
  <el-container class="app-shell">
    <el-aside width="260px" class="sidebar">
      <div class="brand">
        <div class="brand-mark">充</div>
        <div>
          <h1>充安智护</h1>
          <p>电动车充电风险预警系统</p>
        </div>
      </div>
      <el-menu :default-active="activePage" class="nav-menu" @select="activePage = $event">
        <el-menu-item v-for="item in pages" :key="item.key" :index="item.key">
          <span class="nav-dot"></span>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
      <div class="side-badge">
        <strong>短期感知</strong>
        <span>融合分析 / 分级预警 / 闭环响应</span>
      </div>
    </el-aside>

    <el-container>
      <el-header class="topbar">
        <div>
          <p class="eyebrow">科研竞赛展示原型 / 全部数据为本地 Mock</p>
          <h2>{{ currentPage.label }}</h2>
        </div>
        <div class="topbar-actions">
          <el-tag effect="dark" type="primary">蓝白科研展板风</el-tag>
          <el-button type="primary" round>导出展示报告</el-button>
        </div>
      </el-header>

      <el-main class="content">
        <section v-if="activePage === 'overview'" class="showcase-board">
          <div class="board-title">
            <span>成果影响与验证</span>
          </div>
          <div class="board-inner">
            <h1>充安智护——电动车充电风险预警系统</h1>
            <p class="board-subtitle">短期感知—融合分析—分级预警—闭环响应</p>
            <p class="board-copy">
              围绕“短期感知—融合分析—分级预警—闭环响应”构建原理样机验证链，形成仪表盘展示、异常识别、移动端告警及响应建议输出，验证方案工程可行性与展示完备性。
            </p>

            <div class="hero-cards">
              <article v-for="card in overviewCards" :key="card.title" class="hero-card">
                <h3>{{ card.title }}</h3>
                <div class="visual-frame" :class="`visual-${card.type}`">
                  <template v-if="card.type === 'dashboard'">
                    <div class="mini-ring"></div>
                    <div class="mini-lines">
                      <span v-for="line in 5" :key="line"></span>
                    </div>
                    <div class="mini-bars">
                      <i v-for="bar in 6" :key="bar"></i>
                    </div>
                  </template>
                  <template v-else-if="card.type === 'vision'">
                    <div class="camera-view">
                      <span v-for="box in 4" :key="box"></span>
                    </div>
                    <div class="vision-stack">
                      <i></i><i></i><i></i>
                    </div>
                  </template>
                  <template v-else>
                    <div class="phone-card"></div>
                    <div class="phone-card second"></div>
                  </template>
                </div>
                <p>{{ card.subtitle }}</p>
                <div class="card-stats">
                  <span v-for="stat in card.stats" :key="stat">{{ stat }}</span>
                </div>
              </article>
            </div>

            <div class="ability-row">
              <div v-for="tag in abilityTags" :key="tag">{{ tag }}</div>
            </div>
            <div class="slogan">从“能感知异常”走向“能分级、联动、闭环”</div>
          </div>
        </section>

        <section v-else-if="activePage === 'monitor'" class="page-grid">
          <div class="metric-card" v-for="metric in overviewMetrics" :key="metric.label">
            <p>{{ metric.label }}</p>
            <strong>{{ metric.value }}<span>{{ metric.unit }}</span></strong>
            <em :class="metric.level">{{ metric.trend }}</em>
          </div>
          <Panel title="风险趋势">
            <Chart :option="riskLineOption" height="360px" />
          </Panel>
          <Panel title="点位分布" class="span-5">
            <Chart :option="stationBarOption" height="360px" />
          </Panel>
          <Panel title="风险等级占比" class="span-4">
            <Chart :option="riskDonutOption" height="320px" />
          </Panel>
          <Panel title="重点点位监测" class="span-8">
            <el-table :data="stationLoad" stripe>
              <el-table-column prop="name" label="站点" min-width="130" />
              <el-table-column prop="pointCount" label="点位数" width="100" />
              <el-table-column prop="load" label="负载率" min-width="180">
                <template #default="{ row }">
                  <el-progress :percentage="row.load" :stroke-width="10" />
                </template>
              </el-table-column>
              <el-table-column prop="risk" label="风险指数" width="110" />
            </el-table>
          </Panel>
        </section>

        <section v-else-if="activePage === 'alerts'" class="page-grid">
          <Panel title="异常告警列表" class="span-12">
            <el-table :data="alerts" stripe>
              <el-table-column prop="id" label="告警编号" min-width="170" />
              <el-table-column prop="station" label="点位" min-width="160" />
              <el-table-column prop="riskType" label="风险类型" min-width="150" />
              <el-table-column label="风险等级" width="120">
                <template #default="{ row }">
                  <span class="level-tag" :class="levelClass(row.level)">{{ row.level }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="时间" min-width="160" />
              <el-table-column prop="status" label="处置状态" width="130" />
            </el-table>
          </Panel>
          <Panel title="告警等级占比" class="span-5">
            <Chart :option="alertDonutOption" height="300px" />
          </Panel>
          <Panel title="响应建议输出" class="span-7">
            <div class="advice-list">
              <div v-for="alert in alerts.slice(0, 3)" :key="alert.id">
                <b>{{ alert.station }} / {{ alert.riskType }}</b>
                <p>建议立即核验现场画面与 BMS 报文，按等级执行降功率、人工复核、断电隔离和工单闭环。</p>
              </div>
            </div>
          </Panel>
        </section>

        <section v-else-if="activePage === 'evidence'" class="page-grid">
          <Panel title="证据链复盘" class="span-12">
            <div class="timeline-flow">
              <article v-for="(step, index) in evidenceSteps" :key="step.title">
                <div class="timeline-icon">{{ index + 1 }}</div>
                <h3>{{ step.title }}</h3>
                <p>{{ step.desc }}</p>
                <span :class="{ pending: step.status !== '已完成' }">{{ step.status }}</span>
              </article>
            </div>
          </Panel>
          <Panel title="异常充电过程快照" class="span-7">
            <Chart :option="evidenceLineOption" height="340px" />
          </Panel>
          <Panel title="证据摘要" class="span-5">
            <div class="evidence-summary">
              <div><span>告警对象</span><strong>大学城超充站 A12</strong></div>
              <div><span>最高温升</span><strong>18.6 C / 10min</strong></div>
              <div><span>电压离散</span><strong>124 mV</strong></div>
              <div><span>判定结果</span><strong>热失控先兆高风险</strong></div>
            </div>
          </Panel>
        </section>

        <section v-else class="page-grid">
          <Panel title="模型流程图" class="span-12">
            <div class="model-flow">
              <template v-for="(item, index) in modelFlow" :key="item">
                <div class="flow-node">{{ item }}</div>
                <div v-if="index < modelFlow.length - 1" class="flow-arrow">→</div>
              </template>
            </div>
          </Panel>
          <Panel title="融合置信度展示" class="span-7">
            <div class="confidence-grid">
              <article v-for="item in confidenceCards" :key="item.label">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
                <p>{{ item.desc }}</p>
              </article>
            </div>
          </Panel>
          <Panel title="特征权重" class="span-5">
            <Chart :option="factorOption" height="320px" />
          </Panel>
          <Panel title="关键因子说明" class="span-12">
            <el-table :data="modelFactors" stripe>
              <el-table-column prop="factor" label="风险因子" width="130" />
              <el-table-column prop="weight" label="权重" min-width="190">
                <template #default="{ row }">
                  <el-progress :percentage="row.weight" :stroke-width="10" />
                </template>
              </el-table-column>
              <el-table-column prop="description" label="说明" />
            </el-table>
          </Panel>
        </section>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed, ref } from 'vue'
import Chart from './components/Chart.vue'
import Panel from './components/Panel.vue'
import {
  abilityTags,
  alerts,
  confidenceCards,
  evidenceSteps,
  modelFactors,
  modelFlow,
  overviewCards,
  overviewMetrics,
  riskDistribution,
  riskTimeline,
  stationLoad
} from './mock'

const pages = [
  { key: 'overview', label: '首页总览' },
  { key: 'monitor', label: '风险监测' },
  { key: 'alerts', label: '异常告警' },
  { key: 'evidence', label: '证据链复盘' },
  { key: 'model', label: '模型说明' }
]

const activePage = ref('overview')
const currentPage = computed(() => pages.find((page) => page.key === activePage.value) || pages[0])

const chartText = '#31557d'
const colors = ['#1d74ff', '#18c7d4', '#f5a623', '#f05252']

const axisStyle = {
  axisLabel: { color: chartText },
  axisLine: { lineStyle: { color: '#b9d6f7' } },
  splitLine: { lineStyle: { color: '#dcecff' } }
}

const riskLineOption = {
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: chartText } },
  grid: { left: 42, right: 22, top: 48, bottom: 30 },
  xAxis: { type: 'category', data: riskTimeline.map((item) => item.time), axisLabel: { color: chartText } },
  yAxis: { type: 'value', ...axisStyle },
  color: colors,
  series: [
    { name: '热风险', type: 'line', smooth: true, areaStyle: { opacity: 0.1 }, data: riskTimeline.map((item) => item.thermal) },
    { name: '电压风险', type: 'line', smooth: true, data: riskTimeline.map((item) => item.voltage) },
    { name: '电流风险', type: 'line', smooth: true, data: riskTimeline.map((item) => item.current) },
    { name: '综合评分', type: 'line', smooth: true, lineStyle: { width: 4 }, data: riskTimeline.map((item) => item.score) }
  ]
}

const stationBarOption = {
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: chartText } },
  grid: { left: 42, right: 18, top: 48, bottom: 44 },
  xAxis: { type: 'category', data: stationLoad.map((item) => item.name), axisLabel: { color: chartText, interval: 0, rotate: 22 } },
  yAxis: { type: 'value', ...axisStyle },
  color: [colors[0], colors[2]],
  series: [
    { name: '点位数', type: 'bar', data: stationLoad.map((item) => item.pointCount), barMaxWidth: 28, itemStyle: { borderRadius: [10, 10, 0, 0] } },
    { name: '风险指数', type: 'line', smooth: true, data: stationLoad.map((item) => item.risk) }
  ]
}

const riskDonutOption = {
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, textStyle: { color: chartText } },
  color: [colors[0], colors[2], colors[3]],
  series: [
    {
      type: 'pie',
      radius: ['52%', '74%'],
      center: ['50%', '44%'],
      data: riskDistribution,
      label: { color: chartText, formatter: '{b}\n{d}%' }
    }
  ]
}

const alertDonutOption = {
  ...riskDonutOption,
  series: [{ ...riskDonutOption.series[0], data: [{ value: 2, name: '高风险' }, { value: 2, name: '中风险' }, { value: 2, name: '低风险' }] }]
}

const evidenceLineOption = {
  ...riskLineOption,
  series: riskLineOption.series.slice(0, 3)
}

const factorOption = {
  tooltip: { trigger: 'axis' },
  grid: { left: 88, right: 24, top: 22, bottom: 24 },
  xAxis: { type: 'value', ...axisStyle },
  yAxis: { type: 'category', data: modelFactors.map((item) => item.factor).reverse(), axisLabel: { color: chartText } },
  color: [colors[1]],
  series: [{ type: 'bar', data: modelFactors.map((item) => item.weight).reverse(), barMaxWidth: 20, itemStyle: { borderRadius: 10 } }]
}

const levelClass = (level) => ({
  high: level === '高风险',
  middle: level === '中风险',
  low: level === '低风险'
})
</script>
