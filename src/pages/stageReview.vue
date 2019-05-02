<template>
  <div class="review">
    <table id="wordTable" style="TABLE-LAYOUT: fixed; width: 100%;">
      <tr>
        <th style='width:35%; word-break:break-all;'>拼写</th>
        <th style='width:55%;'>释义</th>
        <th style='width:10%;'>掌握度</th>
      </tr>

      <tr v-for="(learningWord, i) in stageWords" @click='playSounds([$refs.wordSound[i]])' :class="i%2?'odd':'even'">
        <td style='padding:0'>
          <audio ref="wordSound" v-if="learningWord.sound" :src="soundBaseUrl + '/'+learningWord.soundPath+'.mp3'">
          </audio>
          <input type='text'
                 v-model="mode=='browse'||(focusedWords[i]&&currWordIndex!=i)?learningWord.word.spell:spellInputs[i]"
                 v-focus="currWordIndex==i"
                 :class="mode=='browse'?'normal':spellInputs[i]&&(spellInputs[i].toLowerCase()==learningWord.word.spell.toLowerCase())?'correct':(currWordIndex==i?'wrong':'wrong2')"
                 @keyup="checkSpell($event, i,learningWord.word.spell)"
                 @blur="onInputBlur(i, learningWord.word.spell)"
                 @focus="currWordIndex=i; focusedWords[i]=true;"
                 :disabled="mode=='browse'" @click.stop=""/>
        </td>
        <td @mouseover="playSounds([$refs.wordSound[i]])">{{learningWord.word.meaningStr.replace(/'/g, "’")}}</td>
        <td>
          <progress-bar :progress="5 - learningWord.lifeValue" :max="5" precision="0" height="16px" fontSize="9px"
                        style="width:100px;top:4px;"></progress-bar>
        </td>
      </tr>
    </table>
    <x-button type="primary" style="width:150px; float:left;" id="doSpell" v-shortkey="['x']"
              @shortkey.native="startSpellExercise()" @click.native="startSpellExercise()">拼写练习(X)
    </x-button>

    <div id="nextBtn"
         @click="nextBtnClicked()">下一词
    </div>
  </div>
</template>
<style scoped>
  #nextBtn {
    position: fixed;
    top: 300px;
    right: 0px;
    height: 50px;
    line-height: 50px;
    padding: 0px 16px;
    border: 1px solid lightgray;
    cursor: pointer;
    background-color: #3BA776;
    color: #eee;
  }

  #nextBtn:hover {
    background-color: #4BB786;
  }

  table {
    border-collapse: collapse;
    border: solid #ddd 1px;
  }

  th {
    background-color: #9ed99d;
    color: #fff;
  }

  tr:hover {
    background-color: #9999ff;
  }

  .odd {
    background-color: #ddd;
  }

  .even {
    background-color: #ccf;
  }

  div.review {
    width: 75%;
    margin: auto;
  }

  input {
    font-size: 24px;
    font-weight: bold;
    height: 48px;
    width: 90%;
    padding-left: 16px;
    background-color: transparent;
    border: none;
  }

  input.normal {
    color: #000;
  }

  input.correct {
    color: green;
  }

  input.wrong {
    color: red;
  }

  input.wrong2 {
    color: blue;
  }
</style>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import { Tab, TabItem, XButton, Flexbox, FlexboxItem } from 'vux'
  import { focus } from 'vue-focus'
  import api from '../pages/api'
  import config from '../config'

  export default {
    directives: {focus: focus},
    components: {
      Tab,
      TabItem,
      XButton,
      Flexbox,
      FlexboxItem
    },
    data () {
      return {
        stageWords: [],
        soundsToPlay: [],
        spellInputs: [], // 拼写练习时为每个单词输入的内容
        focusedWords: [], // 记录每个输入框是否获得过焦点
        currWordIndex: -1,
        mode: 'browse',
        soundBaseUrl: config.soundBaseUrl
      }
    },
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('学习')

      this.getReviewWords()
    },
    methods: {
      ...mapActions([
        'setNavVisible',
        'setCurrMenuItem'
      ]),
      nextBtnClicked () {
        this.$router.push({path: '/bdc', query: {fromPage: 'stageReview'}})
      },
      startSpellExercise () {
        this.mode = 'spell'
        this.spellInputs = []
        this.focusedWords = []
        this.currWordIndex = 0
      },
      /**
       * 阶段复习中的拼写正确性检查
       */
      checkSpell (event, wordIndex, expectedSpell) {
        let nextID = wordIndex + 1
        let prevID = wordIndex - 1
        if (event.keyCode === 40 || event.keyCode === 13) { // 向下键或回车键
          this.currWordIndex = nextID
        } else if (event.keyCode === 38) { // 向上键
          this.currWordIndex = prevID >= 0 ? prevID : 0
        } else {
          let inputText = this.spellInputs[wordIndex]
          if (!inputText) {
            return
          }
          inputText = inputText.replace(/'/g, '’')
          if (inputText.toLowerCase() === expectedSpell.toLowerCase()) { // 拼写正确了
            this.playSounds([this.$refs.wordSound[wordIndex]])
            this.currWordIndex = nextID
          }
        }
      },
      onInputBlur (wordIndex, expectText) {
        this.playSounds([this.$refs.wordSound[wordIndex]])
      },
      getReviewWords () {
        api.getReviewWords().then((res) => {
          this.stageWords = res.data
        })
      },
      playSounds (audios) {
        // 停止当前的播放
        if (this.soundsToPlay.length > 0) {
          this.soundsToPlay[0].pause()
        }

        // 播放指定的声音列表，从第一个开始，播放完后自动播放下一个
        this.soundsToPlay = audios
        if (this.soundsToPlay.length > 0) {
          this.soundsToPlay[0].load()
          this.soundsToPlay[0].play()
        }
      }
    },
    computed: mapGetters([
      'getLoggedInUser'
    ])
  }
</script>
