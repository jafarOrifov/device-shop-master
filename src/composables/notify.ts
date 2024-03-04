import {Notify} from 'quasar'

interface Error {
  errorCode: string,
  errorDescription: string | null
  errorMessage: string,
  errorStatus: number
}

export const  useErrorNotify = (error: Error) => {
  Notify.create({
    message: error.errorMessage || 'Url not found',
    caption: error.errorCode || '404',
    textColor: 'white',
    color: 'negative',
    icon: 'mdi-emoticon-cry-outline',
    position: 'top'
  })
}

export const useSuccessNotify = (message: string) => {
  Notify.create({
    message: message,
    textColor: 'white',
    type: 'positive',
    position: 'top'
  })
}

export const useConfirmNotify = (message:string, caption:string, callback: ()=> void) => {
  Notify.create({
    message: message,
    caption: caption,
    timeout: 0,
    icon: 'mdi-comment-question-outline',
    color: 'primary',
    position: 'center',
    actions: [
      {label: 'Нет', color: 'white'},
      {label: 'Да', color: 'yellow', handler: callback},

    ]
  })
}
