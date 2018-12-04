<template>
  <div ref="popupWindow" class="popup" v-if="visible" style="margin:auto"
       @mouseup.stop="">
    <table style="width:100%;font-size: 14px; table-layout:fixed">
      <tr>
        <th style="width: 50%; word-break: break-all;">内容</th>
        <th style="width: 10%">发送方</th>
        <th style="width: 10%">目标方</th>
        <th>更新时间</th>
        <th>操作</th>
      </tr>
      <tr v-for="(msg,i) in msgs" :class="i%2?'odd':'even'">
        <td @click="showdMsgInfo(msg);"
            style="width: 40%; word-break: break-all;">{{msg.content}}
        </td>
        <td><img v-if="msg.fromUser.figureUrl"
                 alt="QQ头像" style="height: 30px; width: 30px;"
                 :src="msg.fromUser.figureUrl"/> {{msg.fromUser.displayNickName}}
        </td>
        <td><img v-if="msg.toUser.figureUrl"
                 alt="QQ头像" style="height: 30px; width: 30px;"
                 :src="msg.toUser.figureUrl"/> {{msg.toUser.displayNickName}}
        </td>
        <td>{{msg.updateTime | formatLongDate('yyyy-MM-dd HH:mm')}}</td>
        <td><span> <a
          href="javascript:;" @click="showdMsgInfo(msg)">查看</a>
							</span>
          <span > <a href="javascript:;" @click="deleteMsg(msg.id)">删除</a></span>
        </td>
      </tr>
    </table>
  </div>
</template>
<style scoped>
  .popup {
    position: fixed;
    z-index: 100;
    border: 1px solid #999;
    padding: 8px;
    background-color: #99bbee;
    max-width: 800px;
    max-height: 600px;

    margin:0 auto;
    left:0;
    right:0;
    top:0;
    bottom:0;
    overflow:auto;
  }

  .ciXing {
    font-weight: bold;
    margin-right: 8px;
    min-width: 30px;
    text-align: right;
    display: inline-block;
  }

  .spell {
    font-size: 20px;
    font-weight: bold;
    color: green;
    margin-right: 8px;
  }
</style>
<script>
  import { Flexbox, FlexboxItem } from 'vux'
  import api from '../pages/api'
  import config from '../config'

  export default {
    components: {
      Flexbox,
      FlexboxItem
    },
    data () {
      return {
        visible: false,
        top: '0px',
        left: '0px',
        msgs: [],
        soundBaseUrl: config.soundBaseUrl
      }
    },
    methods: {
      show (user1, user2, msgCount) {
        this.visible = false
        api.getLastestMsgsBetweenTwoUsers(user1.id, user2.id, msgCount).then((res) => {
          this.msgs = res.data
          this.visible = true
        })
      },
      hide () {
        this.visible = false
      }
    }
  }
</script>
