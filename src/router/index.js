import Vue from 'vue'
import Router from 'vue-router'
import home from '@/page/home'
import joinInfo from '@/page/joinInfo'
import list from '@/page/list'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: home
    },
    {
      path: "/joinInfo",
      name: "joinInfo",
      component: joinInfo
    },
    {
      path: "/list",
      name: "list",
      component: list
    }
  ]
})

