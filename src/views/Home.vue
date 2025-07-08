<template>
  <div>
    <nav>
      <br />
      &nbsp;&nbsp;<RouterLink to="/">Home</RouterLink><br />
      &nbsp;&nbsp;<RouterLink to="/klikacka">Klikacka</RouterLink> <br />
      &nbsp;&nbsp;<RouterLink to="/albionmarketprice">Albion</RouterLink> <br />
      &nbsp;&nbsp;<RouterLink to="/albionmarketprice2">Albion2</RouterLink>
      <br />
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>
<style>
nav{
  display: flex;
  flex-direction: column;
  align-items: center;
}
a {
  color: #eee;
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  text-decoration: none;
}
</style>