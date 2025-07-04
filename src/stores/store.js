import { ref, computed, onUpdated } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

import { useCharacterStore } from './storeCharacter';

export const useCounterStore = defineStore('counter', () => {
  const CharacterStore = useCharacterStore();

  const coins = ref(useLocalStorage("Counter", 0))
  const lastActiveTime = ref(useLocalStorage("LogOutDate", 0))
  const coinsPerSecond = ref(useLocalStorage("PassiveMoney", 0))
  const offlineTimeSeconds = ref(useLocalStorage("AFK", 0))
  const offlineTime = ref(0)
  const offlineMoneyEarned = ref(0)

  const superClicks = ref(0)

  var lastClickTime = 0;
  var clickThreshold = 77;

  function addCoins() {
    Autoclicker()
    coins.value += coinsAddCalc()
  }
  function coinsAddCalc() {
    let getCoins = 1 + (coinsPerSecond.value * 0.2)
    if (superClicks.value > 0) {
      getCoins *= 1.5
      superClicks.value--
    }
    return getCoins
  }

  function Autoclicker() {
    var currentTime = Date.now(); // or performance.now()
    var timeDiff = currentTime - lastClickTime;

    if (timeDiff < clickThreshold) {
      alert("KKT")
    }

    lastClickTime = currentTime;
  }

  function convertSecondsToTime(seconds) {
    var date = new Date(0);
    date.setSeconds(seconds);

    var hours = date.getUTCHours().toString().padStart(2, '0');
    var minutes = date.getUTCMinutes().toString().padStart(2, '0');
    var seconds = date.getSeconds().toString().padStart(2, '0');

    return hours + ':' + minutes + ':' + seconds;
  }

  function earnMoneyPassive() {
    coins.value += coinsPerSecond.value * 0.05
  }

  function OfflineEarnings() {
    if (lastActiveTime.value == 0) return
    const date = Math.floor(new Date().getTime() / 1000) //Dnešní datum v sec
    offlineTimeSeconds.value = date - lastActiveTime.value  //Afk time v sec
    offlineTime.value = convertSecondsToTime(offlineTimeSeconds.value) //Offline čas
    offlineMoneyEarned.value = Math.round(coinsPerSecond.value * offlineTimeSeconds.value / 100) //Peněz vyděláno
    coins.value += offlineMoneyEarned.value //Vyděláváte 100x méně když jste offline
  }

  function SaveTime() {
    lastActiveTime.value = Math.floor(new Date().getTime() / 1000)
  }

  function Skill1() {
    superClicks.value = 10
  }
  function Reset() {
    localStorage.clear();
    coins.value = 0
    coinsPerSecond.value = 0
  }

  return { coins, coinsPerSecond, addCoins, earnMoneyPassive, OfflineEarnings, SaveTime, offlineTime, offlineMoneyEarned, Skill1, Reset, /*displayCoins*/ }
})