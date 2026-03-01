<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content" :style="{ maxWidth: width }">
      <slot></slot> </div>
  </div>
</template>

<script setup>
defineEmits(['close']);

defineProps({
  width: {
    type: String,
    default: '500px'
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15,23,42,0.5);
  backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center;
  z-index: 50;
}
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
}
</style>
