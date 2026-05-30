<template>
  <div class="app-shell" :class="{ 'screen-mode': activePage === 'screen' }">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">
          <ShieldCheck :size="28" />
        </div>
        <div>
          <strong>充安智护</strong>
          <span>校园两轮车充电安全监管系统</span>
        </div>
      </div>

      <nav class="nav-menu" aria-label="系统导航">
        <button
          v-for="page in pages"
          :key="page.key"
          :class="{ active: activePage === page.key }"
          type="button"
          @click="activePage = page.key"
        >
          <component :is="page.icon" :size="19" />
          <span>{{ page.label }}</span>
        </button>
      </nav>

      <div class="sidebar-panel">
        <p>今日处置闭环</p>
        <strong>18 / 23</strong>
        <span>5 条中高风险待复核</span>
        <div class="mini-progress">
          <i style="width: 78%"></i>
        </div>
      </div>
    </aside>

    <main class="workspace">
      <header class="topbar">
        <div>
          <p class="eyebrow">河南大学充电场站安全监管 · 本地原型运行中</p>
          <h1>{{ currentPage.label }}</h1>
        </div>
        <div class="top-actions">
          <div class="top-status">
            <Radio :size="17" />
            <span>数据刷新 5s</span>
          </div>
          <button class="icon-button" type="button" title="重置演示" @click="resetDemo">
            <RefreshCw :size="18" />
          </button>
          <button class="ghost-action" type="button" @click="openBigScreen">
            <MonitorUp :size="18" />
            <span>风险大屏</span>
          </button>
          <button class="primary-action" type="button" @click="jumpToHighRisk">
            <Bell :size="18" />
            <span>进入高风险事件</span>
          </button>
        </div>
      </header>

      <section v-if="activePage === 'overview'" class="page-grid">
        <article v-for="metric in overviewMetrics" :key="metric.label" class="metric-card" :class="metric.tone">
          <p>{{ metric.label }}</p>
          <strong>{{ metric.value }}<small>{{ metric.unit }}</small></strong>
          <span>{{ metric.trend }}</span>
        </article>

        <Panel title="系统健康" kicker="设备状态" class="span-12 health-panel">
          <div class="health-stack">
            <div>
              <span>摄像头在线率</span>
              <b>96.4%</b>
            </div>
            <div>
              <span>端口遥测接入</span>
              <b>438</b>
            </div>
            <div>
              <span>模型推理延迟</span>
              <b>128 ms</b>
            </div>
            <div>
              <span>工单同步</span>
              <b>正常</b>
            </div>
          </div>
        </Panel>

        <Panel title="校园充电场站地图" kicker="实时监管" class="span-5">
          <div class="campus-map">
            <img class="campus-map-photo" src="/assets/campus-charging-map.png" alt="校园充电场站俯视图" />
            <button
              v-for="site in chargingSites"
              :key="site.id"
              type="button"
              :class="['map-point', levelTone(site.riskLevel), site.id]"
              @click="selectedSiteId = site.id; activePage = 'monitor'"
            >
              <span>{{ site.mapName || site.name }}</span>
              <b>{{ site.riskScore }}</b>
            </button>
            <div class="map-zone dormitory">宿舍区</div>
            <div class="map-zone teaching">教学区</div>
            <div class="map-zone park">科创园</div>
          </div>
        </Panel>

        <Panel title="当前高风险事件" kicker="正在处置" class="span-4">
          <div class="active-incident">
            <div :class="['risk-badge', decision.tone]">
              <span>{{ decision.level }}</span>
              <strong>{{ decision.score }}</strong>
            </div>
            <h2>{{ selectedCase.title }}</h2>
            <p>{{ selectedCase.station }} · {{ selectedCase.port }} · {{ selectedCase.time }}</p>
            <div class="incident-actions">
              <button class="primary-action" type="button" @click="activePage = 'recognition'">
                <Camera :size="17" />
                <span>查看识别画面</span>
              </button>
              <button class="ghost-action" type="button" @click="activePage = 'alerts'">
                <ClipboardCheck :size="17" />
                <span>处理工单</span>
              </button>
            </div>
          </div>
        </Panel>

        <Panel title="实时预警队列" kicker="待复核" class="span-3 alert-queue-panel">
          <div class="overview-alert-list">
            <button
              v-for="alert in alerts.slice(0, 4)"
              :key="alert.id"
              type="button"
              class="overview-alert-item"
              @click="selectAlert(alert)"
            >
              <span :class="['level-pill', levelTone(alert.level)]">{{ alert.level }}</span>
              <b>{{ alert.type }}</b>
              <small>{{ alert.station }} · {{ alert.time.slice(11) }}</small>
            </button>
          </div>
        </Panel>

        <Panel title="全局风险趋势" kicker="今日态势" class="span-7">
          <Chart :option="riskTrendOption" height="310px" />
        </Panel>
        <Panel title="异常类型统计" kicker="今日告警" class="span-5">
          <Chart :option="riskTypeOption" height="310px" />
        </Panel>

        <Panel title="重点场站状态" kicker="站点队列" class="span-8">
          <div class="site-list compact">
            <button
              v-for="site in chargingSites"
              :key="site.id"
              type="button"
              :class="['site-row', levelTone(site.riskLevel)]"
              @click="selectedSiteId = site.id; activePage = 'monitor'"
            >
              <span>
                <b>{{ site.name }}</b>
                <small>{{ site.area }} · {{ site.activeSessions }} 个会话 · 负载 {{ site.load }}%</small>
              </span>
              <strong>{{ site.riskScore }}</strong>
            </button>
          </div>
        </Panel>

        <Panel title="处置闭环" kicker="流程状态" class="span-4">
          <div class="loop-list">
            <div v-for="(step, index) in closedLoopSteps" :key="step.title" class="loop-item">
              <i>{{ index + 1 }}</i>
              <span>
                <b>{{ step.title }}</b>
                <small>{{ step.desc }}</small>
              </span>
              <em>{{ step.status }}</em>
            </div>
          </div>
        </Panel>
      </section>

      <section v-else-if="activePage === 'monitor'" class="page-grid">
        <Panel title="充电场站列表" kicker="在线监测" class="span-4">
          <div class="site-list">
            <button
              v-for="site in chargingSites"
              :key="site.id"
              type="button"
              :class="['site-row', { active: selectedSiteId === site.id }, levelTone(site.riskLevel)]"
              @click="selectedSiteId = site.id"
            >
              <span>
                <b>{{ site.name }}</b>
                <small>{{ site.onlinePorts }}/{{ site.totalPorts }} 端口在线 · 负载 {{ site.load }}%</small>
              </span>
              <strong>{{ site.riskScore }}</strong>
            </button>
          </div>
        </Panel>

        <Panel title="当前场站端口" kicker="风险概览" class="span-8">
          <div class="station-profile">
            <div>
              <p>{{ selectedSite.area }}</p>
              <h2>{{ selectedSite.name }}</h2>
              <div class="tag-row">
                <span v-for="tag in selectedSite.tags" :key="tag">{{ tag }}</span>
              </div>
            </div>
            <div :class="['risk-badge', levelTone(selectedSite.riskLevel)]">
              <span>{{ selectedSite.riskLevel }}</span>
              <strong>{{ selectedSite.riskScore }}</strong>
            </div>
          </div>
          <div class="port-grid">
            <button
              v-for="port in stationPorts"
              :key="port.code"
              type="button"
              :class="['port-cell', port.tone]"
              @click="openCaseFromPort(port.caseId)"
            >
              <span>{{ port.code }}</span>
              <b>{{ port.score }}</b>
            </button>
          </div>
        </Panel>

        <Panel title="场站风险分布" kicker="站点对比" class="span-6">
          <Chart :option="siteRiskOption" height="320px" />
        </Panel>
        <Panel title="短时风险曲线" kicker="当前样本" class="span-6">
          <Chart :option="caseSequenceOption" height="320px" />
        </Panel>

        <Panel title="风险事件队列" kicker="待处理" class="span-12">
          <el-table :data="alerts" stripe class="alert-table" @row-click="selectAlert">
            <el-table-column prop="id" label="事件编号" min-width="160" />
            <el-table-column prop="station" label="点位" min-width="210" />
            <el-table-column prop="type" label="异常类型" min-width="170" />
            <el-table-column label="等级" width="110">
              <template #default="{ row }">
                <span :class="['level-pill', levelTone(row.level)]">{{ row.level }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="时间" min-width="160" />
            <el-table-column prop="status" label="状态" width="130" />
            <el-table-column prop="owner" label="责任人" width="120" />
          </el-table>
        </Panel>
      </section>

      <section v-else-if="activePage === 'recognition'" class="page-grid">
        <div class="case-tabs span-12">
          <button
            v-for="caseItem in riskCases"
            :key="caseItem.id"
            type="button"
            :class="{ active: selectedCaseId === caseItem.id }"
            @click="selectedCaseId = caseItem.id"
          >
            <span>{{ caseItem.title }}</span>
            <b>{{ caseItem.levelHint }}</b>
          </button>
        </div>

        <Panel title="摄像头识别画面" kicker="CAM-A区-12" class="span-7">
          <template #action>
            <button class="ghost-action small" type="button" @click="simulateUpload">
              <UploadCloud :size="16" />
              <span>载入样例</span>
            </button>
          </template>
          <div class="camera-scene" :class="selectedCase.id">
            <img class="camera-frame" :src="selectedCase.image" :alt="selectedCase.title" />
            <div class="camera-toolbar">
              <span>{{ selectedCase.station }} · {{ selectedCase.port }}</span>
              <b>{{ selectedCase.time }}</b>
            </div>
            <div
              v-for="detection in selectedCase.detections"
              :key="detection.label"
              :class="['detection-box', detection.severity]"
              :style="boxStyle(detection)"
            >
              <span>{{ detection.label }} {{ Math.round(detection.confidence * 100) }}%</span>
            </div>
          </div>
          <div class="evidence-strip">
            <span v-for="detection in selectedCase.detections" :key="detection.label">
              {{ detection.label }} · {{ Math.round(detection.confidence * 100) }}%
            </span>
          </div>
        </Panel>

        <Panel title="融合风险输出" kicker="双模态决策" class="span-5">
          <div :class="['decision-card', decision.tone]">
            <span>{{ selectedCase.station }} · {{ selectedCase.port }}</span>
            <strong>{{ decision.level }}</strong>
            <b>{{ decision.score }}</b>
          </div>

          <div class="weight-panel">
            <div>
              <span>时序权重</span>
              <strong>{{ percent(decision.tsWeight) }}</strong>
              <i><em :style="{ width: percent(decision.tsWeight) }"></em></i>
            </div>
            <div>
              <span>视觉权重</span>
              <strong>{{ percent(decision.visionWeight) }}</strong>
              <i><em :style="{ width: percent(decision.visionWeight) }"></em></i>
            </div>
          </div>

          <div class="feature-grid">
            <div>
              <span>温升率</span>
              <b>{{ decision.features.tempSlope }} C/min</b>
            </div>
            <div>
              <span>电流波动</span>
              <b>{{ decision.features.currentRange }} A</b>
            </div>
            <div>
              <span>功率波动</span>
              <b>{{ decision.features.powerRange }} W</b>
            </div>
            <div>
              <span>规则兜底</span>
              <b>{{ decision.hasHardRule ? '已触发' : '未触发' }}</b>
            </div>
          </div>
        </Panel>

        <Panel title="短时窗口分析" kicker="3 / 5 / 10 分钟" class="span-7">
          <template #action>
            <div class="segmented">
              <button
                v-for="minute in windowOptions"
                :key="minute"
                :class="{ active: windowMinutes === minute }"
                type="button"
                @click="windowMinutes = minute"
              >
                {{ minute }} min
              </button>
            </div>
          </template>
          <Chart :option="caseSequenceOption" height="330px" />
        </Panel>

        <Panel title="处置建议" kicker="输出结果" class="span-5">
          <div class="advice-list">
            <div v-for="item in decision.advice" :key="item">
              <CheckCircle2 :size="18" />
              <span>{{ item }}</span>
            </div>
          </div>
          <div class="quality-list">
            <div>
              <span>时序数据质量</span>
              <el-progress :percentage="selectedCase.dataQuality" :stroke-width="9" color="#3559c7" />
            </div>
            <div>
              <span>图像清晰度</span>
              <el-progress :percentage="selectedCase.imageQuality" :stroke-width="9" color="#249f9a" />
            </div>
            <div>
              <span>遮挡程度</span>
              <el-progress :percentage="selectedCase.occlusion" :stroke-width="9" color="#d99a20" />
            </div>
          </div>
        </Panel>
      </section>

      <section v-else-if="activePage === 'screen'" class="big-screen">
        <div class="screen-top">
          <div class="screen-title-block">
            <p>充安智护 · Campus Charging Safety Operation Center</p>
            <h2>充电风险识别与分级预警大屏</h2>
          </div>
          <div class="screen-stat-strip">
            <div>
              <span>在线端口</span>
              <b>438</b>
            </div>
            <div>
              <span>中高风险</span>
              <b>10</b>
            </div>
            <div>
              <span>闭环完成</span>
              <b>78%</b>
            </div>
          </div>
          <div class="screen-actions">
            <button class="screen-fullscreen" type="button" @click="toggleFullscreen">
              <component :is="isFullscreen ? Minimize2 : Maximize2" :size="18" />
              <span>{{ isFullscreen ? '退出全屏' : '全屏' }}</span>
            </button>
            <button class="screen-fullscreen" type="button" @click="activePage = 'overview'">
              返回系统
            </button>
          </div>
        </div>

        <div class="screen-grid">
          <section class="screen-card overview-card">
            <h3>风险概览</h3>
            <div class="screen-metric-stack">
              <div class="screen-metric danger">
                <span>今日预警事件</span>
                <strong>23</strong>
                <small>未处理 12 条</small>
              </div>
              <div class="screen-metric warning">
                <span>中高风险点位</span>
                <strong>10</strong>
                <small>较昨日 +3</small>
              </div>
              <div class="screen-metric success">
                <span>闭环完成率</span>
                <strong>78%</strong>
                <small>18 / 23</small>
              </div>
            </div>
            <div class="screen-loop">
              <span>感知</span>
              <i></i>
              <span>分级</span>
              <i></i>
              <span>处置</span>
            </div>
          </section>

          <section class="screen-card trend-card">
            <h3>风险趋势分析</h3>
            <Chart :option="screenTrendOption" height="100%" />
          </section>

          <section class="screen-card type-card">
            <h3>风险类型分析</h3>
            <Chart :option="screenTypeOption" height="100%" />
          </section>

          <section class="screen-card ranking-card">
            <h3>告警处理 TOP5</h3>
            <div class="ranking-row" v-for="item in riskTypeStats.slice(0, 5)" :key="item.name">
              <span>{{ item.name }}</span>
              <i><em :style="{ width: `${item.value * 10}%` }"></em></i>
              <b>{{ item.value * 4 }}</b>
            </div>
          </section>

          <section class="screen-card distribution-card">
            <h3>风险时空分布</h3>
            <Chart :option="screenDistributionOption" height="100%" />
          </section>

          <section class="screen-card map-card">
            <h3>风险分布地图</h3>
            <div class="screen-map">
              <img class="screen-map-photo" src="/assets/campus-charging-map.png" alt="校园充电场站风险分布" />
              <button
                v-for="site in chargingSites"
                :key="site.id"
                :class="['screen-point', levelTone(site.riskLevel), site.id]"
                type="button"
              >
                <span>{{ site.mapName || site.name }}</span>
                <b>{{ site.riskScore }}</b>
              </button>
            </div>
          </section>

          <section class="screen-card realtime-card">
            <h3>实时预警信息</h3>
            <div class="screen-alert-list">
              <div class="screen-alert" v-for="alert in alerts" :key="alert.id">
                <span :class="levelTone(alert.level)">{{ alert.level }}</span>
                <b>{{ alert.type }}</b>
                <small>{{ alert.station }} · {{ alert.time.slice(11) }}</small>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section v-else-if="activePage === 'alerts'" class="page-grid">
        <Panel title="告警处置台" kicker="闭环响应" class="span-8">
          <el-table :data="alerts" stripe class="alert-table" highlight-current-row @row-click="selectAlert">
            <el-table-column prop="id" label="事件编号" min-width="160" />
            <el-table-column prop="station" label="点位" min-width="210" />
            <el-table-column prop="type" label="异常类型" min-width="170" />
            <el-table-column label="等级" width="110">
              <template #default="{ row }">
                <span :class="['level-pill', levelTone(row.level)]">{{ row.level }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="130" />
          </el-table>
        </Panel>

        <Panel title="事件详情" kicker="当前选中" class="span-4">
          <div class="alert-detail">
            <span :class="['level-pill', levelTone(selectedAlert.level)]">{{ selectedAlert.level }}</span>
            <h2>{{ selectedAlert.station }}</h2>
            <p>{{ selectedAlert.type }}</p>
            <dl>
              <div>
                <dt>事件编号</dt>
                <dd>{{ selectedAlert.id }}</dd>
              </div>
              <div>
                <dt>责任人</dt>
                <dd>{{ selectedAlert.owner }}</dd>
              </div>
              <div>
                <dt>建议</dt>
                <dd>{{ selectedAlert.response }}</dd>
              </div>
            </dl>
            <div class="action-row">
              <button class="ghost-action" type="button" @click="advanceHandling">
                <ClipboardCheck :size="17" />
                <span>复核进度</span>
              </button>
              <button class="primary-action" type="button" @click="finishHandling">
                <ShieldCheck :size="17" />
                <span>闭环归档</span>
              </button>
            </div>
          </div>
        </Panel>

        <Panel title="处理链路" kicker="可追溯记录" class="span-12">
          <div class="process-line">
            <div v-for="(step, index) in handlingSteps" :key="step.title" :class="{ done: index <= handlingIndex }">
              <i>
                <component :is="index <= handlingIndex ? CheckCircle2 : Clock3" :size="18" />
              </i>
              <span>{{ step.title }}</span>
              <small>{{ step.desc }}</small>
            </div>
          </div>
        </Panel>
      </section>

      <section v-else-if="activePage === 'model'" class="page-grid">
        <Panel title="模型运行链路" kicker="系统配置" class="span-12">
          <div class="pipeline">
            <div v-for="(item, index) in techPipeline" :key="item.title">
              <i>{{ String(index + 1).padStart(2, '0') }}</i>
              <span>{{ item.title }}</span>
              <small>{{ item.desc }}</small>
            </div>
          </div>
        </Panel>

        <Panel title="融合配置" kicker="置信度感知" class="span-5">
          <div class="formula-box">
            <div class="equation-row">
              <span class="math-symbol">z<sub>ts</sub></span>
              <span>=</span>
              <span>g<sub>ts</sub>(c<sub>ts</sub>, s<sub>ts</sub>)</span>
            </div>
            <div class="equation-row">
              <span class="math-symbol">z<sub>vi</sub></span>
              <span>=</span>
              <span>g<sub>vi</sub>(c<sub>vi</sub>, s<sub>vi</sub>)</span>
            </div>
            <div class="equation-row">
              <span class="math-symbol">w<sub>ts</sub></span>
              <span>=</span>
              <em class="fraction">
                <b>exp(z<sub>ts</sub>)</b>
                <b>exp(z<sub>ts</sub>) + exp(z<sub>vi</sub>)</b>
              </em>
            </div>
            <div class="equation-row">
              <span class="math-symbol">w<sub>vi</sub></span>
              <span>=</span>
              <em class="fraction">
                <b>exp(z<sub>vi</sub>)</b>
                <b>exp(z<sub>ts</sub>) + exp(z<sub>vi</sub>)</b>
              </em>
            </div>
            <div class="equation-final">
              s<sub>f</sub> = w<sub>ts</sub>s<sub>ts</sub> + w<sub>vi</sub>s<sub>vi</sub>
            </div>
            <div class="formula-legend">
              <span>c：模态置信度</span>
              <span>s：风险分数</span>
              <span>ts：时序数据</span>
              <span>vi：视觉识别</span>
            </div>
          </div>
          <div class="model-note">
            当前策略：数据驱动输出风险分数，消防红线规则只在最终输出层执行强制上调，避免模型结论违背安全底线。
          </div>
        </Panel>

        <Panel title="窗口效果对比" kicker="实验指标" class="span-7">
          <Chart :option="windowCompareOption" height="330px" />
        </Panel>

        <Panel title="关键因子权重" kicker="可解释输出" class="span-6">
          <Chart :option="factorOption" height="330px" />
        </Panel>

        <Panel title="模型因子说明" kicker="分级依据" class="span-6">
          <div class="factor-list">
            <div v-for="factor in modelFactors" :key="factor.factor">
              <span>{{ factor.factor }}</span>
              <el-progress :percentage="factor.weight" :stroke-width="8" />
              <small>{{ factor.desc }}</small>
            </div>
          </div>
        </Panel>
      </section>

      <section v-else class="page-grid">
        <Panel title="移动端告警" kicker="值班员视图" class="span-5">
          <div class="phone">
            <div class="phone-top">
              <span>告警消息</span>
              <b>{{ mobileMessages.length }}</b>
            </div>
            <div class="phone-alert" v-for="message in mobileMessages" :key="message.title">
              <span :class="levelTone(message.level)">{{ message.level }}</span>
              <strong>{{ message.title }}</strong>
              <small>{{ message.station }} · {{ message.time }} · {{ message.status }}</small>
            </div>
          </div>
        </Panel>

        <Panel title="联动控制台" kicker="设备与工单" class="span-7">
          <div class="response-console">
            <div class="control-card danger">
              <Bell :size="20" />
              <span>高风险广播</span>
              <b>已推送</b>
            </div>
            <div class="control-card warning">
              <Zap :size="20" />
              <span>A12 端口降功率</span>
              <b>待确认</b>
            </div>
            <div class="control-card success">
              <CheckCircle2 :size="20" />
              <span>现场复拍</span>
              <b>已回传</b>
            </div>
            <div class="dispatch-board">
              <h2>处置任务</h2>
              <div v-for="alert in alerts.slice(0, 3)" :key="alert.id">
                <span :class="['level-pill', levelTone(alert.level)]">{{ alert.level }}</span>
                <b>{{ alert.station }}</b>
                <small>{{ alert.response }}</small>
              </div>
            </div>
          </div>
        </Panel>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Bell,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Cpu,
  LayoutDashboard,
  MapPinned,
  Maximize2,
  Minimize2,
  MonitorUp,
  Radio,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  UploadCloud,
  Zap
} from 'lucide-vue-next'
import Chart from './components/Chart.vue'
import Panel from './components/Panel.vue'
import {
  alerts,
  chargingSites,
  closedLoopSteps,
  mobileMessages,
  modelFactors,
  overviewMetrics,
  riskCases,
  riskTimeline,
  riskTypeStats,
  techPipeline,
  windowComparison
} from './mock'
import { buildRiskDecision, levelTone } from './riskEngine'

const pages = [
  { key: 'overview', label: '运行驾驶舱', icon: LayoutDashboard },
  { key: 'monitor', label: '场站监测', icon: MapPinned },
  { key: 'recognition', label: 'AI 风险识别', icon: Camera },
  { key: 'screen', label: '风险大屏', icon: MonitorUp },
  { key: 'alerts', label: '告警工单', icon: Bell },
  { key: 'model', label: '模型配置', icon: Cpu },
  { key: 'mobile', label: '移动联动', icon: Smartphone }
]

const activePage = ref('overview')
const selectedSiteId = ref(chargingSites[0].id)
const selectedCaseId = ref(riskCases[0].id)
const selectedAlertId = ref(alerts[0].id)
const windowMinutes = ref(5)
const handlingIndex = ref(1)
const isFullscreen = ref(false)
const windowOptions = [3, 5, 10]

const chartText = '#324155'
const gridColor = '#d9e2ef'
const palette = ['#2563eb', '#06b6d4', '#f59e0b', '#ef4444', '#22c55e', '#8b5cf6']
const sequenceColors = {
  risk: '#3559c7',
  temp: '#d9665b',
  current: '#249f9a',
  power: '#d99a20'
}

const currentPage = computed(() => pages.find((page) => page.key === activePage.value) || pages[0])
const selectedSite = computed(() => chargingSites.find((site) => site.id === selectedSiteId.value) || chargingSites[0])
const selectedCase = computed(() => riskCases.find((caseItem) => caseItem.id === selectedCaseId.value) || riskCases[0])
const selectedAlert = computed(() => alerts.find((alert) => alert.id === selectedAlertId.value) || alerts[0])
const decision = computed(() => buildRiskDecision(selectedCase.value, windowMinutes.value))

watch(activePage, () => {
  requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 }))
})

