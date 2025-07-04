<template>
  <div>
    <nav>
      <br />
      &nbsp;&nbsp;<RouterLink to="/">Home </RouterLink><br />
      &nbsp;&nbsp;<RouterLink to="/klikacka">Klikacka </RouterLink> <br />
      &nbsp;&nbsp;<RouterLink to="/albionmarketprice">Albion </RouterLink>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>