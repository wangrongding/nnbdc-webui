<template>
  <div style="font:14px 微软雅黑,宋体,arial,sans-serif;">
    <progress-bar :progress="currWord.progress[0]" :max="currWord.progress[1]" precision="0"
                  height="18px"></progress-bar>
    <div id="wordArea" style="float: left" class="shadow">
      <flexbox orient="horizontal" style="font-size:9px; color:lightgray">
        <flexbox-item :span="11"><span>掌握度 </span>
          <progress-bar :progress="5 - currWord.learningWord.lifeValue" :max="5" height="16px" fontSize="9px"
                        style="width:100px;top:4px;"></progress-bar>
          <span>下次复习：{{nextStudyDay}} 天后</span></flexbox-item>
        <flexbox-item>
							<span class="removeBtn">
                <img title="本单词已记牢，不用再学习了(T)" src="../assets/trash.png" width=32
                     v-shortkey="['t']"
                     @shortkey="markWordAsMastered()" @click="markWordAsMastered()"/>
              </span>
        </flexbox-item>
      </flexbox>

      <div class="spell">
        <!--根据句子学习单词-->
        <Highlight v-show="isSentenceMode&&selectedAnswer==null"
                   :text="currWord.sentences.length>0?currWord.sentences[0].english:spell"
                   :keyWords="currWord.learningWord.word.spell" style="font-size:20px"></Highlight>

        <!--根据拼写学习单词-->
        <span id="spell" v-show="isSpellMode||(selectedAnswer!=null&&selectedAnswer!=correctIndex)"
              :class="{'spellDefault':selectedAnswer==null, 'spellCorrect':selectedAnswer!=null&&isAnswerCorrect, 'spellWrong':selectedAnswer!=null&&!isAnswerCorrect}">{{currWord.learningWord.word.spell}}</span>

        <!--根据发音学习单词-->
        <pronounce :word="currWord.learningWord.word"></pronounce>
        <span>
          <!--单词发音-->
          <audio ref="wordSound" v-if="wordSoundFile" :src="wordSoundFile"
                 @ended="onSoundEnded()" preload="none">
            <BrowserTooOldForAudio/>
          </audio>
          <img title="单词发音" class='speaker' v-if="wordSoundFile" src='../assets/speaker.png'
               @click="playSounds([$refs.wordSound])"
               v-shortkey="['s']" @shortkey="playSounds([$refs.wordSound])"/>(S)&nbsp;


          <!--句子发音-->
          <audio ref="sentenceSound" v-if="firstSentenceSoundFile"
                 :src="firstSentenceSoundFile" @ended="onSoundEnded()" preload="none">
            <BrowserTooOldForAudio/>
          </audio>
          <span v-if="firstSentenceSoundFile"> <img title="句子发音" class='speaker' src='../assets/speaker.png'
                                                    @click="playSounds([$refs.sentenceSound])" v-shortkey="['r']"
                                                    @shortkey="playSounds([$refs.sentenceSound])"/>(R)</span>
        </span>&nbsp;
        <div v-show="currWord.learningMode==2" style="margin-top:8px">拼写练习(X)&nbsp;&nbsp;
          <input type="text" v-model="inputedSpell" v-shortkey.focus="['x']"
                 :class="inputedSpell.toLowerCase() == currWord.learningWord.word.spell.toLowerCase()?'spellCorrect':'spellWrong'"
                 @keyup="checkSpell($event, currWord.learningWord.word.spell)"
                 style="font-size:20px;font-weight:bold;"/>
          <img src='../assets/eye-black.png' @click="showCorrectSpell()"/>
        </div>
      </div>

      <div id="cigenHint" v-show="currWord.cigens.length>0">词根提示：</div>
      <div :class='i%2==0?"cigen":"cigenExplain"' v-for="(cigen, i) in currWord.cigens">{{cigen}}</div>

      <!--动词的时态-->
      <div id="verbTenses"
           v-show="(currWord.learningMode==0||currWord.learningMode==1)&&currWord.verbTenses.length>0">
        <span v-for="tense in currWord.verbTenses"
              class="tense">{{tense.tenseType | transTenseType}} {{tense.tensedSpell}}</span>
      </div>

      <div v-show="selectedAnswer==null"
           style="padding: 8px 8px; margin-top:8px; color: #999999; background-color: #eeeeff"
           @click="toggleAnswerDiv()" v-shortkey="['w']" @shortkey="toggleAnswerDiv()">显示/隐藏备选答案(W)
      </div>

      <!--答案区-->
      <div id="answerdiv" v-show="isAnswerDivVisible && selectedAnswer==null">
        <table class="answers" style="width: 100%; table-layout: fixed;">
          <tr>
            <td class="no" v-shortkey="['1']" @shortkey="answerBtnClicked(1)" @click="answerBtnClicked(1)">1
            </td>
            <td class="answer answerBtn" @click="answerBtnClicked(1)">
              {{correctIndex == 1 ? currWord.learningWord.word.meaningStr : currWord.otherWords[0].meaningStr}}
            </td>
            <td class="answerSearch"
                @click="answerSearch(correctIndex==1?currWord.learningWord.word.spell:currWord.otherWords[0].spell, $event)">
              查
            </td>
          </tr>
          <tr>
            <td class="no" v-shortkey="['2']" @shortkey="answerBtnClicked(2)" @click="answerBtnClicked(2)">2</td>
            <td class="answer answerBtn" @click="answerBtnClicked(2)">
              {{correctIndex == 2 ? currWord.learningWord.word.meaningStr : (correctIndex == 1 ? currWord.otherWords[0].meaningStr : currWord.otherWords[1].meaningStr)}}
            </td>
            <td class="answerSearch"
                @click="answerSearch(correctIndex==2?currWord.learningWord.word.spell:(correctIndex==1?currWord.otherWords[0].spell:currWord.otherWords[1].spell), $event)">
              查
            </td>
          </tr>
          <tr>
            <td class="no" v-shortkey="['3']" @shortkey="answerBtnClicked(3)" @click="answerBtnClicked(3)">3</td>
            <td class="answer answerBtn" @click="answerBtnClicked(3)">
              {{correctIndex == 3 ? currWord.learningWord.word.meaningStr : currWord.otherWords[1].meaningStr}}
            </td>
            <td class="answerSearch"
                @click="answerSearch(correctIndex==3?currWord.learningWord.word.spell:currWord.otherWords[1].spell, $event)">
              查
            </td>
          </tr>
          <tr>
            <td class="no" v-shortkey="['4']" @shortkey="answerBtnClicked(4)" @click="answerBtnClicked(4)">4</td>
            <td class="answer answerBtn" @click="answerBtnClicked(4)"
                style="color: red">不认识
            </td>
          </tr>
          <tr>
            <td class="no" v-shortkey="['5']" @shortkey="answerBtnClicked(5)" @click="answerBtnClicked(5)">5</td>
            <td class="answer answerBtn" @click="answerBtnClicked(5)"
                style="color: green">认识，再学学
            </td>
          </tr>
        </table>
      </div>
      <br/>

      <!--单词的详细信息，只有当回答不正确，或者用户要再学习时，才显示-->
      <div id="wordDesc" v-show="selectedAnswer!=null&&selectedAnswer!=correctIndex">
        <div style="margin-bottom: 5px; color: blue;">释义：</div>
        <div id="meanings">
          <div v-for="meaning in currWord.learningWord.word.meaningItems" class='meaning'>
            <span>{{meaning.ciXing}}&nbsp;</span><span>{{meaning.meaning}}</span>
          </div>
        </div>
        <div style="margin-bottom: 5px; margin-top: 8px; color: blue;">例句：</div>
        <div class="sentencesDiv">
          <ol id="sentences" class="sentences">
            <li v-for="(sentence,i) in currWord.sentences">
              <div class='sentence'>
                <span style='font-size:1.1em;'>{{sentence.english}}</span>

                <!--句子发音-->
                <audio :ref="'sentenceSound'+sentence.id" v-if="sentenceSoundFile(sentence)"
                       :src="sentenceSoundFile(sentence)" @ended="onSoundEnded()" preload="none">
                  <BrowserTooOldForAudio/>
                </audio>
                <img title="句子发音" class='speaker' style="width:16px;height:16px;top:4px;" src='../assets/speaker.png'
                     v-if="sentenceSoundFile(sentence)"
                     @click="playSounds([$refs['sentenceSound'+sentence.id][0]])"/>

                <!--例句翻译-->
                <div class='chineseContainer'>
                  <!--官方翻译-->
                  <div class='chinese' v-if="sentence.chinese">{{sentence.chinese}}</div>

                  <!--用户提供的翻译-->
                  <div v-if="!sentence.chinese">
                    <div v-if="sentence.sentenceDiyItems.length==0"
                         style="color:lightgray;font-size:9px">暂无翻译
                    </div>
                    <div v-for="diyItem in sentence.sentenceDiyItems">
                      <div style="display:inline-block" v-if="diyItem.hasBeenVoted">
                        <img src='../assets/hand.png' style='margin-left:8px' class='gray voteIcon'/><span
                        class='handCount'>{{diyItem.handCount}}</span><img
                        src='../assets/foot.png' style='margin-left:8px' class='gray voteIcon'/><span
                        class='footCount'>{{diyItem.footCount}}</span>
                      </div>
                      <div style="display:inline-block" v-if="!diyItem.hasBeenVoted">
                        <img src='../assets/hand.png' @click='handSentenceDiyItem(diyItem.id, i)'
                             style='margin-left:8px' class='voteIcon'/><span
                        class='handCount'>{{diyItem.handCount}}</span><img src='../assets//foot.png'
                                                                           style='margin-left:8px'
                                                                           @click='footSentenceDiyItem(diyItem.id, i)'
                                                                           class='voteIcon'/><span
                        class='footCount'>{{diyItem.footCount}}</span>
                      </div>
                      <span class="chinese">{{diyItem.content}}</span><span
                      style='color:#aaaaaa'>({{diyItem.author.displayNickName}})</span>
                      <img v-if="diyItem.author.userName == getLoggedInUser.userName" src='../assets/delete-black.png'
                           @click='deleteSentenceDiyItem(diyItem.id, i)'
                           style='margin-left:8px' class='voteIcon' title="删除"/>
                    </div>
                    <button v-show="!sentence.isEditingDiyItem" @click="showSentenceDiyItemEditor(i)">我来翻译
                    </button>

                    <!--内容编辑区-->
                    <flexbox orient="horizontal" v-show="sentence.isEditingDiyItem">
                      <flexbox-item>
                        <x-textarea v-model="sentence.diyItemContent" :max="200"
                                    style="border:1px solid gray"></x-textarea>
                      </flexbox-item>
                      <flexbox-item>
                        <div style="color:lightgray;font-size:9px;">你编辑的内容每获得一个赞，你就得到一个牛粪的奖励</div>
                        <x-button type="primary" class="saveBtn"
                                  @click.native="saveSentenceDiyItem(i)">保存
                        </x-button>
                      </flexbox-item>
                    </flexbox>
                  </div>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>

      <div id="infoTabs"
           style="float: left; clear: both; width: 100%; min-height: 500px; margin-top: 24px">
        <tab :line-width="3" :animate="false">
          <tab-item v-for="tab in tabs" :key="tab.name"
                    @click.native="currTab=tab.name"
                    :selected="currTab==tab.name" style="cursor:pointer;">{{tab.name}}<span
            v-if="tab.name=='形近词'">({{currWord.learningWord.word.similarWords.length}})</span><span
            v-if="tab.name=='近义词'">({{synonymsCount}})</span><span
            v-if="tab.name=='共享笔记'">({{currWord.additionalInfos.length}})</span><span
            v-if="tab.name=='单词报错'">({{currWord.errorReports.length}})</span>
          </tab-item>
        </tab>

        <div class="tabContent" v-show="currTab=='形近词'">

          <div v-for="similarWord in currWord.learningWord.word.similarWords"
               style='padding:3px 5px;margin:5px;'>
            <span style="color:blue;font-weight: bold">{{similarWord.spell}}</span>&nbsp{{similarWord.meaningStr}};
          </div>
        </div>

        <div class="tabContent" v-show="currTab=='近义词'">
          <div id="synonymsItemsArea">
            <ul id="synonymsItems" style="list-style: inside circle;">
              <li v-for="item in currWord.learningWord.word.meaningItems" v-if="item.synonyms.length>0"
                  style='margin-top:0.5em;'><span>{{item.meaning}}</span>
                <div style="margin:4px">
                  <div v-for="synonym in item.synonyms"
                       style='padding:3px 5px;margin:5px;border-radius:3px; background-color:#e3e3e3;display:inline-block;'>
                    {{synonym.spell}}&nbsp;
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="tabContent" v-show="currTab=='共享笔记'">
          <div id="additional">
            <table id="wordAdditionalInfos" style="width:100%">
              <tr v-for="info in currWord.additionalInfos">
                <td v-html="info.content"></td>
                <td>{{info.createdByNickName}}</td>

                <td v-if="info.votedByMe||info.createdBy == getLoggedInUser.userName" style='color:green;'><span
                  style='color:gray;'>赞</span> ({{info.handCount}})&nbsp;
                </td>
                <td v-if="info.votedByMe||info.createdBy == getLoggedInUser.userName" style='color:red;'><span
                  style='color:gray;'>踩</span> ({{info.footCount}})&nbsp;
                </td>

                <td v-if="!info.votedByMe&&info.createdBy != getLoggedInUser.userName" style='color:green;'><a
                  href='javascript:;' @click='handInfo(info.id)'>赞</a>
                  ({{info.handCount}})&nbsp;
                </td>
                <td v-if="!info.votedByMe&&info.createdBy != getLoggedInUser.userName" style='color:red;'><a
                  href='javascript:;' @click='footInfo(info.id)'>踩</a>({{info.footCount}})&nbsp;
                </td>
                <td v-if="info.createdBy == getLoggedInUser.userName"><img src='../assets/delete-black.png'
                                                                           @click='deleteInfo(info.id)'
                                                                           style='margin-left:8px' class='voteIcon'
                                                                           title="删除"
                /></td>
              </tr>
            </table>

            <flexbox orient="horizontal">
              <flexbox-item :span="9">
                <group>
                  <x-textarea v-model="additionalInfo" :max="500" placeholder="请输入笔记内容"
                              style="border:1px solid gray"></x-textarea>

                </group>
              </flexbox-item>
              <flexbox-item>
                <div style="color:lightgray;font-size:9px;">你编辑的内容每获得一个赞，你就得到一个牛粪的奖励</div>
                <x-button type="primary" @click.native="saveAdditionalInfo()">提交</x-button>
              </flexbox-item>
            </flexbox>
          </div>
        </div>

        <div class="tabContent" v-show="currTab=='操作提示'">
          <div>
            <ul style="list-style: inside circle;">
              <li>在键盘上按(S)键，可以让单词再次发音</li>
              <li>在键盘上按(R)键，可以让句子再次发音</li>
              <li>在键盘上按(T)键，可以将当前单词标记为已掌握，不再学习</li>
              <li>在键盘上按(V)键，可以显示/隐藏当前单词的图片</li>
              <li>在键盘上按(F11)键，可进入全屏模式。再按一次(F11)键可退出全屏模式</li>
            </ul>
          </div>
        </div>

        <div class="tabContent" v-show="currTab=='设置'">
          <check-icon :value.sync="getLoggedInUser.autoPlayWord" class="checkIcon">单词自动发音</check-icon>
          <check-icon :value.sync="getLoggedInUser.autoPlaySentence" class="checkIcon">句子自动发音
          </check-icon>
          <check-icon :value.sync="getLoggedInUser.showAnswersDirectly" class="checkIcon">自动显示备选答案
          </check-icon>
          <x-button type="primary" @click.native="saveUserConfig()" style="width:100px;">保存</x-button>
        </div>

        <div class="tabContent" v-show="currTab=='单词报错'">
          <div>
            <table id="errorReports" style="width: 100%;">
              <tr v-if="currWord.errorReports.length>0">
                <th>报错内容</th>
                <th>报错人</th>
                <th>已修正？</th>
              </tr>
              <tr v-for="errorReport in currWord.errorReports">
                <td v-html="errorReport.content"></td>
                <td>{{errorReport.createdByNickName}}</td>
                <td><img v-if="errorReport.fixed" height=24
                  width=24
                  src='style/images/correct.png'/>
                </td>
              </tr>
            </table>

            <flexbox orient="horizontal" style="margin-top: 0.5em;">
              <flexbox-item :span="10">
                <group>
                  <x-textarea v-model="errorReport" :max="500" placeholder="请输入报错内容"
                              style="border:1px solid gray"></x-textarea>
                </group>
              </flexbox-item>
              <flexbox-item>
                <x-button type="primary" @click.native="saveErrorReport()">提交</x-button>
              </flexbox-item>
            </flexbox>
          </div>
        </div>
      </div>
    </div>

    <!--单词用法的英文讲解-->
    <div id="englishHint" v-show="currWord.learningWord.word.shortDesc!=null">
      <Highlight :text="currWord.learningWord.word.shortDesc" :keyWords="spell"></Highlight>
      <div class="chineseContainer">
        <div v-for="chinese in currWord.shortDescChineses">
          <div style="display:inline-block" v-if="chinese.hasBeenVoted">
            <img src='../assets/hand.png' style='margin-left:8px' class='gray voteIcon'/><span
            class='handCount'>{{chinese.hand}}</span><img
            src='../assets/foot.png' style='margin-left:8px' class='gray voteIcon'/><span
            class='footCount'>{{chinese.foot}}</span>
          </div>
          <div style="display:inline-block" v-if="!chinese.hasBeenVoted">
            <img src='../assets/hand.png' @click='handShortDescChinese(chinese.id)' style='margin-left:8px'
                 class='voteIcon'/><span
            class='handCount'>{{chinese.hand}}</span><img src='../assets//foot.png' style='margin-left:8px'
                                                          class='voteIcon'
                                                          @click='footShortDescChinese(chinese.id)'/><span
            class='footCount'>{{chinese.foot}}</span>
          </div>
          <span style='font-size:14px;color:#777777'>{{chinese.content}}</span>&nbsp;<span
          style='color:#aaaaaa'>({{chinese.author.displayNickName}})</span>
          <img v-if="chinese.author.userName == getLoggedInUser.userName" src='../assets/delete-black.png'
               @click='deleteShortDescChinese(chinese.id)'
               style='margin-left:8px' class='voteIcon' title="删除"/>
        </div>
      </div>

      <x-button v-show="!isEditingChineseForShortDesc&&currWord.learningWord.word.shortDesc"
                @click.native="isEditingChineseForShortDesc=true">我来翻译
      </x-button>

      <flexbox orient="horizontal" v-show="isEditingChineseForShortDesc">
        <flexbox-item>
          <x-textarea :max="200" style="border:1px solid gray"
                      v-model="inputedChineseOfWordShortDesc"></x-textarea>
        </flexbox-item>
        <flexbox-item>
          <div style="color:lightgray;font-size:9px;">你编辑的内容每获得一个赞，你就得到一个牛粪的奖励</div>
          <x-button type="primary" class="saveBtn"
                    @click.native="saveWordShortDescChinese()">保存
          </x-button>
        </flexbox-item>
      </flexbox>
    </div>

    <div v-show="selectedAnswer!=null" id="nextBtn" v-shortkey="['n']" @shortkey="nextBtnClicked()"
         @click="nextBtnClicked()">下一词(N)
    </div>

    <!--单词配图-->
    <div id="wordImagesDiv">
      <div id="wordImageCount">
        <div class="count" v-shortkey="['v']"
             @shortkey="showWordImages=!showWordImages" @click="showWordImages=!showWordImages">
          {{currWord.images.length > 0 ? ((currWord.images.length > 9 ? 9 : currWord.images.length) + '张图片(V)') : '无图片'}}
        </div>
        <span v-show="showWordImages" style="font-size:9px">上传</span>
        <vue-file-upload v-show="showWordImages" ref="vueFileUploader" url="/service/nnbdc-service/uploadWordImg.do"
                         v-bind:events="imgUpload.onUploadEvents" v-bind:filters="imgUpload.uploadFilters"
                         v-bind:request-options="imgUpload.uploadRequestOptions" v-on:onAdd="onAddUploadItem"
                         style="top:-2px">我要上传
        </vue-file-upload>

        <!--上传进度-->
        <div v-for="file in imgUpload.filesToUpload" style="display:inline-block">{{transUploadStatus(file)}}</div>
      </div>

      <div id="wordImages" v-show="showWordImages">
        <div class='wordImage' v-for="image in currWord.images">
          <a href='javascript:;'>
            <div class='author'><br>上传者：<br>{{image.author ? image.author.displayNickName : "牛牛"}}</div>
            <div class='operHint'>
              <img src='../assets/hand.png' class='gray' v-if="image.hasBeenVoted"/>
              <img src='../assets/hand.png' @click='handImage(image.id)' v-if="!image.hasBeenVoted"/>
              <span class='handCount'>{{image.hand}}</span>
              <img src='../assets/foot.png' style='margin-left:24px' class='gray' v-if="image.hasBeenVoted"/>
              <img src='../assets/foot.png' style='margin-left:24px' @click='footImage(image.id)'
                   v-if="!image.hasBeenVoted"/>
              <span class='footCount'>{{image.foot}}</span>
              <img src='../assets/delete-black.png' style='margin-left:24px' @click='deleteImage(image.id)'
                   v-if="image.author.userName == getLoggedInUser.userName || getLoggedInUser.isAdmin"/>
            </div>
            <img style='width:120px;height:120px;' :src="wordImageBaseUrl + '/'+image.imageFile"/>
          </a>
        </div>
      </div>
    </div>

    <div id="review">
      <table id="wordTable" style="TABLE-LAYOUT: fixed; width: 100%;">

      </table>
      <button id="doSpell">拼写(X)</button>
    </div>

  </div>