const stationPorts = computed(() => {
  const base = ['A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09', 'A10', 'A11', 'A12']
  return base.map((code, index) => {
    const score = index === 11 && selectedSite.value.id === 'east-yard' ? 91 : Math.max(18, selectedSite.value.riskScore - 28 + index * 3)
    return {
      code,
      score,
      tone: levelTone(score >= 80 ? '高风险' : score >= 50 ? '中风险' : '低风险'),
      caseId: index === 11 ? 'case-a12' : index % 4 === 0 ? 'case-c03' : 'case-d01'
    }
  })
})

const handlingSteps = computed(() => [
  { title: '系统记录', desc: selectedAlert.value.id },
  { title: '告警推送', desc: selectedAlert.value.owner },
  { title: '现场复核', desc: selectedAlert.value.status },
  { title: '联动干预', desc: selectedAlert.value.response },
  { title: '归档复盘', desc: '更新阈值与规则记录' }
])

const axis = {
  axisLabel: { color: chartText },
  axisLine: { lineStyle: { color: '#c8d5e6' } },
  splitLine: { lineStyle: { color: gridColor } }
}

const riskTrendOption = computed(() => ({
  color: palette,
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: chartText } },
  grid: { left: 42, right: 22, top: 46, bottom: 32 },
  xAxis: { type: 'category', data: riskTimeline.map((item) => item.time), axisLabel: { color: chartText } },
  yAxis: { type: 'value', ...axis },
  series: [
    { name: '低风险', type: 'bar', stack: 'risk', barWidth: 16, data: riskTimeline.map((item) => item.low) },
    { name: '中风险', type: 'bar', stack: 'risk', data: riskTimeline.map((item) => item.medium) },
    { name: '高风险', type: 'bar', stack: 'risk', data: riskTimeline.map((item) => item.high) },
    {
      name: '综合指数',
      type: 'line',
      smooth: true,
      symbolSize: 8,
      lineStyle: { width: 3 },
      data: riskTimeline.map((item) => item.score)
    }
  ]
}))

