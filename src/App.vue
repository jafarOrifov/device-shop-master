<template>
  <router-view />
</template>

<script setup lang="ts">
import { useStore } from './stores/store';

const store = useStore();

store.setCategories();

</script>
