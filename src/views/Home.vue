<template>
  <div>
    <nav>
      <br />
      &nbsp;&nbsp;<RouterLink to="/">Home</RouterLink><br />
      &nbsp;&nbsp;<RouterLink to="/klikacka">Klikacka</RouterLink> <br />
      &nbsp;&nbsp;<RouterLink to="/albionmarketprice">Albion</RouterLink> <br />
      &nbsp;&nbsp;<RouterLink to="/albionmarketprice2">Albion2</RouterLink> <br />
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>