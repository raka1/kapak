import { defineStore } from 'pinia'

type CartItem = Array<{
  seller: {
    _id: string
    first_name: string
    last_name: string
    username: string
    checked: boolean
  }
  items: Array<{
    product: {
      _id: string
      name: string
      slug: string
      image: string
    }
    variant: {
      name: string
      price: number
      stock: number
    }
    variant_index: number
    quantity: number
    checked: boolean
  }>
  total_quantity: number
}>

interface Body {
  cart: []
  total_all_quantity: number
  select_all: boolean
}

type BodyOrUndefined = Body | null

export default defineStore('cart', {
  state: () => ({
    cart: [] as CartItem,
    total_all_quantity: 0,
    select_all: false,
  }),
  actions: {
    reset(body: BodyOrUndefined = null) {
      this.cart = body?.cart || []
      this.total_all_quantity = body?.total_all_quantity || 0
      this.select_all = body?.select_all || false
    },
  },
})
