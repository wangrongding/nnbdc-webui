<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div v-if="isNavVisible" class="wrapper">
    <!--菜单-->
    <div v-for='menuItem in menuItems' class="nav-item" :class='{active: menuItem.name == getCurrMenuItem}'
         v-on:click='tabToggle(menuItem)'>
      <span>{{menuItem.name}}</span>
    </div>

    <!--工具和按钮-->
    <div class="nav-item">
      <div class="toolbar">
        <!--单词搜索-->
        <div class="search">
          <input v-model="searchStr" v-focus="searchFocused" @focus="searchFocused=true" @keyup.stop="onKeyUp($event)"
                 @change="onSearchChange()"
                 @keydown="onKeyDown($event)" @mouseup.stop=""/>
          <ul class="wordList">
            <li v-for="(matchedWord,i) in matchedWords" :class="currMatchedWordIndex==i?'selected':''"
                @click="onMatchedWordClick(i)" @mouseup.stop="">
              <span class="spell">{{matchedWord.spell}}</span>
              <span class="meaning">&nbsp;{{matchedWord.meaningStr}}</span>
            </li>
          </ul>
        </div>

        <!--修改用户信息入口-->
        <span @click="isEditingUserInfo=!isEditingUserInfo"
              @mouseup.stop="">{{getLoggedInUser.displayNickName}}&nbsp;</span>

        <div class="statusIcons">
          <img class="status" title="与实时服务器连接正常" v-if="isConnectedToSocketServer"
               src="../assets/green.png"/>
          <img class="status" title="与实时服务器连接中断，刷新页面可恢复" v-if="!isConnectedToSocketServer"
               src="../assets/red.png"/>

          <img class="status" title="已登录web服务器" v-if="getLoggedInUser.id"
               src="../assets/green.png"/>
          <img class="status" title="未登录web服务器，请退出后重新登录" v-if="!getLoggedInUser.id"
               src="../assets/red.png"/>

          <div id="msgCount" @click="msgCountClicked" @mouseup.stop="" :title="getNewMsgCount==0?'没有新消息':'您有新消息，点击查看'">
            <img class="status" v-if="getNewMsgCount==0"
                 src="../assets/green.png"/>
            <img class="status" v-if="getNewMsgCount>0"
                 src="../assets/yellow.png"/>
            <span>{{getNewMsgCount}}</span>
          </div>
        </div>

        <ul class="msgList" v-if="isShowingMsgs">
          <li v-for="msg in getMsgs" @mouseup.stop="">
            <div style="display:flex;" :class="{viewedMsg:msg.viewed}">
              <span style="flex-grow:1;">{{msg.content}}</span>
              <span style="flex-grow:0; padding:0px 4px;">({{msg.time | formatLongDate('HH:mm')}})</span>
              <div class="btnDiv" v-if="msg.type=='inviteYouToGame'" @click="acceptInvite(msg.args[2])">接受</div>
            </div>
          </li>
          <li v-if="getMsgs.length==0">没有消息</li>
        </ul>
      </div>
    </div>

    <!--修改用户信息弹出框-->
    <div class="userInfo" v-if="isEditingUserInfo">
      <group label-width="8em" title-color="#eee">
        <x-input title="Email: " placeholder="请输入邮箱地址, 邮箱将用作用户名" v-model="email" is-type="email"></x-input>
        <x-input title="密码: " placeholder="至少含6个字符" v-model="password" type="password" :min="6"></x-input>
        <x-input title="再输入一次密码:" v-model="password2" type="password" :min="6"></x-input>
        <x-input title="昵称:" v-model="nickName"></x-input>
      </group>

      <flexbox orient="horizontal" style="margin-top:8px;">
        <flexbox-item>
          <x-button type="primary" @click.native="submitUserInfo()">提交</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button type="warn" @click.native="isEditingUserInfo=false" @mouseup.native.stop="">取消</x-button>
        </flexbox-item>
      </flexbox>
    </div>

    <!--收到消息时的提示音-->
    <audio ref="msgSound" src="../assets/explode.mp3">
    </audio>
  </div>
</template>

