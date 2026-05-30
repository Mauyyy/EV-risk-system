<template>
  <div ref="chartRef" class="chart" :style="{ height }"></div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  option: {
    type: Object,
    required: true
  },
  height: {
    type: String,
    default: '280px'
  }
})

const chartRef = ref(null)
let chart
let resizeObserver

const resize = () => chart?.resize()

onMounted(() => {
  chart = echarts.init(chartRef.value)
  chart.setOption(props.option)
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(chartRef.value)
  window.addEventListener('resize', resize)
  nextTick(resize)
})

watch(
  () => props.option,
  (option) => chart?.setOption(option, true),
  { deep: true }
)

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  resizeObserver?.disconnect()
  chart?.dispose()
})
</script>
