<script setup>
import SocialLink from "../components/links/SocialLink.vue";
import { socials } from "../data/socials";
</script>

<template>
  <div class="page">
    <header class="header">
      <div class="header__inner">
        <RouterLink to="/" class="header__logo" aria-label="Home">
          <img src="/links/logo.svg" alt="Logo" width="52" height="52" />
        </RouterLink>

        <div class="header__banner">
          <!-- <img src="/links/banner.svg" alt="" /> -->
          <img src="/links/gyro.png" alt="" />
        </div>
      </div>
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

//Header
.header {
  background: $ink;
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
    border-radius: 16px;
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
    height: 200px;
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

//Body
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

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  padding: 2rem 15rem;
  gap: 1.5rem;

  @include md-down {
    //grid-template-columns: 1fr;
    padding: 0.7rem 2rem;
    gap: 0.7rem;
  }
}
</style>