<style scoped>
  /* @import './reset.css';*/
  body {
    min-height: 100%;
  }

  .viewedMsg {
    color: #999;
  }

  .userInfo {
    width: 450px;
    position: absolute;
    top: 56px;
    right: 0px;
    z-index: 3;
    padding: 0px;
    background-color: #335588;
    padding: 0px 8px 8px 8px;
    box-sizing: border-box;
    color: #000;
  }

  #msgCount {
    display: inline-flex;
    position: relative;
  }

  #msgCount span {
    position: absolute;
    right: 0px;
    bottom: 0px;
    font-size: 12px;
    width: 16px;
    height: 16px;
    line-height: 16px;
    color: yellow;
  }

  .btnDiv {
    min-height: 24px;
    line-height: 24px;
    width: 80px;
    text-align: center;
    border: 1px solid #2b5360;
    color: #fff;
  }

  .btnDiv:hover {
    cursor: pointer;
    background-color: #3355bb;
  }

  .statusIcons {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  img.status {
    width: 16px;
    height: 16px;
  }

  div.search {
    display: inline-block;
  }

  div.search input {
    font-size: 20px;
    width: 6em;
  }

  li.selected {
    background-color: #335;
  }

  ul.msgList {
    position: absolute;
    list-style: none;
    z-index: 2;
    background-color: #335588;
    min-width: 300px;
    top: 56px;
    right: 16px;
    max-height: 500px;
    overflow-y: auto;
  }

  ul.msgList li {
    color: #fff;
    padding: 0px 8px;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    text-align: left;
  }

  ul.wordList {
    position: relative;
    list-style: none;
    z-index: 10;
    background-color: #335588;
    width: 300px;
  }

  ul.wordList li {
    cursor: pointer;
    color: #fff;
    padding: 0px 8px;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    text-align: left;
  }

  ul.wordList li:hover {
    background-color: #3355bb;
  }

  span.spell {
    color: #fff;
  }

  span.meaning {
    color: #bbb;
    font-size: 13px;
  }

  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #214778;
    color: #D6D5CC;
    flex-wrap: wrap;
    height: 56px;
  }

  .nav-item {
    flex: 1;
    text-align: center;
    height: 56px;
    line-height: 56px;
    box-sizing: border-box;
    cursor: pointer;
  }

  .nav-item.active {
    background: #2B435B;
    font-weight: bold;
    color: #fff;
  }

  .toolbar {
    width: 30em;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    height: 100%;
  }

  .dropdownWrapper {
    border: 1px solid #2C3E50;
    font-size: 14px;
  }

  .dropdownWrapper li {
    display: block;
  }

  .dropdownBtn {
    display: inline-block;
    width: 100%;
    height: 100%;
  }


</style>

