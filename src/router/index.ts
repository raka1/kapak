import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import HomeView from '@/views/HomeView.vue'
import SearchView from '@/views/SearchView.vue'
import LoginView from '@/views/LoginView.vue'
import SignUpView from '@/views/LoginView.vue'
import CartView from '@/views/CartView.vue'
import ChatView from '@/views/ChatView.vue'
import ProfileView from '@/views/ProfileView.vue'
import OrdersView from '@/views/OrdersView.vue'
import WishlistView from '@/views/WishlistView.vue'
import SettingsView from '@/views/SettingsView.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
import AboutView from '@/views/AboutView.vue'
import ContactView from '@/views/ContactView.vue'
import FAQView from '@/views/FAQView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import login from '@/stores/login'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'About',
      component: AboutView,
    },
    {
      path: '/contact',
      name: 'Contact',
      component: ContactView,
    },
    {
      path: '/faq',
      name: 'FAQ',
      component: FAQView,
    },
    {
      path: '/search',
      name: 'Search',
      component: SearchView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
    {
      path: '/sign_up',
      name: 'SignUp',
      component: SignUpView,
    },
    {
      path: '/cart',
      name: 'Cart',
      component: CartView,
    },
    {
      path: '/chat',
      name: 'Chat',
      component: ChatView,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfileView,
    },
    {
      path: '/orders',
      name: 'Orders',
      component: OrdersView,
    },
    {
      path: '/wishlist',
      name: 'Wishlist',
      component: WishlistView,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsView,
    },
    {
      path: '/:seller/:slug',
      name: 'Product',
      component: ProductDetailView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: NotFoundView,
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.name === 'Home') document.title = `Quality Products, Unbeatable Prices | Kapak`
  else if (to.name === 'SignUp') document.title = `Sign Up | Kapak`
  else document.title = `${String(to.name)} | Kapak`
  if (to.name !== 'Login' && login().afterLogin) login().setAfterLogin('')
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
