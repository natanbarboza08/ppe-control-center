import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '../views/Homepage.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Employees from '../views/Employees.vue'
import PPERegister from '../views/PPERegister.vue'
import Issuance from '../views/PPEIssuance.vue'
import Inventory from '../views/Inventory.vue'
import { useSupabase } from '../composables/useSupabase'

const routes = [
{ path: '/', component: Homepage },
{ path: '/login', component: Login },

{
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
        { path: 'employees', component: Employees },
        { path: 'pperegister', component: PPERegister },
        { path: 'issuance', component: Issuance },
        { path: 'inventory', component: Inventory }
    ]
}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const { supabase } = useSupabase()
  const { data } = await supabase.auth.getSession()
  const isAuthenticated = !!data.session

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router