const riskTypeOption = computed(() => ({
  color: palette,
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, textStyle: { color: chartText } },
  series: [
    {
      type: 'pie',
      radius: ['48%', '70%'],
      center: ['50%', '44%'],
      label: { show: false },
      labelLine: { show: false },
      data: riskTypeStats
    }
  ]
}))

const siteRiskOption = computed(() => ({
  color: ['#2563eb', '#f59e0b', '#ef4444'],
  tooltip: { trigger: 'axis' },
  grid: { left: 42, right: 18, top: 30, bottom: 70 },
  xAxis: {
    type: 'category',
    data: chargingSites.map((site) => site.name),
    axisLabel: { color: chartText, interval: 0, rotate: 18 }
  },
  yAxis: { type: 'value', max: 100, ...axis },
  series: [
    {
      name: '风险指数',
      type: 'bar',
      barWidth: 22,
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: (params) => {
          const value = chargingSites[params.dataIndex].riskScore
          if (value >= 80) return '#ef4444'
          if (value >= 50) return '#f59e0b'
          return '#22c55e'
        }
      },
      data: chargingSites.map((site) => site.riskScore)
    }
  ]
}))

const caseSequenceOption = computed(() => ({
  color: [sequenceColors.risk, sequenceColors.temp, sequenceColors.current, sequenceColors.power],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderColor: '#d7e1ec',
    textStyle: { color: '#253142' },
    extraCssText: 'box-shadow:0 14px 34px rgba(31,56,88,.16);border-radius:8px;'
  },
  legend: { top: 0, textStyle: { color: chartText } },
  grid: { left: 42, right: 18, top: 46, bottom: 32 },
  xAxis: {
    type: 'category',
    data: selectedCase.value.sequence.map((item) => `${item.minute}m`),
    axisLabel: { color: chartText }
  },
  yAxis: [
    { type: 'value', name: '分数/温度', ...axis },
    { type: 'value', name: '功率', ...axis }
  ],
  series: [
    {
      name: '风险分数',
      type: 'line',
      smooth: true,
      symbolSize: 8,
      lineStyle: { width: 4, color: sequenceColors.risk },
      itemStyle: { color: sequenceColors.risk },
      areaStyle: { color: 'rgba(53, 89, 199, 0.10)' },
      data: selectedCase.value.sequence.map((item) => item.score),
      markLine: {
        data: [{ xAxis: `${windowMinutes.value}m`, name: '当前窗口' }],
        lineStyle: { color: '#64748b', type: 'dashed' },
        label: { color: chartText }
      }
    },
    {
      name: '温度',
      type: 'line',
      smooth: true,
      symbolSize: 7,
      lineStyle: { width: 3, color: sequenceColors.temp },
      itemStyle: { color: sequenceColors.temp },
      data: selectedCase.value.sequence.map((item) => item.temp)
    },
    {
      name: '电流',
      type: 'line',
      smooth: true,
      symbolSize: 7,
      lineStyle: { width: 3, color: sequenceColors.current },
      itemStyle: { color: sequenceColors.current },
      data: selectedCase.value.sequence.map((item) => item.current * 6)
    },
    {
      name: '功率',
      type: 'bar',
      yAxisIndex: 1,
      barWidth: 14,
      itemStyle: { color: 'rgba(217, 154, 32, 0.76)', borderRadius: [4, 4, 0, 0] },
      data: selectedCase.value.sequence.map((item) => item.power)
    }
  ]
}))

