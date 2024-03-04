<template>
  <q-page class="q-pa-md">
    <PageHeader/>

    <q-table
      flat bordered
      :rows="data"
      :loading="loading"
      :columns="columns"
      row-key="name"
      class="sticky-last-column-table my-sticky-header-table"
      v-model:pagination="pagination"
      hide-pagination
      style="height: calc(100vh - 200px);"
    >
    <template v-slot:top>
        <div :class="$q.screen.gt.xs?'row':'column'">
          <div>
            <q-input v-model="model"
                 label="Модель"
                 class="q-ma-sm"
                 style="width: 220px;"
                 @change="()=> filter.model_like = model"
                 dense>
            <template v-slot:append>
              <q-icon name="search"></q-icon>
            </template>
            </q-input>
          </div>

          <div>
            <SelectInput
            label="Сатегория"
            class="q-ma-sm"
            style="width: 220px"
            :options="store.getCategories"
            v-model="filter.category"
            :optionLabel="'name'"
          />
          </div>
        </div>
        <q-space></q-space>
        <div class="row q-col-gutter-xs">
          <AddBtn @click="add"/> 
        </div>
    </template>

    <template v-slot:body-cell-model="props">
      <td :props="props">
        <b class="text-subtitle1">{{ props.row.model }}</b>
      </td>
    </template>

    <template v-slot:body-cell-produced_year="props">
      <td :props="props">
        <b>{{ props.row.produced_year }}</b>
      </td>
    </template>

    <template v-slot:body-cell-rec_price="props">
      <td :props="props">
        <b>{{ formatPrice(props.row.rec_price) }}</b>
      </td>
    </template>

    <template v-slot:body-cell-is_active="props">
      <td :props="props">
        <q-icon 
          v-if="props.row.is_active" 
          color="positive" 
          name="mdi-check-decagram" 
          size="sm"></q-icon>

        <q-icon 
          v-else 
          color="negative" 
          name="mdi-close-octagon" 
          size="sm"></q-icon>
      </td>
    </template>

    <template v-slot:body-cell-category="props">
      <td :props="props">
        <q-badge 
          color="positive" 
          outline 
          class="text-subtitle2 text-bold">
          {{ props.row.category }}
        </q-badge>
      </td>
    </template>

    <template v-slot:body-cell-created_date="props">
      <td :props="props">
        <b class="text-primary">{{ props.row.created_date }}</b>
      </td>
    </template>

    <template v-slot:body-cell-actions="props">
      <td :props="props">
        <EditBtn @click="editRow(props.row)"/>
        <DeleteBtn @click="deleteRow(props.row.id)"/>
      </td>
    </template>

  </q-table>

    <div class="row justify-center q-mt-md">
      <q-pagination
        v-model="pagination.page"
        color="secondary"
        :max="pagesNumber"
        size="sm"
        :max-pages="5"
        direction-links
      />
    </div>

    <BaseDialog 
      v-model="store.getBaseDialog" 
      :model-id="bean.id" 
      :on-submit="onSubmit"
      :on-validation-error="onValidationError">

      <div style="min-width: 450px;" class="row">
        <q-input v-model="bean.model" placeholder="Model"
                 label="Модель"
                 class="q-pa-sm col-xs-12 col-md-6" dense
                 lazy-rules :rules="[(val:string) => !!val || 'Обязательное поле']">
        </q-input>

        <DateInput
          v-model="bean.produced_year"
          class="q-pa-sm col-xs-12 col-md-6"
          label="Дата релиза"
          lazy-rules :rules="[(val:string) => !!val || 'Обязательное поле']"
        />

        <SelectInput
            label="Category"
            class="q-pa-sm col-xs-12 col-md-6"
            :options="store.getCategories"
            v-model="bean.category"
            :optionLabel="'name'"
            lazy-rules :rules="[(val:string) => !!val || 'Обязательное поле']"
          />

        <q-input v-model="bean.rec_price" placeholder="Цена"
                 label="Цена"
                 type="number"
                 class="q-pa-sm col-xs-12 col-md-6" dense
                 lazy-rules :rules="[(val:string) => !!val || 'Обязательное поле']">
        </q-input>

        <q-checkbox
          v-model="bean.is_active"
          color="secondary"
          class="q-pa-sm col-xs-12 col-md-6"
          label="Видимость товара"
          :true-value="true"
          :false-value="false"
        />

        <q-file
          v-model="deviceImg"
          @update:model-value="($event)=> bean.img = $event.name"
          class="q-pa-sm col-xs-12 col-md-6"
          label="Выберите изображение"
          counter
          clearable
        >
          <template v-slot:append>
            <q-icon name="attachment"></q-icon>
          </template>
        </q-file>

        <q-input v-model="bean.description" placeholder="Описания"
                 label="Описания"
                 class="q-pa-sm col-xs-12" dense>
          <template v-slot:prepend>
            <q-icon name="mdi-text" color="secondary"/>
          </template>
        </q-input>
      </div>

    </BaseDialog>
  </q-page>
</template>

