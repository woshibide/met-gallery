import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    message: '',
    type: 'info',
    visible: false,
  }),
  actions: {
    showNotification(message: string, type = 'info') {
      this.message = message
      this.type = type
      this.visible = true
      setTimeout(() => {
        this.visible = false
      }, 3000)
    },
    hideNotification() {
      this.visible = false
    },
  },
})
