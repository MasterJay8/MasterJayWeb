<script setup>
import { ref, computed, onMounted, watch } from "vue";
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
const excludedCategories = ["Mount", "Potion"];
const excludedWords = [
  "Journeman's",
  "Adept's",
  "Expert's",
  "Master's",
  "Grandmaster's",
  "Elder's",
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
const selectedSort = useLocalStorageRef("selectedSort");

const LOCAL_CACHE_KEY = "cachedCityItems";

/* "item_id": "T1_BAG",
"city": "Black Market",
"quality": 1,
"sell_price_min": 0,
"sell_price_min_date": "0001-01-01T00:00:00",
"sell_price_max": 0,
"sell_price_max_date": "0001-01-01T00:00:00",
"buy_price_min": 0,
"buy_price_min_date": "0001-01-01T00:00:00",
"buy_price_max": 0,
"buy_price_max_date": "0001-01-01T00:00:00" */

function saveItemsToCache(items) {
  const existingRaw = localStorage.getItem(LOCAL_CACHE_KEY);
  let existing = {};

  if (existingRaw) {
    try {
      existing = JSON.parse(existingRaw);
    } catch (e) {
      console.warn("Invalid JSON in cache, starting fresh.");
    }
  }

  for (const city in items) {
    const newItems = items[city].filter(
      (item) =>
        (item[2] !== 0 && item[2] !== "X") || (item[4] !== 0 && item[4] !== "X")
    );

    if (!existing[city]) {
      existing[city] = newItems;
      continue;
    }

    for (const newItem of newItems) {
      const index = existing[city].findIndex(
        (i) => i[0] === newItem[0] && i[1] === newItem[1]
      );

      if (index !== -1) {
        existing[city][index] = newItem;
      } else {
        existing[city].push(newItem);
      }
    }
  }

  localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(existing));
}

