<template>
  <div >
    <div class="posts" style="background-color: #f9f9f9; width: 90%; margin-left: 5%;">
      <table style="width:100%;font-size: 14px; table-layout:fixed">
        <tr>
          <th style="width: 50%; word-break: break-all;">内容</th>
          <th style="width: 15%">发送方</th>
          <th style="width: 15%">目标方</th>
          <th>更新时间</th>
          <th>操作</th>
        </tr>
        <tr v-for="(msg,i) in msgs" :class="i%2?'odd':'even'">
          <td @click="showdMsgInfo(msg);"
              style="width: 40%; word-break: break-all;">{{msg.content}}
          </td>
          <td @click="showdMsgInfo(msg);"><img v-if="msg.fromUser.figureUrl"
                                                 alt="QQ头像" style="height: 30px; width: 30px;"
                                                 :src="msg.fromUser.figureUrl"/> {{msg.fromUser.displayNickName}}
          </td>
          <td @click="showdMsgInfo(msg);"><img v-if="msg.toUser.figureUrl"
                                              alt="QQ头像" style="height: 30px; width: 30px;"
                                              :src="msg.toUser.figureUrl"/> {{msg.toUser.displayNickName}}
          </td>
          <td  @click="showdMsgInfo(msg);">{{msg.updateTime | formatLongDate('yyyy-MM-dd HH:mm')}}</td>
          <td><span> <a
            href="javascript:;" @click="showdMsgInfo(msg)">查看</a>
							</span>
          </td>
        </tr>
      </table>
      <mo-paging style="float:right; margin:3px 0 0 0;"
                 :page-index="currentPage"
                 :total="total"
                 :page-size="pageSize"
                 @change="pageChange">
      </mo-paging>

      <x-button type="primary" @click.native="createPost()" style="width:100px">发帖</x-button>


    </div>
    <MsgDetailWindow ref="msgDetailWindow"></MsgDetailWindow>
  </div>
</template>
<style scoped>
  @media only screen and (min-width: 651px) {
    .posts {
      float: left;
      width: 100%;
      border-radius: 3px;
    }
  }

  @media only screen and (max-width: 650px) {
    .posts {
      float: left;
      width: 100%;
    }
  }

  .groupSummary {
    margin-top: 0.5em;
  }

  a {
    text-decoration: none;
    font-size: 0.95em;
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
  import { mapActions, mapGetters } from 'vuex'
  import { XButton, Flexbox, FlexboxItem } from 'vux'
  import api from './api'
  import MoPaging from '../components/paging.vue'
  import MsgDetailWindow from '../components/AdviceDetailWindow.vue'

  export default {
    data () {
      return {
        pageSize: 20, // 每页显示20条数据
        currentPage: 1, // 当前页码
        total: 0, // 总记录数
        forum: {},
        msgs: []
      }
    },
    components: {XButton, Flexbox, FlexboxItem, MoPaging, MsgDetailWindow},
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('意见处理')
      this.getForumInfo()
      this.getMsgsByPage()
    },
    methods: {
      ...mapGetters([
        'getLoggedInUser'
      ]),
      ...mapActions([
        'setNavVisible',
        'setCurrMenuItem'
      ]),
      getForumInfo () {
        api.getForumByName('总论坛').then((res) => {
          this.forum = res.data
        })
      },
      getMsgsByPage () {
        api.getMsgsByPage(this.currentPage, this.pageSize, 'Advice', null).then((res) => {
          this.total = res.data.total
          this.msgs = res.data.rows
        })
      },
      createPost () {
        this.$router.push({path: '/createForumPost', query: {forumId: this.forum.id}})
      },
      showdMsgInfo (msg) {
        this.$refs.msgDetailWindow.show(msg.fromUser, msg.toUser, 20)
      },
      pageChange (page) {
        this.currentPage = page
        this.getMsgsByPage()
      }
    }
  }

</script>
