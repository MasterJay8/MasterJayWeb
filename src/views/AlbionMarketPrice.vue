<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import itemsRaw from "../../src/assets/items.txt?raw";

let url;
let ITEMS = [];

//let T4T8ITEMS = ["BAG"];
let T4T8ITEMS = ["BAG",
  "BAG_INSIGHT",
  "2H_ENIGMATICSTAFF",
  "2H_MACE",
  "2H_GLAIVE",
  "2H_GLAIVE",
  "2H_GLAIVE",
  ];
let itemTierCounter = 0;
let tempMatch;
let tempArray = [];

for (let item of T4T8ITEMS) {
  let itemName = "";
  for (let i = 4; i <= 8; i++) {
    itemName += `T${i}_${item},`;
    for (let y = 1; y <= 4; y++) {
      itemName += `T${i}_${item}@${y},`;
    }
  }
  ITEMS.push(itemName);
}

let stringAllItems = "";
for (let items of ITEMS) {
  stringAllItems += items + ",";
}
console.log(stringAllItems);

//city: 3003,5003,2004,3005,4002,1002,3008,7

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

//const itemPrices = ref([]);
const cityItems = ref({});

const nameMap = {};

itemsRaw
  .trim()
  .split("\n")
  .forEach((line) => {
    const match = line.match(/^\s*\d+:\s*(.+?)\s+:\s*(.+)$/);
    if (match) {
      const code = match[1].trim();
      const name = match[2].trim();
      nameMap[code] = name.slice(String(name.split(" ")[0]).length);
    }
  });

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

const selectedCity = ref("Fort Sterling");
const selectedSoCity = ref("Black Market");
//const selectedCity = ref("Black Market");

onMounted(async () => {
  try {
    await sleep(200);
    //url = `https://europe.albion-online-data.com/api/v2/stats/prices/${item}?locations=3003,5003,2004,3005,4002,1002,3008,7&qualities=1`;
    url = `https://europe.albion-online-data.com/api/v2/stats/prices/${stringAllItems}?locations=3003,5003,2004,3005,4002,1002,3008,7&qualities=1`;
    const response = await fetch(url);
    const data = await response.json();
    //let i = 0;
    //for (const item of ITEMS) {
    for (const item in ITEMS) {
      for (const obj of data) {
        /*itemPrices.value[i] = [];
        const [t, r] = obj.item_id.split("_");
        itemPrices.value[i].push(r.split("@")[0]);
        itemPrices.value[i].push(`${t.slice(1)}.${r.split("@")[1]}`);
        itemPrices.value[i].push(obj.city);
        itemPrices.value[i].push(obj.sell_price_min);
        itemPrices.value[i].push(getElapsedTime(obj.sell_price_min_date));
        itemPrices.value[i].push(obj.buy_price_max);
        itemPrices.value[i].push(getElapsedTime(obj.buy_price_max_date));
        i++;*/

        if (!cityItems.value[obj.city]) {
          cityItems.value[obj.city] = []; // Initialize if not present
        }

        let itemName = "";
        let quality = "";
        if (obj.item_id.includes("@")) {
          const r = obj.item_id.slice(3);
          itemName = r.split("@")[0];
          quality = `${obj.item_id.slice(1, 2)}.${r.split("@")[1]}`;
        } else {
          const r = obj.item_id.slice(3);
          itemName = r;
          quality = `${obj.item_id.slice(1, 2)}.0`;
        }
        cityItems.value[obj.city].push([
          nameMap[obj.item_id], //itemName,
          quality,
          obj.sell_price_min,
          GetElapsedTime(obj.sell_price_min_date),
          obj.buy_price_max,
          GetElapsedTime(obj.buy_price_max_date),
        ]);
      }
    }
  } catch (error) {
    console.error("Chyba při načítání dat:", error);
  }
  UpdateProfit(selectedSoCity.value);
});

function GetElapsedTime(since) {
  const now = new Date();
  const start = new Date(since);

  let diffInSeconds = Math.floor((now - start) / 1000);

  let hours = String(Math.floor(diffInSeconds / 3600)).padStart(2, "0");
  diffInSeconds %= 3600;
  const minutes = String(Math.floor(diffInSeconds / 60)).padStart(2, "0");
  const seconds = String(diffInSeconds % 60).padStart(2, "0");
  if (parseInt(hours) > 100000) {
    hours = "X";
  }

  //return `${hours}:${minutes}:${seconds}`;
  return `${hours}h`;
}

//Money BuyOffer -> SellOffer
function MoneyBoToSo(item, SoCity) {
  let profit;

  for (const key in cityItems.value[SoCity]) {
    const item2 = cityItems.value[SoCity][key];

    if (item[0] === item2[0] && item[1] === item2[1]) {
      if (item2[2] == 0 || item[4] == 0) return "X";
      const itemPerM = 1000000 / item[4];
      profit = Math.round(itemPerM * (item2[2] * 0.935 - item[4] * 1.025));
      break;
    }
  }
  return profit;
}

function UpdateProfit(SoCity) {
  for (const city of cityList) {
    cityItems.value[city].forEach((entry) => {
      entry[6] = MoneyBoToSo(entry, SoCity); // Adds value at index 6 (fills undefined if length < 6)
    });
  }
}

watch(selectedSoCity, (newVal, oldVal) => {
  UpdateProfit(newVal);
});

//numberWithSpaces
function NWS(x) {
  if (x == null) return "";
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
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
          <td>Item Name</td>
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
