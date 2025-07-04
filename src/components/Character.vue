<script setup>
import { useCharacterStore } from "../stores/storeCharacter";
const useCharacter = useCharacterStore();
</script>

<template>
  <div class="shopMain">
    <div
      class="character"
      v-for="character in useCharacter.character"
      :key="character"
    >
      <div class="img">
        <img v-bind:src="character.imgPath" />
      </div>
      <div class="stats">
        <div class="name">{{ character.name }}</div>
        <div class="level">Lvl {{ character.level }}</div>
        <div class="dmg">Earnings/s {{ character.earn }}</div>
      </div>
      <button class="upgrade" @click="useCharacter.CharacterUpgrade(character)">
        <div class="upgradeCost">
          {{ character.upgradeCost }}&nbsp;<i class="fa-solid fa-coins"></i>
        </div>
        <div class="dmgAdd">+{{ character.earnAdd }} Earnings</div>
      </button>
    </div>
  </div>
</template>