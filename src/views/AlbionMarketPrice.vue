<script setup>
import { ref, onMounted } from "vue";

let url;
let ITEMS = [];

let T4T8ITEMS = ["BAG", "BAG_INSIGHT", "2H_DAGGERPAIR", "2H_MACE"];
//let T4T8ITEMS = ["BAG"];

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

onMounted(async () => {
  for (const item of ITEMS) {
    try {
      //url = `https://europe.albion-online-data.com/api/v2/stats/prices/${item}?locations=3003,5003,2004,3005,4002,1002,3008,7&qualities=1`;
      url = `https://europe.albion-online-data.com/api/v2/stats/prices/${item}?locations=4002,3003&qualities=1`;
      const response = await fetch(url);
      const data = await response.json();
      let i = 0;
      for (const obj of data) {
        /*itemPrices.value[i] = [];
        const [t, r] = obj.item_id.split("_");
        itemPrices.value[i].push(r.split("@")[0]);
        itemPrices.value[i].push(`${t.slice(1)}.${r.split("@")[1]}`);
        itemPrices.value[i].push(obj.city);
        itemPrices.value[i].push(obj.sell_price_min);
        itemPrices.value[i].push(getElapsedTime(obj.sell_price_min_date));
        itemPrices.value[i].push(obj.buy_price_max);
        itemPrices.value[i].push(getElapsedTime(obj.buy_price_max_date));*/
        i++;

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
          itemName,
          quality,
          obj.sell_price_min,
          GetElapsedTime(obj.sell_price_min_date),
          obj.buy_price_max,
          GetElapsedTime(obj.buy_price_max_date),
        ]);
      }
    } catch (error) {
      console.error("Chyba při načítání dat:", error);
    }
  }
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
function MoneyBoToSo(city, item) {
  let profit;
  //console.log(cityItems.value["Black Market"]);
  //console.log(item[0]);

  for (const key in cityItems.value["Black Market"]) {
    const item2 = cityItems.value["Black Market"][key];
    //console.log(cityItems.value["Black Market"][key])

    if (item[0] === item2[0] && item[1] === item2[1]) {
      //console.log(item, item2);
      profit = Math.round(item2[2] * 0.935 - item[4] * 1.025);
      break;
    }
  }
  console.log(cityItems.value);
  return profit;
}
//Select city

//numberWithSpaces
function NWS(x) {
  if (x == null) return "";
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
</script>

<template>
  <div class="table-container">
    <table>
      <!--<tbody v-for="(items, city) in cityItems" :key="city">
        <tr v-for="(item, i) in items" :key="i">
          <td>{{ city }}</td>-->
      <tbody>
        <tr v-for="(item, i) in cityItems['Fort Sterling']" :key="i">
          <td>Fort Sterling</td>
          <td v-for="(cell, y) in item" :key="y">
            {{ y == 2 || y == 4 ? NWS(cell) : cell }}
          </td>
          <td>
            {{ MoneyBoToSo(city, item) }}
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