const windowCompareOption = computed(() => ({
  color: palette,
  tooltip: { trigger: 'axis' },
  legend: { top: 0, textStyle: { color: chartText } },
  grid: { left: 42, right: 22, top: 48, bottom: 34 },
  xAxis: { type: 'category', data: windowComparison.map((item) => item.window), axisLabel: { color: chartText } },
  yAxis: { type: 'value', max: 100, ...axis },
  series: [
    { name: '高风险召回率', type: 'bar', barWidth: 16, data: windowComparison.map((item) => item.recall) },
    { name: '精确率', type: 'bar', barWidth: 16, data: windowComparison.map((item) => item.precision) },
    { name: '稳定性', type: 'line', smooth: true, lineStyle: { width: 3 }, data: windowComparison.map((item) => item.stability) }
  ]
}))

const factorOption = computed(() => ({
  color: ['#2563eb'],
  tooltip: { trigger: 'axis' },
  grid: { left: 82, right: 24, top: 20, bottom: 24 },
  xAxis: { type: 'value', max: 40, ...axis },
  yAxis: {
    type: 'category',
    data: modelFactors.map((item) => item.factor),
    axisLabel: { color: chartText }
  },
  series: [
    {
      type: 'bar',
      barWidth: 16,
      data: modelFactors.map((item) => item.weight),
      itemStyle: { borderRadius: [0, 4, 4, 0] }
    }
  ]
}))

