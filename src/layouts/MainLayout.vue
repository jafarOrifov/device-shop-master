<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Shop Master 
        </q-toolbar-title>

        <div>Created by Jafar</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      elevated
      bordered
      class="bg-primary"
    >
      <q-list>
        <q-item
              clickable
              v-ripple
              active-class="text-white text-subtitle1 text-bold text-italic"
              :active="true"
            >
              <q-item-section avatar class="q-pl-md q-pr-none">
                <q-icon name="mdi-monitor-cellphone-star" size="sm"/>
              </q-item-section>
              <q-item-section class="q-pl-none text-white">Товары</q-item-section>
            </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
