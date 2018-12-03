<template>
  <div ref="popupWindow" class="popup" v-if="visible&&searchWordResult.word" :style="{top:top,left:left}"
       @mouseup.stop="">
    <flexbox orient="horizontal">
      <!--拼写和音标-->
      <flexbox-item><span class="spell">{{searchWordResult.word.spell}}</span>
        <pronounce :word="searchWordResult.word"></pronounce>
      </flexbox-item>

      <!--加入生词本按钮-->
      <flexbox-item span="2">
        <img title="加入生词本" @click="addRawWord()" src="../assets/add.png" height="24px" width="24px"
             style="position:relative; top:4px;"/>
      </flexbox-item>
    </flexbox>

    <!--释义-->
    <div>
      <flexbox-item>
        <div v-for="meaningItem in searchWordResult.word.meaningItems">
          <span class="ciXing">{{meaningItem.ciXing}}</span><span>{{meaningItem.meaning}}</span></div>
      </flexbox-item>
    </div>

    <!--单词发音-->
    <audio ref="wordSound" v-if="searchWordResult.soundPath"
           :src="soundBaseUrl + '/'+searchWordResult.soundPath+'.mp3'">
    </audio>
  </div>
</template>
<style scoped>
  .popup {
    position: fixed;
    z-index: 100;
    border: 1px solid #999;
    padding: 8px;
    background-color: #99bbee;
    max-width: 500px;
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
        searchWordResult: {word: {}},
        soundBaseUrl: config.soundBaseUrl
      }
    },
    methods: {
      addRawWord () {
        api.addRawWord(this.searchWordResult.word.spell, '逐个添加').then((res) => {
          if (res.data.success) {
            this.info('成功加入了生词本')
          } else {
            this.warn(res.data.msg)
          }
        })
      },
      show (spell) {
        this.visible = false
        api.searchWord(spell).then((res) => {
          this.searchWordResult = res.data

          if (!res.data.word) {
            this.searchWordResult = {word: {}}
            this.warn('单词不存在：' + spell)
            return
          }

          this.visible = true
          this.$nextTick(() => { // 由于播放声音依赖于DOM(Audio标签)，所以需要等到DOM刷新后才调用
            // 单词自动发音
            if (this.$refs.wordSound) {
              this.$refs.wordSound.play()
            }
          })
        })
      },
      hide () {
        this.visible = false
      }
    }
  }
</script>
