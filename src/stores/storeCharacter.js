import { ref, computed, onUpdated } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
//import {}

import { useCounterStore } from './store';

export const useCharacterStore = defineStore('character', () => {
    const CounterStore = useCounterStore();


    let character = ref(useLocalStorage("Character", [
        {
            id: 1,
            imgPath: "/img/peaseant3.png",
            name: "Peaseant",
            level: 0,
            earn: 0,
            baseUpgradeCost: 71,
            upgradeCost: 100,
            earnAdd: 1
        },
        {
            id: 2,
            imgPath: "/img/asiaGang.png",
            name: "Ballers",
            level: 0,
            earn: 0,
            baseUpgradeCost: 548,
            upgradeCost: 800,
            earnAdd: 15
        },
        {
            id: 3,
            imgPath: "/img/asian3.png",
            name: "Min",
            level: 0,
            earn: 0,
            baseUpgradeCost: 1635,
            upgradeCost: 2000,
            earnAdd: 100
        },
        {
            id: 4,
            imgPath: "/img/cartman.png",
            name: "Cartman",
            level: 0,
            earn: 0,
            baseUpgradeCost: 7326,
            upgradeCost: 8500,
            earnAdd: 375
        },
        {
            id: 5,
            imgPath: "/img/cityguy2.png",
            name: "Cityguy",
            level: 0,
            earn: 0,
            baseUpgradeCost: 17848,
            upgradeCost: 20000,
            earnAdd: 900
        },
        {
            id: 6,
            imgPath: "/img/worker.png",
            name: "Worker",
            level: 0,
            earn: 0,
            baseUpgradeCost: 46298,
            upgradeCost: 50000,
            earnAdd: 2800
        },
        {
            id: 7,
            imgPath: "/img/kim.png",
            name: "Kim",
            level: 0,
            earn: 0,
            baseUpgradeCost: 118952,
            upgradeCost: 130000,
            earnAdd: 8000
        },
    ]))

    function CharacterUpgrade(input) {
        if (CounterStore.coins >= input.upgradeCost) {
            CounterStore.coins -= input.upgradeCost
            CounterStore.coinsPerSecond += input.earnAdd

            input.level++
            input.earn += input.earnAdd
            //input.upgradeCost += input.baseUpgradeCost
            input.upgradeCost += Math.round(input.baseUpgradeCost * 1.2)
        }
    }
    return { character, CharacterUpgrade, }
})