<template>
  <el-container class="app-shell">
    <el-aside width="248px" class="sidebar">
      <div class="brand">
        <div class="brand-mark">EV</div>
        <div>
          <h1>充电风险预警</h1>
          <p>Scientific Risk Console</p>
        </div>
      </div>
      <el-menu :default-active="activePage" class="nav-menu" @select="activePage = $event">
        <el-menu-item v-for="item in pages" :key="item.key" :index="item.key">
          <span class="nav-dot"></span>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="topbar">
        <div>
          <p class="eyebrow">电动车充电安全 · 前端原型</p>
          <h2>{{ currentPage.label }}</h2>
        </div>
        <div class="topbar-actions">
          <el-tag effect="dark" type="primary">Mock 数据</el-tag>
          <el-button type="primary">导出报告</el-button>
        </div>
      </el-header>

      <el-main class="content">
        <section v-if="activePage === 'overview'" class="page-grid">
          <div class="metric-card" v-for="metric in overviewMetrics" :key="metric.label">
            <p>{{ metric.label }}</p>
            <strong>{{ metric.value }}<span>{{ metric.unit }}</span></strong>
            <em :class="metric.level">{{ metric.trend }}</em>
          </div>
          <Panel title="全网风险分布" class="span-5">
            <Chart :option="riskPieOption" />
          </Panel>
          <Panel title="站点负载与风险指数" class="span-7">
            <Chart :option="stationBarOption" />
          </Panel>
          <Panel title="今日风险走势" class="span-12">
            <Chart :option="riskLineOption" height="300px" />
          </Panel>
        </section>

        <section v-else-if="activePage === 'monitor'" class="page-grid">
          <Panel title="实时风险曲线" class="span-8">
            <Chart :option="riskLineOption" height="360px" />
          </Panel>
          <Panel title="风险因子雷达" class="span-4">
            <Chart :option="radarOption" height="360px" />
          </Panel>
          <Panel title="重点站点监测" class="span-12">
            <el-table :data="stationLoad" stripe>
              <el-table-column prop="name" label="站点" />
              <el-table-column prop="load" label="负载率">
                <template #default="{ row }">
                  <el-progress :percentage="row.load" :stroke-width="10" />
                </template>
              </el-table-column>
              <el-table-column prop="risk" label="风险指数" />
              <el-table-column label="状态">
                <template #default="{ row }">
                  <el-tag :type="row.risk > 20 ? 'danger' : 'success'">{{ row.risk > 20 ? '重点关注' : '稳定' }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </Panel>
        </section>

        <section v-else-if="activePage === 'alerts'" class="page-grid">
          <Panel title="异常告警列表" class="span-12">
            <el-table :data="alerts" stripe>
              <el-table-column prop="id" label="告警编号" width="170" />
              <el-table-column prop="time" label="时间" width="160" />
              <el-table-column prop="station" label="站点" />
              <el-table-column prop="pile" label="桩位" width="80" />
              <el-table-column prop="vehicle" label="车辆" width="120" />
              <el-table-column prop="type" label="类型" />
              <el-table-column prop="score" label="风险分" width="95">
                <template #default="{ row }">
                  <strong class="score">{{ row.score }}</strong>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100" />
            </el-table>
          </Panel>
          <Panel title="告警等级占比" class="span-5">
            <Chart :option="alertDonutOption" />
          </Panel>
          <Panel title="处置建议" class="span-7">
            <div class="advice-list">
              <div v-for="alert in alerts.slice(0, 3)" :key="alert.id">
                <b>{{ alert.type }}</b>
                <p>{{ alert.station }} {{ alert.pile }}：建议降低充电功率，核验枪线温度并复核 BMS 报文。</p>
              </div>
            </div>
          </Panel>
        </section>

        <section v-else-if="activePage === 'evidence'" class="page-grid">
          <Panel title="证据链复盘" class="span-5">
            <el-timeline>
              <el-timeline-item v-for="step in evidenceSteps" :key="step.title" :timestamp="step.title" placement="top">
                {{ step.desc }}
              </el-timeline-item>
            </el-timeline>
          </Panel>
          <Panel title="异常充电过程快照" class="span-7">
            <Chart :option="evidenceLineOption" height="380px" />
          </Panel>
          <Panel title="证据摘要" class="span-12">
            <div class="evidence-summary">
              <div><span>车辆</span><strong>浙A·Q8E21</strong></div>
              <div><span>最高温升</span><strong>18.6 C / 10min</strong></div>
              <div><span>电压离散</span><strong>124 mV</strong></div>
              <div><span>判定结果</span><strong>热失控先兆高风险</strong></div>
            </div>
          </Panel>
        </section>

        <section v-else class="page-grid">
          <Panel title="模型结构说明" class="span-7">
            <div class="model-copy">
              <h3>多源时序风险评分模型</h3>
              <p>原型采用“规则阈值 + 时序特征评分 + 可解释权重”的展示逻辑，模拟从充电桩、车辆 BMS、红外温度与站端环境中融合风险信号。</p>
              <p>比赛展示时可将该模块替换为真实模型输出接口，目前所有结果均来自本地 mock 数据。</p>
            </div>
          </Panel>
          <Panel title="特征权重" class="span-5">
            <Chart :option="factorOption" height="320px" />
          </Panel>
          <Panel title="关键因子表" class="span-12">
            <el-table :data="modelFactors" stripe>
              <el-table-column prop="factor" label="风险因子" />
              <el-table-column prop="weight" label="权重">
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
import { computed } from 'vue'
import Chart from './components/Chart.vue'
import Panel from './components/Panel.vue'
import {
  alerts,
  evidenceSteps,
  modelFactors,
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

const activePage = defineModel({ default: 'overview' })
const currentPage = computed(() => pages.find((page) => page.key === activePage.value) || pages[0])

const chartText = '#4e6585'
const chartBlue = '#1d74ff'

const riskPieOption = {
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, textStyle: { color: chartText } },
  color: ['#2fc98e', '#62a8ff', '#f5b84b', '#f35f65'],
  series: [
    {
      type: 'pie',
      radius: ['46%', '72%'],
      center: ['50%', '44%'],
      data: riskDistribution,
      label: { color: chartText }
    }
  ]
}

const stationBarOption = {
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: chartText } },
  grid: { left: 36, right: 16, top: 48, bottom: 28 },
  xAxis: { type: 'category', data: stationLoad.map((item) => item.name), axisLabel: { color: chartText } },
  yAxis: { type: 'value', axisLabel: { color: chartText }, splitLine: { lineStyle: { color: '#e8f0fb' } } },
  color: [chartBlue, '#f35f65'],
  series: [
    { name: '负载率', type: 'bar', data: stationLoad.map((item) => item.load), barMaxWidth: 28 },
    { name: '风险指数', type: 'line', smooth: true, data: stationLoad.map((item) => item.risk) }
  ]
}

