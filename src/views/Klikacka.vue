<script setup>
//import { useMounted } from "@vueuse/core";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import Character from "../components/Character.vue";
import Popup from "../components/Popup.vue";
import Settings from "../components/Settings.vue";
import Shop from "../components/Shop.vue";

import { useCounterStore } from "../stores/store";
const useCounter = useCounterStore();

import { useCharacterStore } from "../stores/storeCharacter";
const useCharacter = useCharacterStore();
let temp;
const computedCoins = computed(() =>
  Math.round(useCounter.coins)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
);

const isSettingsOpen = ref(false);
const openSettings = () => {
  isSettingsOpen.value = true;
};
const closeSettings = () => {
  isSettingsOpen.value = false;
};
const isShopOpen = ref(false);
const openShop = () => {
  isShopOpen.value = true;
};
const closeShop = () => {
  isShopOpen.value = false;
};

let earnMoneyPassiveInterval;
let SaveTime;

onMounted(() => {
  useCounter.OfflineEarnings();

  earnMoneyPassiveInterval = setInterval(() => {
    useCounter.earnMoneyPassive();
  }, 50);

  SaveTime = setInterval(() => {
    useCounter.SaveTime();
  }, 10000);
});

onBeforeUnmount(() => {
  clearInterval(earnMoneyPassiveInterval);
  clearInterval(SaveTime);
});

</script>

<template>
  <div class="all">
    <Popup />
    <Settings :isOpen="isSettingsOpen" @close="closeSettings" />
    <Shop :isOpen="isShopOpen" @close="closeShop" />
    <div class="leftWrap">
      <div class="coins">
        <!-- <div>{{ useCounter.coins }}&nbsp;</div> -->
        <div>{{ computedCoins }}&nbsp;</div>
        <i class="fa-solid fa-coins"></i>
      </div>

      <div class="shopMenu">
        <div class="shopNav">
          <button class="shop">
            <i class="fa-solid fa-bowl-rice"></i>
          </button>

          <button class="shop">
            <img src="/img/chopsticks.png" alt="" />
          </button>

          <button class="shop">
            <img src="/img/noodle.png" alt="" />
          </button>
        </div>

        <!-- <Level1/> -->
        <Character />
      </div>
    </div>
    <div class="rightWrap">
      <div class="skills">
        <i
          @click="useCounter.Skill1"
          id="skill"
          class="fa-solid fa-hand-pointer"
        ></i>
        <i id="skill" class="fa-solid fa-coins"></i>
      </div>
      <div class="clicker">
        <!-- <img id="clicker" src="/img/coin.png" alt="" /> -->
        <img id="clicker" src="/img/ramen.png" @click="useCounter.addCoins" />
      </div>
      <div class="navSettings">
        <i @click="openSettings" class="fa-solid fa-gear"></i>
        <i @click="openShop" class="fa-solid fa-cart-shopping"></i>
      </div>
    </div>
  </div>
</template>
