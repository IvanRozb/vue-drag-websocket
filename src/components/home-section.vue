<template>
  <div class="container">
    <router-link to="/interactive" class="section section-left">
      <h3 class="section__text">Interactive workspace</h3>
    </router-link>
    <router-link to="/websocket" class="section section-right">
      <h3 class="section__text">Interaction with the server using the WebSocket protocol.</h3>
    </router-link>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  height: 100vh;
}

.section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;
}

.section-left {
  background-color: #dcdcdc;

  &:hover {
    background-color: #d0cece;
  }
}

.section-right {
  background-color: #1a1a1a;

  color: white;

  &:hover {
    background-color: #1c1c1c;
  }
}
</style>
<script setup lang="ts"></script>
