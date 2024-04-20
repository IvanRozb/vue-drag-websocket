<script setup lang="ts">
const routes = [
  {
    to: '/',
    title: 'Home'
  },
  {
    to: '/interactive',
    title: 'Workspace'
  },
  {
    to: '/websocket',
    title: 'Websocket'
  }
]
</script>

<template>
  <nav class="navigation">
    <ul class="list">
      <li v-for="(route, index) in routes" :key="index" class="route">
        <router-link class="route__link" :to="route.to">{{ route.title }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.navigation {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;

  background-color: white;

  .list {
    display: flex;
    height: fit-content;

    border-top-right-radius: 8px;

    .route {
      border: 1px solid black;
      cursor: pointer;

      &:last-child {
        border-bottom-right-radius: 8px;
      }

      &:hover {
        background-color: #cecdcd;
      }

      &__link {
        display: inline-block;
        padding: 12px 16px;
      }
    }
  }
}
</style>
