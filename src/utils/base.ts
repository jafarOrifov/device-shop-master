interface Cfghttp {
    BASE_URL: string
    BASE_TIMEOUT: number
  }
  
  export const cfghttp: Cfghttp = {
    BASE_URL: 'https://project-data-eqns.onrender.com/',
    BASE_TIMEOUT: 60 * 1000,
  }

  export const urls = {
    DEVICES: 'devices',
    CATEGORIES: 'categories',
    RESOURCES: 'resources'
  }