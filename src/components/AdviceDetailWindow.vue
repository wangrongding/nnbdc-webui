<template>
  <div ref="popupWindow" class="popup" v-if="visible" style="margin:auto"
       @mouseup.stop="">
    <table style="width:100%;font-size: 14px; table-layout:fixed">
      <tr>
        <th style="width: 50%; word-break: break-all;">内容</th>
        <th style="width: 10%">发送方</th>
        <th style="width: 10%">目标方</th>
        <th style="width: 20%">更新时间</th>
        <th>操作</th>
      </tr>
      <tr v-for="(msg,i) in msgs" :class="i%2?'odd':'even'">
        <td style="width: 40%; word-break: break-all;">{{msg.content}}
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
        <td>
          <span > <a href="javascript:;" @click="deleteMsg(msg.id)">删除</a></span>
        </td>
      </tr>
    </table>
    <div class="replyArea">
      <x-textarea v-model="replyContent" title="回复内容" placeholder="请输入回复内容" :max="8000"
                  style="border:1px solid #ddd;"></x-textarea>

      <div style="display:flex; justify-content: center">
        <div style="float: left; width: 8em;">
          <x-button type="primary" @click.native="saveReply()">提交</x-button>
        </div>
        <div style="float: left; width: 8em; margin-left: 0.5em;">
          <x-button type="primary" @click.native="hide()">关闭</x-button>
        </div>
      </div>
    </div>
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

  .replyArea {
    clear: left;
    padding-top: 1em;
  }
  table {
    border-collapse: collapse;
    border: none;
  }

  th {
    padding: 8px;
    background-color: #335588;
    color: #fff;
    text-align: left;
  }

  td {
    padding: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  tr:hover {
    background-color: #9999ff;
  }

  .odd {
    background-color: #e5e5e5;
  }

  .even {
    background-color: #cdc;
  }
</style>
<script>
  import { XButton, XInput, XTextarea, Group, Flexbox, FlexboxItem } from 'vux'
  import api from '../pages/api'
  import config from '../config'

  export default {
    components: {
      XButton,
      XInput,
      XTextarea,
      Group,
      Flexbox,
      FlexboxItem
    },
    data () {
      return {
        visible: false,
        top: '0px',
        left: '0px',
        msgs: [],
        replyContent: '',
        user1: null, // 提议人
        user2: null, // 系统
        soundBaseUrl: config.soundBaseUrl,
        msgCount: -1
      }
    },
    methods: {
      show (user1, user2, msgCount) {
        this.visible = false
        this.user1 = user1
        this.user2 = user2
        this.msgCount = msgCount
        this.refreshMsgs(() => { this.visible = true })
      },
      refreshMsgs (callback) {
        api.getLastestMsgsBetweenTwoUsers(this.user1.id, this.user2.id, this.msgCount).then((res) => {
          this.msgs = res.data
          if (callback) {
            callback()
          }
        })
      },
      hide () {
        this.visible = false
      },
      saveReply () {
        api.replyAdvice(this.replyContent, this.user1.id).then((resp) => {
          if (resp.data.success) {
            this.hide()
            this.info('回复成功')
          } else {
            this.warn(resp.data.msg)
          }
        })
      },
      deleteMsg (msgId) {
        api.deleteMsg(msgId).then((res) => {
          this.refreshMsgs(null)
        })
      }
    }
  }
</script>
