<script setup>
import { ref, onMounted, defineProps } from "vue";
import "../style/SettingsStyle/settings.css";

import { useCounterStore } from "../stores/store";
const useCounter = useCounterStore();

const props = defineProps({
  isOpen: Boolean,
});
</script>


<template>
  <div v-if="isOpen" class="settings">
    <div @click="useCounter.Reset" class="restart">Resetovat hru</div>
    <button @click="$emit('close')">Close</button>
  </div>
</template>