const screenAxis = {
  axisLabel: { color: '#a9c7ee', fontSize: 11 },
  axisLine: { lineStyle: { color: '#285273' } },
  splitLine: { lineStyle: { color: 'rgba(125, 211, 252, 0.14)' } }
}

const screenTrendOption = computed(() => ({
  color: ['#38bdf8', '#fbbf24', '#f472b6'],
  tooltip: { trigger: 'axis' },
  legend: { top: 0, itemWidth: 16, itemHeight: 9, textStyle: { color: '#b8d7ff', fontSize: 11 } },
  grid: { left: 40, right: 20, top: 36, bottom: 24 },
  xAxis: { type: 'category', data: riskTimeline.map((item) => item.time), ...screenAxis },
  yAxis: { type: 'value', ...screenAxis },
  series: [
    { name: '低风险', type: 'line', smooth: true, symbolSize: 6, areaStyle: { opacity: 0.16 }, data: riskTimeline.map((item) => item.low) },
    { name: '中风险', type: 'line', smooth: true, symbolSize: 6, data: riskTimeline.map((item) => item.medium * 2) },
    { name: '高风险', type: 'bar', barWidth: 12, itemStyle: { borderRadius: [4, 4, 0, 0] }, data: riskTimeline.map((item) => item.high * 6) }
  ]
}))

