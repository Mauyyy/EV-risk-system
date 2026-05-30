<template>
  <section class="panel">
    <header class="panel-header">
      <div>
        <p v-if="kicker">{{ kicker }}</p>
        <h3>{{ title }}</h3>
      </div>
      <slot name="action" />
    </header>
    <slot />
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  kicker: {
    type: String,
    default: ''
  }
})
</script>
