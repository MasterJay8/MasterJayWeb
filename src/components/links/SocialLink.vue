<script setup>
defineProps({
  name: { type: String, required: true },
  link: { type: String, required: true },
  img: { type: String, required: true },
  color: { type: String, default: "#3B3FD9" },
});
</script>

<template>
  <a
    class="social"
    :href="link"
    target="_blank"
    rel="noopener noreferrer"
    :style="{ '--accent': color }"
  >
    <img class="social__img" :src="img" alt="" width="56" height="56" />
    <span class="social__text">
      <span class="social__name">{{ name }}</span>
      <!-- <span class="social__url">{{
        link.replace(/^https?:\/\/(www\.)?/, "")
      }}</span> -->
    </span>
    <svg
      class="social__icon"
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
    >
      <path
        d="M7 17 17 7M9 7h8v8"
        fill="none"
        stroke="currentColor"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </a>
</template>

<style lang="scss" scoped>
@use "../../styles/LinksStyle/variables" as *;

/* Updated card appearance */
.social {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.2rem 1rem 1.4rem;
  background: $card; // use card background for a clean tile
  border-radius: $radius-lg;
  text-decoration: none;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  // subtle default shadow
  box-shadow: 0 2px 6px rgba($ink, 0.05);

  // coloured edge that widens on hover
  &::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 6px;
    background: var(--accent);
    transition: width 0.2s ease;
  }

  &:hover {
    transform: translateY(-3px);
    // deepen shadow on hover
    box-shadow: 0 4px 12px rgba($ink, 0.12);
    background: $lilac;
    &::before {
      width: 12px;
    }
    .social__icon {
      transform: translate(2px, -2px);
      color: var(--accent);
    }
  }

  &__img {
    flex: none;
    width: 56px;
    height: 56px;
    border-radius: 16px;
    object-fit: cover;
  }

  &__text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
  }

  &__name {
    color: $ink; // use ink color for better contrast on card background
    font-family: $font-display;
    font-weight: 700;
    font-size: 1.3rem;
    line-height: 1.2;
  }

  &__url {
    color: $ink-soft;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__icon {
    flex: none;
    color: $ink-soft;
    transition: transform 0.2s ease, color 0.2s ease;
  }
}
</style>
