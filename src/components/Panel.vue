<template>
  <article class="panel">
    <header>
      <h3>{{ title }}</h3>
      <span></span>
    </header>
    <slot />
  </article>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>
