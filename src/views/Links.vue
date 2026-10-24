<script setup>
import SocialLink from "../components/links/SocialLink.vue";
import { socials } from "../data/socials";
import gyroImg from "../assets/links/gyro.png";
import logoImg from "../assets/icon7.png";
</script>

<template>
  <div class="page">
    <header class="header">
      <div class="header__inner">
        <RouterLink to="/" class="header__logo" aria-label="Home">
          <img :src="logoImg" alt="Logo" width="52" height="52" />
        </RouterLink>

        <div class="header__banner">
          <!-- <img src="/links/banner.svg" alt="" /> -->
          <img :src="gyroImg" alt="" />
        </div>
      </div>
      <h3>@jiripadour_</h3>
    </header>
    <!-- <h1 class="title">Find me online</h1> -->
    <!-- <p class="subtitle"></p> -->

    <ul class="list">
      <li v-for="s in socials" :key="s.name">
        <SocialLink v-bind="s" />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@use "../styles/LinksStyle/variables" as *;

.page{
  background: $ink;
  height:100vh;
}
// Header – unchanged
.header {
  //background: $ink;
  padding: 0.9rem 1.5rem;

  &__inner {
    max-width: $content-width + 240px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 1.5rem;

    @include md-down {
      grid-template-columns: auto 1fr;
      grid-template-areas:
        "logo nav"
        "banner banner";
      gap: 0.9rem 1rem;
    }
  }

  &__logo {
    display: block;
    border-radius: 15px;
    transition: transform 0.2s ease;
    &:hover {
      transform: rotate(-6deg);
    }
    @include md-down {
      grid-area: logo;
    }
  }

  &__banner {
    justify-self: center;
    width: 100%;
    max-width: 30rem;
    height: 220px;
    border-radius: $radius-sm;
    overflow: hidden;
    @include md-down {
      grid-area: banner;
      //max-width: none;
      height: 250px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
    }
  }

  &__nav {
    display: flex;
    gap: 0.4rem;
    @include md-down {
      grid-area: nav;
      justify-self: end;
    }

    a {
      color: $lilac;
      text-decoration: none;
      font-weight: 500;
      padding: 0.45rem 0.9rem;
      border-radius: 999px;
      transition: background 0.15s ease, color 0.15s ease;

      &:hover {
        background: rgba($lilac, 0.15);
      }
      &.router-link-exact-active {
        background: $sun;
        color: $ink;
      }
    }
  }
}

h1,
h2,
h3 {
  //font-family: $font-display;
  font-family: 'Roboto', sans-serif;
  color:white;
  font-size: clamp(1.8rem, 7vw, 2.4rem);
  //font-size: 3rem;
  text-align:center;
  line-height: 1.1;
  margin: 0;
  font-weight: bold;
}

// Body typography – unchanged
.title {
  font-size: clamp(2.2rem, 6vw, 3.6rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: $paper;
}

.subtitle {
  margin: 0.8rem 0 2.2rem;
  color: $paper;
  font-size: 1.1rem;
}

// List of social links – responsive card grid
.list {
  list-style: none;
  margin: 0;
  /* Use responsive columns; each card at least 260px wide */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  padding: 2rem 1rem; // reduced side padding for better width usage

  @include md-down {
    padding: 0.7rem 0.9rem;
    gap: 1rem;
  }
}
</style>