const screenTypeOption = computed(() => ({
  color: ['#38bdf8', '#fbbf24', '#f472b6', '#34d399', '#fb7185'],
  tooltip: { trigger: 'item' },
  radar: {
    center: ['50%', '54%'],
    radius: '68%',
    indicator: riskTypeStats.slice(0, 5).map((item) => ({ name: item.name, max: 10 })),
    axisName: { color: '#b8d7ff', fontSize: 11 },
    splitLine: { lineStyle: { color: 'rgba(125, 211, 252, 0.2)' } },
    splitArea: { areaStyle: { color: ['rgba(20, 184, 166, 0.08)', 'rgba(15, 23, 42, 0.08)'] } },
    axisLine: { lineStyle: { color: 'rgba(125, 211, 252, 0.2)' } }
  },
  series: [
    {
      type: 'radar',
      data: [{ value: riskTypeStats.slice(0, 5).map((item) => item.value), name: '关联度' }],
      areaStyle: { opacity: 0.28 }
    }
  ]
}))

const screenDistributionOption = computed(() => ({
  color: ['#38bdf8', '#fbbf24', '#f472b6'],
  tooltip: { trigger: 'axis' },
  legend: { top: 0, itemWidth: 16, itemHeight: 9, textStyle: { color: '#b8d7ff', fontSize: 11 } },
  grid: { left: 40, right: 20, top: 34, bottom: 24 },
  xAxis: { type: 'category', data: riskTimeline.map((item) => item.time), ...screenAxis },
  yAxis: { type: 'value', ...screenAxis },
  series: [
    { name: '风险脉冲', type: 'bar', barWidth: 10, itemStyle: { borderRadius: [4, 4, 0, 0] }, data: riskTimeline.map((item) => item.score) },
    { name: '高风险预测', type: 'line', smooth: true, symbolSize: 6, lineStyle: { width: 3 }, data: riskTimeline.map((item) => item.score + item.high * 3) }
  ]
}))