function loadItemsFromCache() {
  try {
    const cached = localStorage.getItem(LOCAL_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.warn("Error parsing cached data:", err);
  }
  return null;
}

function fillMissingPricesFromCache() {
  const cachedRaw = localStorage.getItem(LOCAL_CACHE_KEY);
  if (!cachedRaw) return;

  let fallbackAll;
  try {
    fallbackAll = JSON.parse(cachedRaw);
  } catch (err) {
    console.warn("Invalid cached JSON", err);
    return;
  }

  for (const city in cityItems.value) {
    const cityData = cityItems.value[city];
    const fallbackData = fallbackAll[city] || [];

    for (let i = 0; i < cityData.length; i++) {
      const item = cityData[i];
      const fallbackItem = fallbackData.find(
        (f) => f[0] === item[0] && f[1] === item[1]
      );
      if (!fallbackItem) continue;

      if (item[2] === 0) {
        item[2] = fallbackItem[2];
        item[3] = fallbackItem[3];
      }
      if (item[4] === 0) {
        item[4] = fallbackItem[4];
        item[5] = fallbackItem[5];
      }
    }
  }
}

const nameMap = (() => {
  return Object.fromEntries(
    itemsRaw
      .trim()
      .split("\n")
      .map((line) => {
        const match = line.split(":");
        if (match.length != 3) return null;
        const code = match[1].trim();
        let name;
        console.log(match[2].trim().split(" ")[0]);
        /*if (!excludedCategories.includes(selectedCategory.value)) {
          //console.log(match[2].trim().split(" ").slice(1).join(" "));
          name = match[2].trim().split(" ").slice(1).join(" ");
        } */
        if (excludedWords.includes(match[2].trim().split(" ")[0])) {
          name = match[2].trim().split(" ").slice(1).join(" ");
        } else name = match[2].trim();
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
  sortItemsProfit();
}

function UpdateIbSoProfit(SoCity) {
  localStorage.setItem("selectedIbSoCity", SoCity);
  for (const city of cityList) {
    (cityItems.value[city] || []).forEach((entry) => {
      entry[7] = calculateProfit(entry, SoCity, "Ib");
    });
  }
  sortItemsProfit();
}

function sortItemsProfit() {
  if (selectedSort.value == 0) {
    cityItems.value[selectedCity.value].sort((a, b) => {
      const nameA = a[0].toLowerCase();
      const nameB = b[0].toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;

      const qualityA = parseFloat(a[1]);
      const qualityB = parseFloat(b[1]);

      return qualityA - qualityB;
    });
  } else if (selectedSort.value == 6) {
    cityItems.value[selectedCity.value].sort((a, b) =>
      isNaN(b[selectedSort.value])
        ? isNaN(a[selectedSort.value])
          ? 0
          : -1
        : isNaN(a[selectedSort.value])
        ? 1
        : b[selectedSort.value] - a[selectedSort.value]
    );
  } else {
    cityItems.value[selectedCity.value].sort((a, b) =>
      isNaN(b[selectedSort.value])
        ? isNaN(a[selectedSort.value])
          ? 0
          : -1
        : isNaN(a[selectedSort.value])
        ? 1
        : b[selectedSort.value] - a[selectedSort.value]
    );
  }
}

const T4T8ITEMS = computed(() => {
  return itemsJson[selectedCategory.value] ?? itemsJson["Bag"];
});

const loadPrices = async () => {
  try {
    cityItems.value = {};

    /*const T4T8ITEMS = ref(
      itemsJson[selectedCategory.value] ?? itemsJson["Bag"]
    );*/

    /*let allItemIds = [];
    if (!excludedCategories.includes(selectedCategory.value)) {
      allItemIds = T4T8ITEMS.value.flatMap((item) =>
        TIERS.flatMap((tier) => [
          `T${tier}_${item}`,
          ...QUALITY_LEVELS.map((q) => `T${tier}_${item}@${q}`),
        ])
      );
    } else {
      allItemIds = Object.values(T4T8ITEMS.value);
    }*/

    let allItemIds = [];
    if (!excludedCategories.includes(selectedCategory.value)) {
      allItemIds = T4T8ITEMS.value.flatMap((item) =>
        TIERS.flatMap((tier) => [
          `T${tier}_${item}`,
          ...QUALITY_LEVELS.map((q) => `T${tier}_${item}@${q}`),
        ])
      );
    } else {
      allItemIds = Object.values(T4T8ITEMS.value);
    }

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
        nameMap[id],
        quality,
        obj.sell_price_min,
        obj.sell_price_min_date,
        obj.buy_price_max,
        obj.buy_price_max_date,
      ]);
    }

    fillMissingPricesFromCache();

    saveItemsToCache(cityItems.value);

    localStorage.setItem("selectedCategory", selectedCategory.value);
  } catch (error) {
    console.error("Error fetching data, attempting to load cache:", error);
    const cached = loadItemsFromCache();
    if (cached) {
      cityItems.value = cached;
    }
  }

  UpdateBoSoProfit(selectedBoSoCity.value);
  UpdateIbSoProfit(selectedIbSoCity.value);

  sortItemsProfit();
};

onMounted(async () => {
  await loadPrices();
});

watch(selectedCategory, async () => {
  await loadPrices();
});

watch(selectedBoSoCity, UpdateBoSoProfit);
watch(selectedIbSoCity, UpdateIbSoProfit);
watch(selectedSort, sortItemsProfit);
watch(selectedCity, async () => {
  localStorage.setItem("selectedCity", selectedCity.value);
  sortItemsProfit();
});

function updateSortValue() {
  let newSort;
  let currentSort = parseInt(selectedSort.value);
  if (currentSort === 0) newSort = 6;
  else if (currentSort === 6) newSort = 7;
  else newSort = 0;
  selectedSort.value = newSort;
}

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
    val = GetElapsedTime(val);
    if (typeof val === "string" && val.includes("m"))
      return "rgba(50, 205, 128, 0.8)";
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
            <td><button @click="updateSortValue">X</button></td>
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
              {{
                [2, 4, 6, 7].includes(y)
                  ? NWS(cell)
                  : [3, 5].includes(y)
                  ? GetElapsedTime(cell)
                  : cell
              }}
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
