import { store } from 'quasar/wrappers'
import { createPinia} from 'pinia'
import createPersistedState from "pinia-plugin-persistedstate";

export default store((/* { ssrContext } */) => {
  const pinia = createPinia()

  pinia.use(createPersistedState)

  return pinia
})