const riskLineOption = {
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: chartText } },
  grid: { left: 36, right: 18, top: 48, bottom: 28 },
  xAxis: { type: 'category', data: riskTimeline.map((item) => item.time), axisLabel: { color: chartText } },
  yAxis: { type: 'value', axisLabel: { color: chartText }, splitLine: { lineStyle: { color: '#e8f0fb' } } },
  color: ['#1d74ff', '#16b8a6', '#f5b84b', '#f35f65'],
  series: [
    { name: '热风险', type: 'line', smooth: true, areaStyle: { opacity: 0.08 }, data: riskTimeline.map((item) => item.thermal) },
    { name: '电压风险', type: 'line', smooth: true, data: riskTimeline.map((item) => item.voltage) },
    { name: '电流风险', type: 'line', smooth: true, data: riskTimeline.map((item) => item.current) },
    { name: '综合评分', type: 'line', smooth: true, lineStyle: { width: 4 }, data: riskTimeline.map((item) => item.score) }
  ]
}

const radarOption = {
  tooltip: {},
  color: [chartBlue],
  radar: {
    indicator: modelFactors.map((item) => ({ name: item.factor, max: 40 })),
    axisName: { color: chartText },
    splitLine: { lineStyle: { color: '#d9e8fb' } },
    splitArea: { areaStyle: { color: ['#f8fbff', '#eef6ff'] } }
  },
  series: [{ type: 'radar', data: [{ value: modelFactors.map((item) => item.weight), name: '权重' }], areaStyle: { opacity: 0.15 } }]
}

const alertDonutOption = {
  ...riskPieOption,
  color: ['#f35f65', '#f5b84b', '#62a8ff'],
  series: [{ ...riskPieOption.series[0], data: [{ value: 6, name: '高' }, { value: 8, name: '中' }, { value: 4, name: '低' }] }]
}

const evidenceLineOption = {
  ...riskLineOption,
  series: riskLineOption.series.slice(0, 3)
}

const factorOption = {
  tooltip: { trigger: 'axis' },
  grid: { left: 70, right: 20, top: 20, bottom: 24 },
  xAxis: { type: 'value', axisLabel: { color: chartText }, splitLine: { lineStyle: { color: '#e8f0fb' } } },
  yAxis: { type: 'category', data: modelFactors.map((item) => item.factor).reverse(), axisLabel: { color: chartText } },
  color: [chartBlue],
  series: [{ type: 'bar', data: modelFactors.map((item) => item.weight).reverse(), barMaxWidth: 18 }]
}
</script>
