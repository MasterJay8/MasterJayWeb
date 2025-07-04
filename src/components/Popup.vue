<script setup>
import { ref, onMounted } from "vue";
import "../style/PopupStyle/Popup.css";

import { useCounterStore } from "../stores/store";
const useCounter = useCounterStore();

const showPopup = ref(false);

//const mainContent = document.querySelector(':root')

function closePopup() {
  showPopup.value = false;
  //mainContent.style.pointerEvents = "auto";
}
//onMounted((showPopup.value = true, mainContent.style.pointerEvents = 'none'))

onMounted(() => {
  showPopup.value = true
})
</script>


<template>
    <div v-if="showPopup" class="popup">
      <h2>Offline Time: {{ useCounter.offlineTime }}</h2>
      <h2>
        Coins Earned: {{ useCounter.offlineMoneyEarned }}
        <i class="fa-solid fa-coins"></i>
      </h2>
      <button @click="closePopup">Close</button>
    </div>
</template>