</template>
<style scoped>
  .gray {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
  }

  .voteIcon {
    position: relative;
    top: 2px;
  }

  #wordImageCount {
    position: relative;
    float: right;
    margin-top: 32px;
    width: 28%;
    margin-right: 14.5%;
    border: solid 1px #E3E3E3;
    padding: 0 8px;
    cursor: pointer
  }

  #wordImageCount .count {
    display: inline-block;
    width: 60%;
    padding: 8px
  }

  #wordImageCount #uploadImgBtn {
    width: 30%;
    display: inline-block;
    margin: 0 ! important
  }

  #uploadImgBtn-queue {
    margin: 0 ! important
  }

  #wordImages {
    position: relative;
    float: right;
    margin-top: 0;
    width: 28%;
    margin-right: 14.5%;
    border: solid 1px #E3E3E3;
    border-top: none;
    padding: 8px
  }

  .selectedWordImage {
    border: 1px solid #000;
    background-color: #7777ff ! important;
    text-decoration: none;
    color: #000
  }

  .selectedWordImage div.author {
    display: inline-block;
    position: absolute;
    width: 120px;
    height: 120px;
    background-color: gray;
    top: 0;
    color: yellow;
    text-align: center;
    filter: alpha(opacity=60);
    -moz-opacity: .6;
    opacity: .6;
    -khtml-opacity: .6
  }

  .selectedWordImage div.operHint {
    color: #FFF;
    display: inline-block;
    background-color: #7777ff;
    width: 124px;
    position: absolute;
    bottom: 0;
    left: 0;
    line-height: 20px
  }

  .selectedWordImage div.operHint img {
    height: 16px;
    width: 16px;
    margin-top: 4px
  }

  .wordImage {
    width: 124px;
    height: 124px;
    position: relative;
    float: left
  }

  .wordImage a {
    border: 1px solid #F0F0E8;
    background-color: #FFF;
    padding: 1px;
    display: block;
    color: #000
  }

  .wordImage a .bookName {
    display: block;
    color: #000;
    width: 100px;
    position: absolute;
    top: 16px;
    left: 16;
    line-height: 20px;
    background-color: transparent ! important;
    font-size: 14px
  }

  .wordImage a .wordCountDesc {
    position: absolute;
    right: 32px;
    bottom: 40px;
    background-color: transparent ! important
  }

  .wordImage a .wordCountDesc .wordCount {
    color: blue;
    margin-right: 8px;
    background-color: transparent ! important
  }

  .wordImage a div.author {
    display: none
  }

  .wordImage a div.operHint {
    display: none;
    text-align: center;
    font-size: 12px;
    background-color: #7777ff ! important;
    color: #fff ! important
  }

  .wordImage a img {
    width: 120px;
    height: 120px
  }

  .wordImage a:hover {
    border: 1px solid #000;
    background-color: #7777ff ! important;
    text-decoration: none;
    color: #000
  }

  .wordImage a:hover div.author {
    display: inline-block;
    position: absolute;
    width: 120px;
    height: 120px;
    background-color: gray;
    top: 0;
    color: #fff;
    text-align: center;
    filter: alpha(opacity=60);
    -moz-opacity: .6;
    opacity: .6;
    -khtml-opacity: .6
  }

  .wordImage a:hover div.operHint {
    color: #FFF;
    display: inline-block;
    background-color: #7777ff;
    width: 124px;
    position: absolute;
    bottom: 0;
    left: 0;
    line-height: 20px
  }

  .wordImage a:hover div.operHint img {
    height: 16px;
    width: 16px;
    margin-top: 4px
  }

  .answerSearch:hover {
    background-color: #2ecc71;
  }

  #englishHint {
    float: right;
    margin-top: 16px;
    width: 28%;
    margin-right: 14.5%;
    font-size: 17.6px;
    line-height: 26.4px;
    font-family: "Open Sans"
  }

  #wordImagesDiv {
    margin-left: 16px;
  }

  .removeBtn {
    position: relative;
    top: 8px;
  }

  .spellDefault {
    color: blue;
    font-size: 24px;
    font-weight: bold;
  }

  .spellCorrect {
    color: limegreen;
    font-size: 24px;
    font-weight: bold;
  }

  .spellWrong {
    color: red;
    font-size: 24px;
    font-weight: bold;
  }

  .tabContent {
    padding: 8px;
  }

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
    user-select: none;
  }

  #nextBtn:hover {
    background-color: #4BB786;
  }

  .checkIcon {
    margin: 4px 0;
    display: block;
  }

  .shadow {
    -moz-box-shadow: 1px 1px 2px 2px #dddddd;
    -webkit-box-shadow: 1px 1px 2px 2px #dddddd;
    box-shadow: 1px 1px 2px 2px #dddddd;
    -ms-filter: "progid:DXImageTransform.Microsoft.Shadow(Strength=4, Direction=135, Color='#000000)"
  }

  #infoTabs {
    border: solid 1px #1F1F1F;
  }

  table {
    border-collapse: collapse;
    border: none;
  }

  td, th {
    border: solid #cccccc;
    border-width: 1px 1px 1px 1px;
    padding: 8px;
  }

  th {
    background-color: #eee;
  }

  tr:hover {
    background-color: lightblue
  }

  table.answers td.no {
    padding: 8px;
    width: 12px;
  }

  table.answers td.answer {
    padding: 8px;
  }

  .answerBtn {
    text-align: left;
    font-weight: normal;
    word-wrap: break-word;
    white-space: normal;
    cursor: pointer;
    user-select: none;
  }

  div#answerdiv {
    margin-top: 2px;
  }

  ol.answers {
    list-style-type: upper-alpha;
    list-style-position: outside;
  }

  .sentencesDiv {
    margin-left: 3%;
  }

  ol.sentences {
    list-style-type: decimal;
    list-style-position: inside;
  }

  .sentence {
    margin-top: 5px;
    display: inline;
    margin-left: 8px;
  }

  .sentence div {
    margin-bottom: 4px;
  }

  .meaning {
    margin-bottom: 5px;
    margin-left: 3%;
  }

  .speaker {
    position: relative;
    top: 8px;
    height: 24px;
    width: 24px;
    cursor: pointer;
  }

  .video {
    position: relative;
  }

  .video .play {
    display: inline-block;
    position: relative;
  }

  .video .playicon {
    cursor: pointer;
    position: absolute;
    width: 30px;
    height: 30px;
    top: 50%;
    left: 50%;
    margin-left: -15px;
    margin-top: -15px
  }

  div.spell {
    clear: both;
    padding-top: 8px;
  }

  .highlightDiv {
    background-color: lightblue;
  }

  #cigenHintLabel {
    color: blue;
    margin-top: 0.6em;
  }

  .cigen {
    font-style: italic;
  }

  .cigenExplain {

  }

  .textInput {
    font-size: 18px !important;
    text-align: left;
    border: none;
    background-color: transparent;
    font-weight: bold;
    width: 100%;
    height: 100%;
    padding: 0px 8px;
  }

  #verbTenses {
    color: #777777;
    font-size: 13px;
    margin-top: 8px;
  }

  #verbTenses .tense {
    margin-right: 16px;
  }

  #spellPractise input {
    font-size: 16px;
    padding: 4px 8px;
    font-weight: bold;
    background: transparent;
    border: solid 1px #999999;
  }

  .answerSearch {
    width: 16px;
    cursor: pointer;
  }

  .chinese {
    font-size: 0.95em;
    color: gray;
  }

  @media only screen and (max-width: 650px) {
    #wordArea {

    }

    #todayProgress {
      position: relative;
      height: 2.2em;
      width: 100%;
    }

    #review {
      display: none;
      clear: both;
      width: 100%;
      margin-top: 1em;
    }
  }

  @media only screen and (min-width: 651px) {
    #wordArea {
      width: 38%;
      height: 100%;
      margin-left: 15%;
      margin-top: 10px;
      background-color: white;
      padding: 0px 20px 8px 20px;
    }

    #todayProgress {
      position: relative;
      height: 2.2em;
      width: 70%;
      margin-left: 15%;
      margin-top: 1em;
      background-color: #F9F9F9;
    }

    #review {
      display: none;
      clear: both;
      width: 70%;
      margin-left: 15%;
      margin-top: 1em;
    }
  }
