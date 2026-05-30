import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import login from '@/stores/login'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('@/views/AboutView.vue'),
    },
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('@/views/ContactView.vue'),
    },
    {
      path: '/faq',
      name: 'FAQ',
      component: () => import('@/views/FAQView.vue'),
    },
    {
      path: '/banner/:name',
      name: 'Banner',
      component: () => import('@/views/BannerView.vue'),
    },
    {
      path: '/all-banners',
      name: 'AllBanners',
      component: () => import('@/views/AllBannersView.vue'),
    },
    {
      path: '/search',
      name: 'Search',
      component: () => import('@/views/SearchView.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/sign-up',
      name: 'SignUp',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('@/views/CartView.vue'),
    },
    {
      path: '/cart/checkout',
      name: 'Checkout',
      component: () => import('@/views/CheckoutView.vue'),
    },
    {
      path: '/chat',
      name: 'Chat',
      component: () => import('@/views/ChatView.vue'),
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/ProfileView.vue'),
    },
    {
      path: '/orders',
      name: 'Orders',
      component: () => import('@/views/OrdersView.vue'),
    },
    {
      path: '/wishlist',
      name: 'Wishlist',
      component: () => import('@/views/WishlistView.vue'),
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/SettingsView.vue'),
    },
    {
      path: '/:seller/:slug',
      name: 'Product',
      component: () => import('@/views/ProductDetailView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.name === 'Home') document.title = `Quality Products, Unbeatable Prices | Kapak`
  else if (to.name === 'SignUp') document.title = `Sign Up | Kapak`
  else if (to.name === 'NotFound') document.title = `Not Found | Kapak`
  else document.title = `${String(to.name)} | Kapak`
  if (to.name !== 'Login' && login().afterLogin) login().setAfterLogin('')
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
