<template>
    <q-select
      dense
      square
      emit-value
      clearable
      map-options
      v-model="changValue"
      :option-value="optionValue"
      :option-label="optionLabel"
      :options="options"
      :label="label"
    >
      <template v-slot:selected-item="props">
        <div class="text-primary text-bold">{{ props.opt[optionLabel]}}</div>
      </template>
  
      <slot></slot>
    </q-select>
  </template>
  
  <script setup lang="ts">
  
  import {computed, onMounted, ref, toRefs} from "vue";
  
  const props = defineProps({
    modelValue: String,
    label: String,
    options: Array,
    optionValue: {type: String, default: 'name'},
    optionLabel: {type: String, default: 'name'},
  })
  
  const emit = defineEmits<{'update:modelValue': [value: string | undefined]}>();
  
  let changValue = computed<string | undefined>({
    get(){
      return props.modelValue;
    },
    set(newVal:string | undefined){
      emit('update:modelValue', newVal);
    }
  });
  </script>
  