</style>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import VueFileUpload from 'vue-file-upload'
  import { Group, Tab, TabItem, XButton, Flexbox, FlexboxItem, XInput, CheckIcon, XTextarea } from 'vux'
  import api from './api'
  import BrowserTooOldForAudio from '../components/BrowserTooOldForAudio.vue'
  import Highlight from '../components/Highlight.vue'
  import config from '../config'

  export default {
    components: {
      Group,
      Tab,
      TabItem,
      XButton,
      Flexbox,
      FlexboxItem,
      BrowserTooOldForAudio,
      XInput,
      Highlight,
      CheckIcon,
      XTextarea,
      VueFileUpload
    },
    data () {
      return {
        fromPage: this.$route.query.fromPage,
        imgUpload: {
          filesToUpload: [],
          uploadFilters: [
            {
              name: 'imageFilter',
              fn (file) {
                var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|'
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1
              }
            }
          ],
          onUploadEvents: {
            onCompleteUpload: (file, response, status, header) => {
              this.imgUpload.filesToUpload = []
              this.getWordImages()
            },
            onAddFileSuccess: (event) => {
              this.$set(this.imgUpload.uploadRequestOptions.formData, 'word', this.wordId)
              this.$refs.vueFileUploader.uploadAll()
            }
          },
          uploadRequestOptions: {
            formData: {
              word: ''
            },
            responseType: 'json',
            withCredentials: false
          }
        },
        showWordImages: false,
        isWordMastered: false,
        shortDescChineses: [],
        currWord: {
          images: [],
          progress: [],
          learningWord: {word: {spell: '', shortDesc: '', meaningItems: [], similarWords: []}},
          sentences: [{id: -1, english: '', sentenceDiyItems: [], isEditingDiyItem: false}],
          cigens: [],
          verbTenses: [],
          errorReports: [],
          otherWords: [{}, {}],
          additionalInfos: [],
          learningMode: -1 // 学习模式，0-句子 1-拼写 2-发音
        },
        soundsToPlay: [],
        isAnswerDivVisible: false,
        correctIndex: null,
        selectedAnswer: null,
        tabs: [{name: '形近词'}, {name: '近义词'}, {name: '共享笔记'}, {name: '设置'}, {name: '单词报错'}, {name: '操作提示'}],
        currTab: '形近词',
        additionalInfo: null,
        errorReport: null,
        isEditingChineseForShortDesc: false,
        wordImageBaseUrl: config.wordImageBaseUrl,
        inputedChineseOfWordShortDesc: '', // 用户输入的英文短描述中文释义
        inputedSpell: '' // 拼写练习输入框里输入的内容
      }
    },
    computed: {
      synonymsCount () {
        let count = 0
        for (let i = 0; i < this.currWord.learningWord.word.meaningItems.length; i++) {
          let meaningItem = this.currWord.learningWord.word.meaningItems[i]
          for (let j = 0; j < meaningItem.synonyms.length; j++) {
            count++
          }
        }
        return count
      },
      spell () {
        return this.currWord.learningWord.word.spell
      },
      wordId () {
        return this.currWord.learningWord.word.id
      },
      ...mapGetters([
        'getLoggedInUser'
      ]),
      nextStudyDay () {
        var nextDay = 0
        if (this.currWord.learningWord.lifeValue === 5) {
          nextDay = 1
        } else if (this.currWord.learningWord.lifeValue === 4) {
          nextDay = 2
        } else if (this.currWord.learningWord.lifeValue === 3) {
          nextDay = 3
        } else if (this.currWord.learningWord.lifeValue === 2) {
          nextDay = 8
        }
        return nextDay
      },
      firstSentenceSoundFile () {
        if (this.currWord.sentences.length === 0 || this.currWord.sentences[0].englishDigest == null) {
          return null
        } else {
          return this.sentenceSoundFile(this.currWord.sentences[0])
        }
      },
      wordSoundFile () {
        if (this.currWord.soundPath) {
          return config.soundBaseUrl + '/' + this.currWord.soundPath + '.mp3'
        } else {
          return null
        }
      },
      isAnswerCorrect () {
        return this.currWord.learningWord.lifeValue === 0 || // 该单词已标记为"已掌握"
          this.selectedAnswer === this.correctIndex || // 选择了正确答案
          this.studyAgainSelected // 再学学
      },
      studyAgainSelected () {
        return this.selectedAnswer === 5
      },
      isSentenceMode () { // 根据句子学习模式
        return this.currWord.learningMode === 0
      },
      isSpellMode () { // 根据拼写学习模式
        return this.currWord.learningMode === 1
      },
      isPronounceMode () { // 根据发音学习模式
        return this.currWord.learningMode === 2
      }
    },
    mounted () {
      this.setNavVisible(true)
      this.setCurrMenuItem('学习')
      this.continueAtTheLastBreakPoint()
    },
    methods: {
      showCorrectSpell () {
        this.inputedSpell = this.currWord.learningWord.word.spell
        this.playSounds([this.$refs.wordSound])
      },
      checkSpell (event, expectedSpell) {
        if (this.inputedSpell.toLowerCase() === expectedSpell.toLowerCase()) { // 拼写正确了
          this.playSounds([this.$refs.wordSound])
        }
      },
      getSentenceByIndex (sentenceIndex) {
        return this.currWord.sentences[sentenceIndex]
      },
      handSentenceDiyItem (diyItemId, sentenceIndex) {
        api.handSentenceDiyItem(diyItemId).then((res) => {
          if (res.data.success) {
            this.refreshSentence(sentenceIndex)
          } else {
            this.warn(res.data.msg)
          }
        })
      },
      footSentenceDiyItem (diyItemId, sentenceIndex) {
        api.footSentenceDiyItem(diyItemId).then((res) => {
          if (res.data.success) {
            this.refreshSentence(sentenceIndex)
          } else {
            this.warn(res.data.msg)
          }
        })
      },
      deleteSentenceDiyItem (diyItemId, sentenceIndex) {
        api.deleteSentenceDiyItem(diyItemId).then((res) => {
          if (res.data.success) {
            this.refreshSentence(sentenceIndex)
          } else {
            this.warn(res.data.msg)
          }
        })
      },
      showSentenceDiyItemEditor (sentenceIndex) {
        let sentence = this.getSentenceByIndex(sentenceIndex)
        sentence.isEditingDiyItem = true
        this.$set(this.currWord.sentences, sentenceIndex, sentence)
      },
      saveSentenceDiyItem (sentenceIndex) {
        let sentence = this.getSentenceByIndex(sentenceIndex)
        if (!sentence.diyItemContent) {
          alert('内容不能为空')
          return
        }

        api.saveSentenceDiyItem(sentence.id, sentence.diyItemContent).then((res) => {
          if (res.data.success) {
            this.refreshSentence(sentenceIndex)
          } else {
            this.warn(res.data.msg)
          }
        })
      },
      refreshSentence (sentenceIndex) {
        let sentence = this.getSentenceByIndex(sentenceIndex)
        api.getSentenceById(sentence.id).then((res) => {
          sentence = res.data
          sentence.isEditingDiyItem = false
          sentence.diyItemContent = ''
          this.$set(this.currWord.sentences, sentenceIndex, sentence)
        })
      },
      sentenceSoundFile (sentence) {
        return sentence.soundFileExists ? (config.soundBaseUrl + '/sentence/' + sentence.englishDigest + '.mp3') : null
      },
      deleteImage (imageId) {
        api.deleteImage(imageId).then((res) => {
          this.getWordImages()
        })
      },
      transUploadStatus (file) {
        if (file.isSuccess) {
          return '上传成功'
        } else if (file.isError) {
          return '上传失败'
        } else if (file.isUploading) {
          return '正在上传...'
        } else {
          return '待上传'
        }
      },
      onAddUploadItem (files) {
        this.imgUpload.filesToUpload = files
      },
      footShortDescChinese (chineseId) {
        api.footShortDescChinese(chineseId).then((res) => {
          this.getShortDescChinesesOfWord()
        })
      },
      deleteShortDescChinese (chineseId) {
        api.deleteShortDescChinese(chineseId).then((res) => {
          this.getShortDescChinesesOfWord()
        })
      },
      handShortDescChinese (chineseId) {
        api.handShortDescChinese(chineseId).then((res) => {
          this.getShortDescChinesesOfWord()
        })
      },
      handImage (imageId) {
        api.handImage(imageId).then((res) => {
          this.getWordImages()
        })
      },
      footImage (imageId) {
        api.footImage(imageId).then((res) => {
          this.getWordImages()
        })
      },
      getWordImages () {
        api.getWordImages(this.wordId).then((res) => {
          this.currWord.images = res.data
        })
      },
      getShortDescChinesesOfWord () {
        api.getShortDescChinesesOfWord(this.wordId).then((res) => {
          this.currWord.shortDescChineses = res.data
        })
      },
      saveWordShortDescChinese () {
        api.saveWordShortDescChinese(this.wordId, this.inputedChineseOfWordShortDesc).then((res) => {
          this.getShortDescChinesesOfWord()
          this.isEditingChineseForShortDesc = false
        })
      },
      answerSearch (spell, event) {
        this.$emit('popWordDetailWindow', spell, event)
      },
      handInfo (infoId) {
        api.handInfo(infoId).then((res) => {
          if (res.data.success) {
            this.refreshAdditionalInfos()
          } else {
            this.warn(res.data.msg)
          }
        })
      },
      footInfo (infoId) {
        api.footInfo(infoId).then((res) => {
          if (res.data.success) {
            this.refreshAdditionalInfos()
          } else {
            this.warn(res.data.msg)
          }
        })
      },
      deleteInfo (infoId) {
        api.deleteInfo(infoId).then((res) => {
          if (res.data.success) {
            this.refreshAdditionalInfos()
          } else {
            this.warn(res.data.msg)
          }
        })
      },
      findAdditionalInfoById (id) {
        for (let i = 0; i < this.currWord.additionalInfos.length; i++) {
          let info = this.currWord.additionalInfos[i]
          if (info.id === id) {
            return info
          }
        }
        return null
      },
      nextBtnClicked () {
        if (this.selectedAnswer != null) {
          this.loadAWord()
        }
      },
      markWordAsMastered () {
        this.isWordMastered = true
        this.isAnswerCorrect = true
        this.loadAWord()
      },
      saveErrorReport () {
        api.saveErrorReport(this.spell, this.errorReport.replace(/\n/g, '<br>')).then((res) => {
          if (res.data.success) {
            var report = {}
            report.id = res.data.msg
            report.word = this.spell
            report.content = res.data.data
            report.createdBy = this.getLoggedInUser.userName
            report.createdByNickName = this.getLoggedInUser.displayNickName
            this.currWord.errorReports.push(report)
            this.errorReport = null // 清空输入框
          } else {
            this.warn(res.data.msg)
          }
        })
      },
      refreshAdditionalInfos () {
        api.getAdditionalInfosOfWord(this.spell).then((res) => {
          this.currWord.additionalInfos = res.data
        })
      },
      saveAdditionalInfo () {
        let content = this.additionalInfo ? this.additionalInfo : ''
        api.addWordAdditionalInfo(this.wordId, content.replace(/\n/g, '<br>')).then((res) => {
          if (res.data.success) {
            this.refreshAdditionalInfos()
            this.additionalInfo = null // 清空输入框
          } else {
            this.warn(res.data.msg)
          }
        })
      },
      ...mapActions([
        'setNavVisible',
        'setCurrMenuItem'
      ]),
      continueAtTheLastBreakPoint () {
        api.continueAtTheLastBreakPoint().then((res) => {
          this.loadAWord()
        })
      },
      loadAWord () {
        this.isEditingChineseForShortDesc = false
        this.showWordImages = false
        this.inputedSpell = ''
        let shouldEnterNextStage = false
        if (this.fromPage === 'stageReview') {
          shouldEnterNextStage = true
          this.fromPage = null
        }
        api.getNextWord(this.isAnswerCorrect, this.isWordMastered, shouldEnterNextStage).then((res) => {
          let result = res.data
          this.currWord = result
          this.selectedAnswer = null
          if (result.finished) {
            this.$router.push({path: '/finish', query: {}})
            return
          } else if (result.noWord) {
            this.warn('没有单词可供学习，请先选择单词书！')
            this.$router.push({path: '/selectDict', query: {}})
            return
          } else if (result.shouldEnterReviewMode) {
            this.$router.push({path: '/stageReview', query: {}})
            return
          }

          // 如果单词已经标记为掌握，跳过这个单词
          if (this.currWord.learningWord.lifeValue === 0) {
            this.loadAWord()
            return
          }

          // 为正确答案随机选择一个索引号（1～3）
          let correctIndex = Math.ceil((3.0 * Math.random()))
          if (correctIndex === 0) {
            correctIndex = 1
          }
          if (correctIndex === 4) {
            correctIndex = 3
          }
          this.correctIndex = correctIndex

          // 决定是否自动显示备选答案
          this.isAnswerDivVisible = this.getLoggedInUser.showAnswersDirectly

          // 单词和句子自动发音
          this.$nextTick(() => { // 由于播放声音依赖于DOM(Audio标签)，所以需要等到DOM刷新后才调用
            // 自动单词发音
            let sounds = []
            if (this.getLoggedInUser.autoPlayWord || this.isPronounceMode) {
              sounds.push(this.$refs.wordSound)
            }

            // 自动句子发音
            if (this.getLoggedInUser.autoPlaySentence && this.isSentenceMode) {
              if (this.$refs.sentenceSound) {
                sounds.push(this.$refs.sentenceSound)
              }
            }
            this.playSounds(sounds)
          })
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
      },
      onSoundEnded () {
        // 移除刚刚播放完成的音频
        this.soundsToPlay.splice(0, 1)

        // 播放下一个音频
        if (this.soundsToPlay.length > 0) {
          this.soundsToPlay[0].play()
        }
      },
      answerBtnClicked (btnIndex) {
        // 由于此函数可以通过快捷键进入，所以需要判断备选答案是否处于可见状态，只有处于可见状态时才进行相应的操作
        if (btnIndex >= 1 && btnIndex <= 3 && !this.isAnswerDivVisible) {
          return
        }

        this.selectedAnswer = btnIndex
        if (this.isAnswerCorrect && !this.studyAgainSelected) {
          this.loadAWord()
        }
      },
      saveUserConfig () {
        let user = this.getLoggedInUser
        api.saveUserConfig(user.autoPlayWord, user.autoPlaySentence, user.showAnswersDirectly).then((res) => {
          if (res.data.success) {
            this.info('保存成功')
          } else {
            this.warn(res.data.msg)
          }
        })
      },
      toggleAnswerDiv () {
        this.isAnswerDivVisible = !this.isAnswerDivVisible
      }
    }
  }
</script>
