import { defineStore } from 'pinia'

export default defineStore('user', {
  state: () => ({
    username: '',
    afterLogin: '',
    isLoginChecked: false,
  }),
  actions: {
    setUsername(value: string) {
      this.username = value
      this.isLoginChecked = true
    },
    setAfterLogin(value: string) {
      this.afterLogin = value
      this.isLoginChecked = true
    },
  },
})
