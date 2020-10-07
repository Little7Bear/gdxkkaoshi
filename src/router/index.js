import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import PaperList from '@/views/paper-list.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'paper-list',
    name: 'Home',
    component: Home,
    children: [
      {
        path: 'paper-list',
        name: 'PaperList',
        component: PaperList,
      },
      {
        path: 'my-score',
        name: 'MyScore',
        component: () => import(/* webpackChunkName: "score" */ '@/views/my-score.vue')
      },
    ]
  },
  {
    path: '/answer',
    name: 'Answer',
    component: () => import(/* webpackChunkName: "answer" */ '@/views/answer.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