function percent(value) {
  return `${Math.round(value * 100)}%`
}

function boxStyle(detection) {
  return {
    left: `${detection.x}%`,
    top: `${detection.y}%`,
    width: `${detection.w}%`,
    height: `${detection.h}%`
  }
}

function selectAlert(alert) {
  selectedAlertId.value = alert.id
  const relatedCase = riskCases.find((caseItem) => caseItem.id === alert.caseId)
  if (relatedCase) selectedCaseId.value = relatedCase.id
  activePage.value = 'alerts'
}

function openCaseFromPort(caseId) {
  selectedCaseId.value = caseId
  activePage.value = 'recognition'
}

function jumpToHighRisk() {
  selectedCaseId.value = 'case-a12'
  selectedAlertId.value = alerts[0].id
  activePage.value = 'recognition'
}

function openBigScreen() {
  activePage.value = 'screen'
  requestScreenFullscreen()
}

async function requestScreenFullscreen() {
  const target = document.documentElement
  if (!document.fullscreenElement && target.requestFullscreen) {
    try {
      await target.requestFullscreen()
      isFullscreen.value = true
    } catch {
      isFullscreen.value = Boolean(document.fullscreenElement)
    }
  }
}

async function toggleFullscreen() {
  if (document.fullscreenElement) {
    await document.exitFullscreen?.()
    isFullscreen.value = false
  } else {
    await requestScreenFullscreen()
  }
}

function simulateUpload() {
  ElMessage.success('已载入 A 区摄像头样例帧')
}

function advanceHandling() {
  handlingIndex.value = Math.min(handlingIndex.value + 1, handlingSteps.value.length - 1)
  ElMessage.success('处置进度已更新')
}

function finishHandling() {
  handlingIndex.value = handlingSteps.value.length - 1
  ElMessage.success('事件已完成闭环归档')
}

function resetDemo() {
  activePage.value = 'overview'
  selectedSiteId.value = chargingSites[0].id
  selectedCaseId.value = riskCases[0].id
  selectedAlertId.value = alerts[0].id
  windowMinutes.value = 5
  handlingIndex.value = 1
}
</script>
