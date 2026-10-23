<script setup>
import { ref, onMounted, defineProps } from "vue";
import "../../styles/clickerStyle/ShopStyle/shop.css";

import { useCounterStore } from "../../stores/store";
const useCounter = useCounterStore();

const props = defineProps({
  isOpen: Boolean,
});
</script>


<template>
  <div v-if="isOpen" class="settings">
    <div class="item">
      <img src="/clicker/Trophy.png" alt="">
      <div class="buy">Koupit Trofej</div>
    </div>

    <button @click="$emit('close')">Close</button>
  </div>
</template>