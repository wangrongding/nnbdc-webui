<template>
  <div class="container">

    <group label-width="5em" title-color="#eee">
      <x-input title="单词拼写: " placeholder="请输入单词拼写，回车查询" v-model="word.spell"
               @keydown.native="onSpellKeyDown($event)"></x-input>
    </group>

    <!--单词发音-->
    <pronounce :word="word"></pronounce>
    <!--单词发音-->
    <audio ref="wordSound" v-if="wordSoundFile" :src="wordSoundFile"
           preload="none">
      <BrowserTooOldForAudio/>
    </audio>
    <img title="单词发音" class='speaker' v-if="wordSoundFile" src='../assets/speaker.png'
         @click="playSound($refs.wordSound)"
         v-shortkey="['s']" @shortkey="playSound($refs.wordSound)"/>(S)

    <!--释义-->
    <group>
      <flexbox v-for="item in word.meaningItems" :key="item.id">
        <flexbox-item :span="1">
          <x-input class="ciXing" v-model="item.ciXing" :show-clear="false" placeholder="输入词性"></x-input>
        </flexbox-item>
        <flexbox-item>
          <x-input v-model="item.meaning" :show-clear="false" placeholder="输入释义"></x-input>
        </flexbox-item>
        <flexbox-item :span="1">
          <x-button type="warn" @click.native="deleteMeaningItem(item.id)">删除</x-button>
        </flexbox-item>
      </flexbox>
    </group>
    <x-button type="primary" @click.native="addMeaningItem()" v-if="word.id">添加释义项</x-button>

    <!--例句-->
    <group>
      <flexbox v-for="item in word.sentences" :key="item.id">
        <flexbox-item>
          <x-input class="ciXing" v-model="item.english" :show-clear="false" placeholder="输入英文例句"></x-input>
          <x-input v-model="item.chinese" :show-clear="false" placeholder="输入中文翻译"></x-input>
        </flexbox-item>
        <flexbox-item :span="1">
          <x-button v-if="isPhase(word.spell)" type="warn" @click.native="deleteSentence(item.id)">删除</x-button>
        </flexbox-item>
      </flexbox>
    </group>

    <flexbox orient="horizontal" style="margin-top:16px;">
      <flexbox-item>
        <x-button type="primary" @click.native="submit()">提交</x-button>
      </flexbox-item>
      <flexbox-item>
        <x-button type="warn" @click.native="cancel()">取消</x-button>
      </flexbox-item>
    </flexbox>
  </div>
</template>
<style scoped>
  .container {
    padding: 16px;
  }

  .speaker {
    position: relative;
    top: 8px;
    height: 24px;
    width: 24px;
    cursor: pointer;
  }

  .ciXing {
    color: blue;
  }
</style>
<script>
  import {mapActions} from 'vuex'
  import api from './api'
  import util from './util'
  import BrowserTooOldForAudio from '../components/BrowserTooOldForAudio.vue'
  import {
    FlexboxItem,
    Flexbox,
    XInput,
    XButton,
    Group
  } from 'vux'

  export default {
    components: {
      Group,
      XInput,
      XButton,
      Flexbox,
      FlexboxItem,
      BrowserTooOldForAudio
    },
    data () {
      return {
        word: {spell: ''}
      }
    },
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('单词编辑')
    },
    computed: {
      wordSoundFile () {
        return util.wordSoundFile(this.word)
      }
    },
    methods: {
      ...mapActions([
        'setNavVisible',
        'setCurrMenuItem'
      ]),
      isPhase (spell) {
        return util.isPhase(spell)
      },
      playSound (audio) {
        audio.play()
      },
      addMeaningItem () {
        this.word.meaningItems.push({id: null, ciXing: '', meaning: ''})
      },
      onSpellKeyDown (event) {
        if (event.key === 'Enter') {
          let spell = this.word.spell
          api.getWordBySpell(spell).then((res) => {
            if (res.data) {
              this.word = res.data
            } else {
              this.warn('查不到单词：' + spell)
              this.word = {spell: spell}
            }
          })
        }
      },
      deleteMeaningItem (itemId) {
        for (let i = 0; i < this.word.meaningItems.length; i++) {
          let item = this.word.meaningItems[i]
          if (item.id === itemId) {
            this.word.meaningItems.splice(i, 1)
            break
          }
        }
      },
      deleteSentence (itemId) {
        for (let i = 0; i < this.word.sentences.length; i++) {
          let item = this.word.sentences[i]
          if (item.id === itemId) {
            this.word.sentences.splice(i, 1)
            break
          }
        }
      },
      cancel () {
        this.$router.push({path: '/main', query: {}})
      },
      submit () {
        api.updateWord(this.word).then((res) => {
          if (res.data.success) {
            this.info('单词修改成功')
          } else {
            this.warn(res.data.msg)
          }
        })
      }
    }
  }
</script>
