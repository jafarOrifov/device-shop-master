import { defineStore} from 'pinia';
import {api} from "boot/axios";
import {urls} from "src/utils/base";
import { Categories } from 'src/components/models';
import { useErrorNotify } from 'src/composables/notify';

export const useStore = defineStore('main', {
  state: () => ({
    baseDialog: false, 
    categories: [] as Categories[]
  }),
  getters: {
    getBaseDialog: (state) => state.baseDialog,
    getCategories: (state) => state.categories
  },
  actions: {
    setBaseDialog(val:boolean){
      this.baseDialog = val;
    },
    async setCategories(){
      api.get(urls.CATEGORIES)
      .then(response =>{
        this.categories = [...response.data];
      }).catch(error => {
        console.error(error);
        useErrorNotify(error);
      })
    }
  },
  persist: true,
});
