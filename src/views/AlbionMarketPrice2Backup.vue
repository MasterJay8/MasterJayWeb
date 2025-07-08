<script setup>
import { ref, onMounted, watch } from "vue";
import itemsRaw from "../../src/assets/items.txt?raw";
import itemsJson from "../../src/assets/items.json";

const QUALITY_LEVELS = [1, 2, 3, 4];
const TIERS = [4, 5, 6, 7, 8];

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
  "Sword",
  "Axe",
  "Mace",
  "Hammer",
  "Glove",
  "Crossbow",
  "Shield",
  "Bow",
  "Dagger",
  "Spear",
  "Quarterstaff",
  "Shapeshifter",
  "Nature Staff",
  "Torch",
  "Pyromancer",
  "Priest",
  "Arcanist",
  "Frost Mage",
  "Warlock",
  "Tome",
  "Plate Helmet",
  "Plate Armor",
  "Plate Boots",
  "Journeyman Hood",
  "Journeyman Jacket",
  "Journeyman Shoe",
  "Cloth Cowl",
  "Cloth Robe",
  "Cloth Sandals",
  "Mount",
  "Potion",
];

function useLocalStorageRef(key, defaultValue = "") {
  const stored = localStorage.getItem(key) ?? defaultValue;
  const r = ref(stored);
  watch(r, (val) => localStorage.setItem(key, val));
  return r;
}

const cityItems = ref({});
const selectedCity = useLocalStorageRef("selectedCity");
const selectedCategory = useLocalStorageRef("selectedCategory");
const selectedBoSoCity = useLocalStorageRef("selectedBoSoCity");
const selectedIbSoCity = useLocalStorageRef("selectedIbSoCity");

const nameMap = (() => {
  return Object.fromEntries(
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
})();

function GetElapsedTime(since) {
  const now = new Date();
  const start = new Date(since);
  const diff = Math.floor((now - start) / 1000);

  const hours = Math.floor(diff / 3600) - 2;
  const minutes = Math.floor(diff / 60) - 120;
  if (hours == 0) return `${minutes.toString().padStart(2, "0")}m`;
  return hours > 100000 ? "X" : `${hours.toString().padStart(2, "0")}h`;
}

function NWS(x) {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") ?? "";
}

function calculateProfit(item, SoCity, type = "Bo") {
  const compareList = cityItems.value[SoCity] || [];
  for (const item2 of compareList) {
    if (item[0] === item2[0] && item[1] === item2[1]) {
      const sell = item2[2];
      const buy = type === "Bo" ? item[4] : item[2];
      if (sell === 0 || buy === 0) return "X";
      const itemPerM = 1_000_000 / buy;
      return Math.round(itemPerM * (sell * 0.935 - buy * 1.025));
    }
  }
  return "X";
}

function UpdateBoSoProfit(SoCity) {
  localStorage.setItem("selectedBoSoCity", SoCity);
  for (const city of cityList) {
    (cityItems.value[city] || []).forEach((entry) => {
      entry[6] = calculateProfit(entry, SoCity, "Bo");
    });
  }
}

function UpdateIbSoProfit(SoCity) {
  localStorage.setItem("selectedIbSoCity", SoCity);
  for (const city of cityList) {
    (cityItems.value[city] || []).forEach((entry) => {
      entry[7] = calculateProfit(entry, SoCity, "Ib");
    });
  }
}

const loadPrices = async () => {
  try {
    cityItems.value = {};
    const T4T8ITEMS = ref(
      itemsJson[selectedCategory.value]
    );

    const allItemIds = T4T8ITEMS.value.flatMap((item) =>
      TIERS.flatMap((tier) => [
        `T${tier}_${item}`,
        ...QUALITY_LEVELS.map((q) => `T${tier}_${item}@${q}`),
      ])
    );

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
        nameMap[id] ?? base[0],
        quality,
        obj.sell_price_min,
        GetElapsedTime(obj.sell_price_min_date),
        obj.buy_price_max,
        GetElapsedTime(obj.buy_price_max_date),
      ]);
    }

    localStorage.setItem("selectedCategory", selectedCategory.value);

    UpdateBoSoProfit(selectedBoSoCity.value);
    UpdateIbSoProfit(selectedIbSoCity.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(async () => {
  await loadPrices();
});

watch(selectedCategory, async () => {
  await loadPrices();
});

watch(selectedBoSoCity, UpdateBoSoProfit);
watch(selectedIbSoCity, UpdateIbSoProfit);
watch(selectedCity, async () => {
  localStorage.setItem("selectedCity", selectedCity.value);
});

function getBackgroundColor(y, val) {
  if (["X", undefined, null].includes(val)) return "transparent";

  if (y === 6 || y === 7) {
    if (val < 0) return "transparent";
    const percent = Math.min(val / 1_000_000, 1);
    const r = Math.round(255 - percent * 205);
    const g = Math.round(255 - percent * 50);
    const b = Math.round(102 + percent * 26);
    return `rgba(${r},${g},${b},0.8)`;
  }

  if (y === 3 || y === 5) {
    if (typeof val === "string" && val.includes("m")) return "rgba(50, 205, 128, 0.8)";
    const time = parseFloat(val);
    if (isNaN(time)) return "transparent";
    const percent = Math.min(time / 24, 1);
    const r = Math.round(50 + percent * 205);
    const g = Math.round(205 + percent * 50);
    const b = Math.round(128 - percent * 26);
    return `rgba(${r},${g},${b},0.8)`;
  }

  return "transparent";
}
</script>

<template>
  <div class="wrap">
    <div class="table-container">
      <table>
        <tbody>
          <tr class="header-row">
            <td>
              <select class="dropdown" v-model="selectedCity">
                <option disabled value="">-- Please select --</option>
                <option v-for="item in cityList" :key="item" :value="item">
                  {{ item }}
                </option>
              </select>
            </td>
            <td>
              <select class="dropdown" v-model="selectedCategory">
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
              <select class="dropdown" v-model="selectedBoSoCity">
                <option disabled value="">-- Please select --</option>
                <option v-for="item in cityList" :key="item" :value="item">
                  {{ item }}
                </option>
              </select>
            </td>
            <td>
              <select class="dropdown" v-model="selectedIbSoCity">
                <option disabled value="">-- Please select --</option>
                <option v-for="item in cityList" :key="item" :value="item">
                  {{ item }}
                </option>
              </select>
            </td>
          </tr>
          <tr v-for="(item, i) in cityItems[selectedCity]" :key="i">
            <td>{{ selectedCity }}</td>
            <td
              v-for="(cell, y) in item"
              :key="y"
              :style="{ backgroundColor: getBackgroundColor(y, cell) }"
            >
              {{ y == 2 || y == 4 || y == 6 || y == 7 ? NWS(cell) : cell }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  background-color: #080404;
}
.table-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header-row {
  background-color: #0f0808;
  font-weight: bold;
  border: 2px solid #ccc;
}

table {
  border-collapse: collapse;
  width: 65%;
  border: 1px solid #000000;
  margin-block: 20px;
}

td {
  color: #eee;
  border: 1px solid #ccc;
  padding: 8px 12px;
  text-align: center;
}
.dropdown {
  width: 100%;
  padding: 8px;
  background-color: #0f0808;
  color: #eee;
  border: 1px solid #ccc;
  border-radius: 4px;
}
@media (min-width: 0px) and (max-width: 1500px) {
  table {
    border-collapse: collapse;
    width: 80%;
    border: 1px solid #000000;
    margin-block: 20px;
  }
}
</style>
