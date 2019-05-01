// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueLocalStorage from 'vue-localstorage'
import ShortKey from 'vue-shortkey'
import VueSocketio from 'vue-socket.io'
import {mapGetters, mapActions} from 'vuex'
import {AlertPlugin, ToastPlugin, LoadingPlugin, ConfirmPlugin} from 'vux'
import App from './App'
import router from './router'
import MyNav from './components/nav'
import ProgressBar from './components/ProgressBar.vue'
import Pronounce from './components/Pronounce.vue'
import store from './vuex/modules/bdc'
import util from './pages/util'
import config from './config'

Vue.use(ShortKey, {prevent: ['input', 'textarea']})
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueLocalStorage)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)

Vue.use(VueSocketio, config.socketServerUrl)

Vue.component('my-nav', MyNav)
Vue.component('progress-bar', ProgressBar)
Vue.component('pronounce', Pronounce)

Vue.filter('toString', function (val) {
  return val.toString()
})
Vue.filter('toFixed', (value, digNum) => {
  return value == null ? '' : value.toFixed(digNum)
})
Vue.filter('formatLongDate', (value, format) => {
  return util.formatDate(new Date(value), format)
})

// 把动词时态类型转为汉语
Vue.filter('transTenseType', (value) => {
  let tenseName = null
  if (value === 'PastTense') {
    tenseName = '过去式'
  } else if (value === 'PastParticiple') {
    tenseName = '过去分词'
  } else if (value === 'PresentParticiple') {
    tenseName = '现在分词'
  }
  return tenseName
})

Vue.prototype.warn = function (msg) {
  this.$vux.toast.show({type: 'warn', text: msg})
}

Vue.prototype.info = function (msg) {
  this.$vux.toast.show({type: 'success', text: msg})
}

/** 判断字符串中是否还有汉字 */
Vue.prototype.hasChinese = function (str) {
  let patrn = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi
  if (!patrn.exec(str)) {
    return false
  } else {
    return true
  }
}

Vue.config.devtools = true

Vue.http.interceptors.push((request, next) => {
  Vue.$vux.loading.show({text: '加载中'})
  request.credentials = true // 传递cookie
  next((response) => { // 在响应之后传给then之前对response进行修改和逻辑判断。对于token时候已过期的判断，就添加在此处，页面中任何一次http请求都会先调用此处方法
    Vue.$vux.loading.hide()
    if (response.status === 0) {
      console.log('request被取消')
    } else if (!response.ok) {
      alert(response.status)
      if (response.status === 401) {
        router.push({path: '/', query: {}})
      } else {
        alert('系统发生故障，牛牛深表歉意。详细信息：' + response.status + '， ' + response.statusText)
      }
    }
    return response
  })
})

Vue.directive('focus', {
  inserted: function (el, binding, vnode) {
    Vue.nextTick(function () {
      el.focus()
    })
  }
})

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store: store,
  render: h => h(App),
  data () {
    return {
      unwatchHandle: null,
      msgs: []
    }
  },
  sockets: {
    connect: function () {
      this.setIsConnectedToSocketServer(true)
      this.tryReportUserToSocketServer()
    },
    disconnect: function () {
      this.setIsConnectedToSocketServer(false)
      this.tryReportUserToSocketServer()
    },
    onlineCount: function (data) {
      this.setOnlineUserCount(data)
    }
  },
  mounted () {
    setInterval(() => {
      this.$socket.emit('heartBeat', '')
    }, 5000)

    // 监听登录状态变化
    this.unwatchHandle = this.$store.watch(
      (state) => {
        return state.loggedInUser
      },
      () => {
        this.tryReportUserToSocketServer()
      },
      {
        deep: true // add this if u need to watch object properties change etc.
      }
    )

    this.tryReportUserToSocketServer()
  },
  destroyed () {
    this.unwatchHandle()
  },
  computed: {
    ...mapGetters([
      'getLoggedInUser',
      'isUserReportedToSocketServer',
      'isConnectedToSocketServer'
    ])
  },
  methods: {
    ...mapActions([
      'setLoggedInUser',
      'setIsUserReportedToSocketServer',
      'setIsConnectedToSocketServer',
      'setOnlineUserCount',
      'addNewMsg'
    ]),

    /** 向Socket服务器上报用户名(login) */
    tryReportUserToSocketServer () {
      let userId = this.getLoggedInUser.id
      if (userId && this.isConnectedToSocketServer && !this.isUserReportedToSocketServer) {
        this.setIsUserReportedToSocketServer(true)
        this.$socket.emit('reportUser', userId)
      } else if ((!userId || !this.isConnectedToSocketServer) && this.isUserReportedToSocketServer) {
        this.setIsUserReportedToSocketServer(false)
      }
    }
  },
  localStorage: {
    rememberPwd: { // 是否记住密码
      type: Boolean,
      default: false
    },
    userName: {
      type: String,
      default: null
    },
    password: {
      type: String,
      default: null
    }
  }
}).$mount('#app-box')
