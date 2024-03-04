<template>
    <q-input
      v-model="dateValueComp"
      mask="##.##.####"
      dense stack-label >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date v-model="dateValueComp" mask="DD.MM.YYYY"/>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </template>
  
  <script setup lang="ts">
  import {computed, ref} from "vue";
  import {dateutil} from "src/composables/common";
  
  const props = defineProps({
    modelValue: String
  })
  
  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>();
  
  const qDateProxy = ref<any>(null);
  
  let dateValueComp = computed({
    get(){
      if(!props.modelValue) return '';
  
      return props.modelValue
    },
    set(newVal:string){
      qDateProxy.value.hide();
      emit('update:modelValue', newVal);
    }
  })
  </script>
  