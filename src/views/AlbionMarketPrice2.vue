<script setup>
import { ref, onMounted, watch } from "vue";
import itemsRaw from "../../src/assets/items.txt?raw";
import itemsJson from "../../src/assets/items.json";

// Constants
const QUALITY_LEVELS = [1, 2, 3, 4];
const TIERS = [4, 5, 6, 7, 8];
/*const T4T8ITEMS = [
  "BAG",
  "BAG_INSIGHT",
  "2H_ENIGMATICSTAFF",
  "2H_MACE",
  "2H_GLAIVE",
  "c",
  "2H_WARBOW",
  "2H_LONGBOW",
  "2H_LONGBOW_UNDEAD",
  "2H_BOW_HELL",
  "2H_BOW_KEEPER",
];
console.log(itemsJson["Bag"]);*/
const T4T8ITEMS = ref(itemsJson["Bag"]);
const CITY_CODES = "3003,5003,2004,3005,4002,1002,3008,7";
const cityList = [
  "Black Market",
  "Brecilien",
  "Bridgewatch",
  "Caerleon",
  "Fort Sterling",
  "Lymhurst",
  "Martlock",
  "Thetford",
];
const categoryList = [
  "Bag",
  "Bow",
  "Dagger",
  "Spear",
  "Club",
  "Prowling Staff",
  "Nature Staff",
  "Torch",
  "Cloth Cowl",
  "Cloth Robe",
  "Cloth Sandals",
  "Journeyman Hood",
  "Journeyman Jacket",
  "Journeyman Shoe",
  "Plate Helmet",
  "Plate Armor",
  "Plate Boots",
];

// Reactive state
const cityItems = ref({});
const selectedCity = ref("Fort Sterling");
const selectedCategory = ref("Bag");
const selectedSoCity = ref("Black Market");

// Parse item names
const nameMap = Object.fromEntries(
  itemsRaw
    .trim()
    .split("\n")
    .map((line) => {
      const match = line.match(/^\s*\d+:\s*(.+?)\s+:\s*(.+)$/);
      if (!match) return null;
      const code = match[1].trim();
      const name = match[2].trim().split(" ").slice(1).join(" ");
      return [code, name];
    })
    .filter(Boolean)
);

// Generate all item IDs (with tiers and qualities)
const allItemIds = T4T8ITEMS.value.flatMap((item) =>
  TIERS.flatMap((tier) => [
    `T${tier}_${item}`,
    ...QUALITY_LEVELS.map((q) => `T${tier}_${item}@${q}`),
  ])
);

// Helper to format elapsed time
function GetElapsedTime(since) {
  const now = new Date();
  const start = new Date(since);
  const diff = Math.floor((now - start) / 1000);

  const hours = Math.floor(diff / 3600);
  return hours > 100000 ? "X" : `${hours.toString().padStart(2, "0")}h`;
}

// Format number
function NWS(x) {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") ?? "";
}

// Calculate potential profit
function MoneyBoToSo(item, SoCity) {
  const compareList = cityItems.value[SoCity] || [];

  for (const item2 of compareList) {
    if (item[0] === item2[0] && item[1] === item2[1]) {
      if (item2[2] === 0 || item[4] === 0) return "X";
      const itemPerM = 1_000_000 / item[4];
      return Math.round(itemPerM * (item2[2] * 0.935 - item[4] * 1.025));
    }
  }
  return "X";
}

function UpdateProfit(SoCity) {
  for (const city of cityList) {
    const items = cityItems.value[city] || [];
    for (const entry of items) {
      entry[6] = MoneyBoToSo(entry, SoCity);
    }
  }
}

const loadPrices = async (category) => {
  try {
    const stringAllItems = allItemIds.join(",");

    await new Promise((resolve) => setTimeout(resolve, 200));
    const url = `https://europe.albion-online-data.com/api/v2/stats/prices/${stringAllItems}?locations=${CITY_CODES}&qualities=1`;
    const data = await (await fetch(url)).json();

    for (const obj of data) {
      const city = obj.city;
      if (!cityItems.value[city]) cityItems.value[city] = [];

      const id = obj.item_id;
      const base = id.includes("@")
        ? id.slice(3).split("@")
        : [id.slice(3), "0"];
      const quality = `${id.slice(1, 2)}.${base[1]}`;

      cityItems.value[city].push([
        nameMap[id] ?? base[0], // Name fallback
        quality,
        obj.sell_price_min,
        GetElapsedTime(obj.sell_price_min_date),
        obj.buy_price_max,
        GetElapsedTime(obj.buy_price_max_date),
      ]);
    }

    UpdateProfit(selectedSoCity.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(async () => {
  await loadPrices(selectedCategory.value);
});

watch(selectedCategory, async (newCategory) => {
  await loadPrices(newCategory);
});

// Watch for profit update on source city change
watch(selectedSoCity, UpdateProfit);
</script>

<template>
  <div class="table-container">
    <table>
      <tbody>
        <tr class="header-row">
          <td>
            <select id="dropdown" v-model="selectedCity">
              <option disabled value="">-- Please select --</option>
              <option v-for="item in cityList" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </td>
          <td>
            <select id="dropdown" v-model="selectedCategory">
              <option disabled value="">-- Please select --</option>
              <option v-for="item in categoryList" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </td>
          <td>Ench</td>
          <td>Sell Order</td>
          <td></td>
          <td>Buy Order</td>
          <td></td>
          <td>
            <select id="dropdown" v-model="selectedSoCity">
              <option disabled value="">-- Please select --</option>
              <option v-for="item in cityList" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </td>
        </tr>
        <!--<tbody v-for="(items, city) in cityItems" :key="city">
        <tr v-for="(item, i) in items" :key="i">
          <td>{{ city }}</td>-->

        <tr v-for="(item, i) in cityItems[selectedCity]" :key="i">
          <td>{{ selectedCity }}</td>
          <td v-for="(cell, y) in item" :key="y">
            {{ y == 2 || y == 4 || y == 6 ? NWS(cell) : cell }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  display: flex;
  flex-direction: column;
  margin-block: 20px;
  justify-content: center;
  align-items: center;
}

.header-row {
  background-color: #f2f2f2;
  font-weight: bold;
  border: 2px solid #000000;
}

table {
  border-collapse: collapse;
  width: 65%;
  border: 1px solid #000000;
}

td {
  border: 1px solid #ccc;
  padding: 8px 12px;
  text-align: center;
}
</style>
