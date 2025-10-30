import { defineStore } from 'pinia'

export default defineStore('theme', {
  state: () => ({
    currentTheme: 'light',
  }),
  actions: {
    setTheme(value: string) {
      this.currentTheme = value
    },
  },
})