<script setup lang="ts">
import PageHeader from 'src/components/PageHeader.vue';
import AddBtn from "src/components/base/AddBtn.vue"
import EditBtn from "src/components/base/EditBtn.vue"
import DeleteBtn from "src/components/base/DeleteBtn.vue"
import BaseDialog from "src/components/base/BaseDialog.vue"
import { ref, reactive } from 'vue';
import {Pagination, Devices, Columns} from "../components/models"
import {api} from "boot/axios";
import {urls} from "../utils/base";
import { onMounted } from 'vue';
import { QTableProps, event } from 'quasar';
import { watch } from 'vue';
import { PagedGet, dateutil, formatPrice } from 'src/composables/common';
import { useStore } from 'src/stores/store';
import DateInput from 'src/components/base/DateInput.vue';
import SelectInput from 'src/components/base/SelectInput.vue';
import { useConfirmNotify, useErrorNotify, useSuccessNotify } from 'src/composables/notify';

const store = useStore();
const deviceImg = ref(null);

// *********** If I have backend API, so I would upload image like this **************

// function uploadImage(file) {
//   const URL = url; 
//   console.log(file)

//   let formData = new FormData();
//   data.append('name', file.name);
//   data.append('file', file) ; 

//   let config = {
//     headers : {
//       'Content-Type' : 'multipart/form-data'
//     }
//   }

//   api.post(URL, data, config).then(
//     response => {
//       console.log('image upload response > ', response)
//     })
// }

let data = ref<Devices[]>([]);
const loading = ref<boolean>(false);
const url = urls.DEVICES;
let model = ref<string>('');
let pagesNumber = ref<string | number>(1);

const defaultBean = ref<Devices>({   
  model:'',
  produced_year:'',
  category: '',
  rec_price: 0,
  description:'',
  created_date: '',
  is_active: false,
  img:''
})

const bean = ref<Devices>({...defaultBean.value});

const filter = reactive({
  model_like:'',
  category: ''
});

const pagination = ref<Pagination>({
  sortBy: 'id',
  page: 1,
  descending: false,
  rowsPerPage: 10,
  rowsNumber:1
});

const columns = ref<QTableProps["columns"]>([
  {
    name: 'model',
    required: true,
    label: 'Модель',
    align: 'left',
    field: 'model',
    sortable: true
  },
  {
    name: 'produced_year',
    required: true,
    label: 'Дата релиза',
    align: 'left',
    field: 'produced_year',
    sortable: true
  },
  {
    name: 'rec_price',
    required: true,
    label: 'Цена (сум)',
    align: 'left',
    field: 'rec_price',
    sortable: true
  },
  {
    name: 'is_active',
    required: true,
    label: 'Видимость',
    align: 'left',
    field: 'is_active',
    sortable: true
  },
  {
    name: 'category',
    required: true,
    label: 'Категория',
    align: 'left',
    field: 'category',
    sortable: true
  },
  {
    name: 'created_date',
    required: true,
    label: 'Дата создания',
    align: 'left',
    field: 'created_date',
    sortable: true
  },
  {
    name: 'description',
    required: true,
    label: 'Описания',
    align: 'left',
    field: 'description',
    sortable: true
  },
  {
    name: 'actions',
    required: true,
    label: 'Действия',
    align: 'left',
    field: 'actions',
    sortable: true
  },
]);

function getData(){
  loading.value = true;
  PagedGet(url, pagination.value, filter)
  .then((response:any) => {
    data.value = [...response.data];
    pagesNumber.value = Math.ceil(response.headers['x-total-count'] / pagination.value.rowsPerPage);
  }).catch((error:any)=>{
    console.error(error);
  }).finally(()=> {
    loading.value = false;
  })
}

function add() {
  bean.value = Object.assign({}, defaultBean.value);
  store.setBaseDialog(true);
}

function editRow(row:Devices){
  bean.value = Object.assign({}, row);
  store.setBaseDialog(true);
}

function deleteRow(id:string){
  useConfirmNotify('Вы действительно хотите удалить?', 'Shop master', ()=>{
    api.delete(url + '/' + id)
      .then(response => {
        getData();
      })
      .catch(error => {
        useErrorNotify(error);
      })
  })
}

function onSubmit(){
  loading.value = true;
  if(!!bean.value?.id){
    api.put(url + '/' + bean.value.id, bean.value)
      .then(response => {
        store.setBaseDialog(false);
        getData();
        useSuccessNotify("Успешно обновлено!");
      })
      .catch(error => {
        console.error(error);
        useErrorNotify(error);
      })
      .finally(()=>{
        loading.value = false;
      })
  } else if(bean.value != undefined){
    bean.value.created_date = dateutil.formatDate(new Date().getTime(), "DD.MM.YYYY");
    api.post(url, bean.value)
      .then(response => {
        store.setBaseDialog(false);
        getData();
        useSuccessNotify("Успешно создано!");
      })
      .catch(error => {
        useErrorNotify(error);
        console.error(error);
      })
      .finally(()=>{
        loading.value = false;
      })
  }
}

const onValidationError = () => {}

watch(
  [filter, ()=> pagination.value.page], 
  ([newFirst, newSecond], [oldFirst, oldSecond])=>{
  getData();
})

onMounted(()=>{
  getData();
})
</script>