<script>
  import api from '../pages/api'
  import { focus } from 'vue-focus'
  import { mapActions, mapGetters } from 'vuex'
  import {
    Group,
    XInput,
    XButton,
    Flexbox,
    FlexboxItem
  } from 'vux'

  export default {
    directives: {focus: focus},
    components: {
      Group,
      XInput,
      XButton,
      Flexbox,
      FlexboxItem
    },
    sockets: {
      inviteYouToGame: function (data) {
        let sender = data[0]
        let gameType = data[1]
        let room = data[2]
        let hallName = data[3]
        let content = sender.displayNickName + '邀请你进行游戏，级别:' + hallName
        let msg = {
          type: 'inviteYouToGame',
          content: content,
          sender: sender,
          args: [gameType, room, hallName],
          viewed: false
        }
        this.addNewMsg(msg)
        this.$refs.msgSound.play()
      }
    },
    data () {
      return {
        email: null,
        nickName: null,
        password: null,
        password2: null,
        isEditingUserInfo: false,
        isShowingMsgs: false,
        unwatchHandle: null,
        searchStr: '',
        searchFocused: false,
        dropdownActive: false,
        wordsList: [],
        matchedWords: [],
        currMatchedWordIndex: 0, // 用于指示匹配单词列表中那个单词当前被选中
        menuItems: [{
          name: '进度',
          func: () => {
            this.$router.push({path: '/main', query: {}})
          }
        }, {
          name: '学习',
          func: () => {
            this.$router.push({path: '/beforeStudy', query: {}})
          }
        }, {
          name: '生词本',
          func: () => {
            this.$router.push({path: '/rawWord', query: {}})
          }
        }, {
          name: '小组',
          func: () => {
            this.$router.push({path: '/studyGroupList', query: {}})
          }
        }, {
          name: '论坛',
          func: () => {
            this.$router.push({path: '/forum', query: {}})
          }
        }, {
          name: '排行',
          func: () => {
            this.$router.push({path: '/paihang', query: {}})
          }
        }, {
          name: '聊天',
          func: () => {
            this.$router.push({path: '/chat', query: {}})
          }
        }, {
          name: '游戏',
          func: () => {
            this.$router.push({path: '/gameCenter', query: {}})
          }
        }, {
          name: '单词书',
          func: () => {
            this.$router.push({path: '/selectDict', query: {}})
          }
        }, {
          name: '退出',
          func: () => {
            api.logout().then(() => {
              this.setLoggedInUser({})
              this.$router.push({path: '/', query: {}})
            })
          }
        }]
      }
    },
    mounted () {
      api.getWordsList().then((res) => {
        this.wordsList = res.data
      })

      // 监听store状态变化
      this.unwatchHandle = this.$store.watch(
        (state) => {
          return state.loggedInUser
        },
        () => {
          this.email = this.getLoggedInUser.email
          this.nickName = this.getLoggedInUser.nickName

          if (this.getLoggedInUser.isInputor) {
            if (!this.hasMenuItem('单词编辑')) {
              let menuItem = {
                name: '单词编辑',
                func: () => {
                  this.$router.push({path: '/wordEdit', query: {}})
                }
              }
              this.menuItems.splice(-1, 0, menuItem)
            }
            if (!this.hasMenuItem('意见处理')) {
              let menuItem = {
                name: '意见处理',
                func: () => {
                  this.$router.push({path: '/handleAdvice', query: {}})
                }
              }
              this.menuItems.splice(-1, 0, menuItem)
            }
          }
        },
        {
          deep: true // add this if u need to watch object properties change etc.
        }
      )
    },
    destroyed () {
      this.unwatchHandle() // 取消对store的监听
    },
    computed: {
      ...mapGetters([
        'getLoggedInUser',
        'isNavVisible',
        'getCurrMenuItem',
        'isConnectedToSocketServer',
        'getNewMsgCount',
        'getMsgs'
      ])
    },
    methods: {
      ...mapActions([
        'setCurrMenuItem',
        'setLoggedInUser',
        'setIsConnectedToSocketServer',
        'addNewMsg',
        'setMsgsAsViewed'
      ]),
      hasMenuItem (itemName) {
        let itemAdded = false
        for (let i in this.menuItems) {
          let item = this.menuItems[i]
          if (item.name === itemName) {
            itemAdded = true
            break
          }
        }
        return itemAdded
      },
      submitUserInfo () {
        api.updateUserInfo(this.email, this.nickName, this.password, this.password2).then((res) => {
          if (res.data.success) {
            this.info('修改用户信息成功')
            this.isEditingUserInfo = false

            // 刷新用户信息
            api.getLoggedInUser().then((res) => {
              this.setLoggedInUser(res.data == null ? {} : res.data)
            })
          } else {
            this.warn(res.data.msg)
          }
        })
      },
      msgCountClicked () {
        if (this.isShowingMsgs) {
          this.hideMsgs()
        } else {
          this.showMsgs()
        }
      },
      hideMsgs () {
        this.isShowingMsgs = false
        this.setMsgsAsViewed()
      },
      showMsgs () {
        this.isShowingMsgs = true
      },
      acceptInvite (hallName) {
        this.hideMsgs()
        this.$router.push({path: '/russia', query: {hallName: hallName, random: Math.random()}}) // random参数是为了达到强制刷新页面的效果，否则如果用户已经在目标大厅了，则不会重新加载当前页面（因为URL相同）
      },
      /** 隐藏单词搜索的备选单词列表 */
      hideCandidateWordsWindow () {
        this.clearSearch()
        this.searchFocused = false
      },
      onMatchedWordClick (index) {
        this.currMatchedWordIndex = index

        let spell = this.matchedWords[this.currMatchedWordIndex].spell
        this.doSearch(spell)
      },
      onKeyDown (event) {
        if (event.key === 'ArrowDown') {
          this.currMatchedWordIndex++
          if (this.currMatchedWordIndex >= this.matchedWords.length) {
            this.currMatchedWordIndex = 0
          }
        } else if (event.key === 'ArrowUp') {
          this.currMatchedWordIndex--
          if (this.currMatchedWordIndex < 0) {
            this.currMatchedWordIndex = this.matchedWords.length - 1
          }
        } else if (event.key === 'Enter') {
          let spell = this.searchStr
          if (this.matchedWords.length > 0) {
            spell = this.matchedWords[this.currMatchedWordIndex].spell
          }
          this.doSearch(spell)
        } else if (event.key === 'Escape') {
          this.clearSearch()
          this.searchFocused = false
          this.$emit('hideWordDetailWindow')
        }
      },
      onKeyUp (event) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'ArrowLeft' ||
          event.key === 'ArrowRight' || event.key === 'Enter' || event.key === 'Escape') {
          return
        }
        this.matchedWords = []
        this.currMatchedWordIndex = 0
        for (let i in this.wordsList) {
          let word = this.wordsList[i]
          if (this.searchStr && word.spell.toLowerCase().startsWith(this.searchStr.toLowerCase())) {
            this.matchedWords.push(word)
            if (this.matchedWords.length >= 15) {
              break
            }
          }
        }
      },
      clearSearch () {
        this.searchStr = ''
        this.matchedWords = []
      },
      doSearch (spell) {
        this.$emit('popWordDetailWindow', spell, null)
        this.clearSearch()
      },
      tabToggle: function (menuItem) {
        this.setCurrMenuItem(menuItem.name)

        if (menuItem.name === '进度') {
          this.dropdownActive = !this.dropdownActive
        } else {
          this.dropdownActive = false
        }

        menuItem.func()
      }
    }
  }
</script>
