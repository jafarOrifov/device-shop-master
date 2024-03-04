<template>
    <q-dialog :value="value" persistent
              transition-show="jump-up"
              transition-hide="jump-down"
    >
      <q-card>
        <q-bar class="bg-primary text-white">
          <div v-if="dialogTitle" class="cursor-pointer text-white">{{ dialogTitle }}</div>
          <div v-else class="cursor-pointer text-white">{{!modelId?'Новый':'Редактировать'}}</div>
          <q-space/>
          <q-btn v-close-popup dense flat icon="close" @click="closeDialog()" class="q-px-none">
            <q-tooltip class="bg-secondary text-white">Закрыть</q-tooltip>
          </q-btn>
        </q-bar>
        <q-form ref="editForm" @submit="onSubmit as Function" @validation-error="onValidationError as Function">
          <q-card-section class="q-pa-sm">
  
            <slot></slot>
  
          </q-card-section>
          <q-separator color="secondary" style="margin-top: 15px"/>
          <q-card-actions align="right" class="q-pa-sm">
            <div v-if="!dialogTitle" class="q-pa-md q-gutter-md">
              <q-chip dense square size="10" :color="modelId?'primary':'accent'" text-color="white" icon="mdi-key"
              >
                {{'Ид'+': '+(!modelId ? 'Новый' : modelId)}}
              </q-chip>
            </div>
            <q-space/>
            <q-btn v-close-popup flat label="Отменить" class="text-secondary" @click="closeDialog"/>
            <q-btn :loading="loading" flat label="Сохранять" class="text-secondary text-bold" type="submit"/>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </template>
  
  <script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {useStore} from "../../stores/store"

 const store = useStore();


    const {t} = useI18n();
    defineProps({
      value: {type: Boolean},
      loading: {
        type: Boolean,
        default: false
      },
      modelId: {type: String},
      onSubmit: {type: Function},
      onValidationError: {type: Function},
      dialogTitle:{type: String}
    });

    const closeDialog = ()=> {
        store.setBaseDialog(false);
    }
  </script>
  