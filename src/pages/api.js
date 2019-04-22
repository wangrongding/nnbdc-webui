import Vue from 'vue'
import config from '../config'

export default {
  updateWord (word) {
    return Vue.http.post(config.backendBaseUrl + '/updateWord.do', word, {params: {}})
  },
  updateUserInfo (email, nickName, password, password2) {
    let params = {'email': email, 'nickName': nickName, 'password': password, 'password2': password2}
    return Vue.http.post(config.backendBaseUrl + '/updateUserInfo.do', {emulateJSON: true}, {params: params})
  },
  getGameHallData () {
    return Vue.http.get(config.backendBaseUrl + '/getGameHallData.do', {})
  },
  getUserPaihangDatas () {
    return Vue.http.get(config.backendBaseUrl + '/getUserPaihangData.do', {})
  },
  createForumPost (forumId, postTitle, postContent) {
    let params = {'forumId': forumId, 'postTitle': postTitle, 'postContent': postContent}
    return Vue.http.post(config.backendBaseUrl + '/createForumPost.do', {emulateJSON: true}, {params: params})
  },
  replyForumPost (postId, content) {
    let params = {'postId': postId, 'content': content}
    return Vue.http.post(config.backendBaseUrl + '/replyForumPost.do', {emulateJSON: true}, {params: params})
  },
  getForumPostById (postId) {
    let params = {'postId': postId}
    return Vue.http.get(config.backendBaseUrl + '/getForumPostById.do', {params: params})
  },
  getForumByName (name) {
    let params = {'name': name}
    return Vue.http.get(config.backendBaseUrl + '/getForumByName.do', {params: params})
  },
  getForumPosts (page, rows, sort, order) {
    let params = {'page': page, 'rows': rows, 'sort': sort, 'order': order}
    return Vue.http.get(config.backendBaseUrl + '/getForumPosts.do', {params: params})
  },
  getMsgsByPage (page, rows, msgType, toUser) {
    let params = {'page': page, 'rows': rows, 'msgType': msgType, 'toUser': toUser}
    return Vue.http.get(config.backendBaseUrl + '/getMsgsByPage.do', {params: params})
  },
  dismissStudyGroup (groupId, userId) {
    let params = {'groupId': groupId, 'userId': userId}
    return Vue.http.post(config.backendBaseUrl + '/dismissStudyGroup.do', {emulateJSON: true}, {params: params})
  },
  joinStudyGroup (groupId) {
    let params = {'groupId': groupId}
    return Vue.http.post(config.backendBaseUrl + '/joinStudyGroup.do', {emulateJSON: true}, {params: params})
  },
  exitStudyGroup (groupId, userId) {
    let params = {'groupId': groupId, 'userId': userId}
    return Vue.http.post(config.backendBaseUrl + '/exitStudyGroup.do', {emulateJSON: true}, {params: params})
  },
  replyStudyGroupPost (postId, content) {
    let params = {'postId': postId, 'content': content}
    return Vue.http.post(config.backendBaseUrl + '/replyStudyGroupPost.do', {emulateJSON: true}, {params: params})
  },
  getStudyGroupPostById (postId) {
    let params = {'postId': postId}
    return Vue.http.get(config.backendBaseUrl + '/getStudyGroupPostById.do', {params: params})
  },
  deleteStudyGroupPost (postId) {
    let params = {'postId': postId}
    return Vue.http.post(config.backendBaseUrl + '/deleteStudyGroupPost.do', {emulateJSON: true}, {params: params})
  },
  deleteMsg (msgId) {
    let params = {'msgId': msgId}
    return Vue.http.post(config.backendBaseUrl + '/deleteMsg.do', {emulateJSON: true}, {params: params})
  },
  createStudyGroupPost (groupId, postTitle, postContent) {
    let params = {'groupId': groupId, 'postTitle': postTitle, 'postContent': postContent}
    return Vue.http.post(config.backendBaseUrl + '/createStudyGroupPost.do', {emulateJSON: true}, {params: params})
  },
  editStudyGroup (groupId, groupName, groupTitle, groupRemark) {
    let params = {'groupId': groupId, 'groupName': groupName, 'groupTitle': groupTitle, 'groupRemark': groupRemark}
    return Vue.http.post(config.backendBaseUrl + '/editStudyGroup.do', {emulateJSON: true}, {params: params})
  },
  createStudyGroup (groupName, groupTitle, groupRemark) {
    let params = {'groupName': groupName, 'groupTitle': groupTitle, 'groupRemark': groupRemark}
    return Vue.http.post(config.backendBaseUrl + '/createStudyGroup.do', {emulateJSON: true}, {params: params})
  },
  getStudyGroupById (groupId) {
    let params = {'groupId': groupId}
    return Vue.http.get(config.backendBaseUrl + '/getStudyGroupById.do', {params: params})
  },
  getMyStudyGroups () {
    return Vue.http.get(config.backendBaseUrl + '/getMyStudyGroups.do', {})
  },
  getAllStudyGroups () {
    return Vue.http.get(config.backendBaseUrl + '/getAllStudyGroups.do', {})
  },
  getWordsList () {
    return Vue.http.get(config.frontendBaseUrl + '/words.json', {})
  },
  addRawWord (spell, addManner) {
    let params = {'spell': spell, 'addManner': addManner}
    return Vue.http.post(config.backendBaseUrl + '/addRawWord.do', {emulateJSON: true}, {params: params})
  },
  getRawWordsForAPage (pageNo, pageSize) {
    let params = {'pageNo': pageNo, 'pageSize': pageSize}
    return Vue.http.get(config.backendBaseUrl + '/getRawWordsForAPage.do', {params: params})
  },
  getDictWordsForAPage (dictId, pageNo, pageSize) {
    let params = {'dictId': dictId, 'pageNo': pageNo, 'pageSize': pageSize}
    return Vue.http.get(config.backendBaseUrl + '/getDictWordsForAPage.do', {params: params})
  },
  throwDiceAndSave () {
    return Vue.http.post(config.backendBaseUrl + '/throwDiceAndSave.do', {emulateJSON: true}, {})
  },
  saveDakaRecord () {
    let params = {'text': '好好学习，天天向上'}
    return Vue.http.post(config.backendBaseUrl + '/saveDakaRecord.do', {emulateJSON: true}, {params: params})
  },
  getAnswerWrongWords () {
    return Vue.http.get(config.backendBaseUrl + '/getAnswerWrongWords.do', {})
  },
  getReviewWords () {
    return Vue.http.get(config.backendBaseUrl + '/getCurrentStageCache.do', {})
  },
  handShortDescChinese (chineseId) {
    let params = {'id': chineseId}
    return Vue.http.post(config.backendBaseUrl + '/handShortDescChinese.do', {emulateJSON: true}, {params: params})
  },
  footShortDescChinese (chineseId) {
    let params = {'id': chineseId}
    return Vue.http.post(config.backendBaseUrl + '/footShortDescChinese.do', {emulateJSON: true}, {params: params})
  },
  deleteShortDescChinese (chineseId) {
    let params = {'id': chineseId}
    return Vue.http.post(config.backendBaseUrl + '/deleteShortDescChinese.do', {emulateJSON: true}, {params: params})
  },
  getWordImages (wordId) {
    let params = {'wordId': wordId}
    return Vue.http.get(config.backendBaseUrl + '/getWordImages.do', {params: params})
  },
  deleteImage (imageId) {
    let params = {'id': imageId}
    return Vue.http.post(config.backendBaseUrl + '/deleteImage.do', {emulateJSON: true}, {params: params})
  },
  handImage (imageId) {
    let params = {'id': imageId}
    return Vue.http.post(config.backendBaseUrl + '/handImage.do', {emulateJSON: true}, {params: params})
  },
  footImage (imageId) {
    let params = {'id': imageId}
    return Vue.http.post(config.backendBaseUrl + '/footImage.do', {emulateJSON: true}, {params: params})
  },
  importFromDict (fromDictId, toDictId) {
    let params = {'fromDictId': fromDictId, 'toDictId': toDictId}
    return Vue.http.post(config.backendBaseUrl + '/importFromDict.do', {emulateJSON: true}, {params: params})
  },
  getAllSysDicts () {
    return Vue.http.get('/getAllSysDicts.do', {})
  },
  getShortDescChinesesOfWord (wordId) {
    let params = {'wordId': wordId}
    return Vue.http.get(config.backendBaseUrl + '/getShortDescChinesesOfWord.do', {params: params})
  },
  addWordToDict (dictId, wordId) {
    let params = {'dictId': dictId, 'wordId': wordId}
    return Vue.http.post(config.backendBaseUrl + '/addWordToDict.do', {emulateJSON: true}, {params: params})
  },
  saveWordShortDescChinese (wordId, chinese) {
    let params = {'wordId': wordId, 'chinese': chinese}
    return Vue.http.post(config.backendBaseUrl + '/saveWordShortDescChinese.do', {emulateJSON: true}, {params: params})
  },
  removeWordFromDict (dictId, wordId) {
    let params = {'wordId': wordId, 'dictId': dictId}
    return Vue.http.post(config.backendBaseUrl + '/removeWordFromDict.do', {emulateJSON: true}, {params: params})
  },
  searchWord (spell) {
    let params = {'word': spell}
    return Vue.http.get(config.backendBaseUrl + '/searchWord.do', {params: params})
  },
  handInfo (infoId) {
    let params = {'infoID': infoId, 'voteType': 'hand'}
    return Vue.http.post(config.backendBaseUrl + '/voteInfo.do', {emulateJSON: true}, {params: params})
  },
  footInfo (infoId) {
    let params = {'infoID': infoId, 'voteType': 'foot'}
    return Vue.http.post(config.backendBaseUrl + '/voteInfo.do', {emulateJSON: true}, {params: params})
  },
  deleteInfo (infoId) {
    return Vue.http.post(config.backendBaseUrl + '/deleteInfo.do', {emulateJSON: true}, {params: {infoId: infoId}})
  },
  saveErrorReport (spell, content) {
    let params = {'word': spell, 'content': content}
    return Vue.http.post(config.backendBaseUrl + '/saveErrorReport.do', {emulateJSON: true}, {params: params})
  },
  addWordAdditionalInfo (wordId, content) {
    let params = {'wordId': wordId, 'content': content}
    return Vue.http.post(config.backendBaseUrl + '/addWordAdditionalInfo.do', {emulateJSON: true}, {params: params})
  },
  getLastUpdateLog: function () {
    return Vue.http.get(config.backendBaseUrl + '/getLastUpdateLog.do', {})
  },
  login: function (email, password) {
    let params = {'email': email, 'password': password, 'loginType': 'EMAIL'}
    return Vue.http.post(config.backendBaseUrl + '/login.do', {emulateJSON: true}, {params: params})
  },
  fastTry: function () {
    let params = {'userName': 'guest', 'password': '', 'loginType': 'USER_NAME'}
    return Vue.http.post(config.backendBaseUrl + '/login.do', {emulateJSON: true}, {params: params})
  },
  logout: function () {
    return Vue.http.post(config.backendBaseUrl + '/logout.do', {emulateJSON: true}, {params: null})
  },
  register: function (email, password, password2, nickName) {
    let params = {'email': email, 'password': password, 'password2': password2, 'nickName': nickName}
    return Vue.http.post(config.backendBaseUrl + '/register.do', {emulateJSON: true}, {params: params})
  },
  getStudyProgress: function () {
    return Vue.http.get(config.backendBaseUrl + '/getStudyProgress.do', {})
  },
  getSnapshotDailys: function () {
    return Vue.http.get(config.backendBaseUrl + '/getUserSnapshotDailys.do', {})
  },
  getPwd: function (email) {
    let params = {'email': email}
    return Vue.http.get(config.backendBaseUrl + '/getPwd.do', {params: params})
  },
  getLoggedInUser: function () {
    return Vue.http.get(config.backendBaseUrl + '/getLoggedInUser.do', {})
  },
  privilegeSelectedDict: function (dictName) {
    let params = {'dictName': dictName}
    return Vue.http.post(config.backendBaseUrl + '/privilegeSelectedDict.do', {emulateJSON: true}, {params: params})
  },
  deleteSelectedDict: function (dictName) {
    let params = {'dictName': dictName}
    return Vue.http.post(config.backendBaseUrl + '/deleteSelectedDict.do', {emulateJSON: true}, {params: params})
  },
  saveWordsPerDay: function (wordsPerday) {
    let params = {'wordsPerDay': wordsPerday}
    return Vue.http.post(config.backendBaseUrl + '/saveWordsPerDay.do', {emulateJSON: true}, {params: params})
  },
  getDictGroups: function () {
    return Vue.http.get(config.backendBaseUrl + '/getDictGroups.do', {})
  },
  getSelectedDicts: function () {
    return Vue.http.get(config.backendBaseUrl + '/getSelectedDicts.do', {})
  },
  getMyDicts: function () {
    return Vue.http.get(config.backendBaseUrl + '/getMyDicts.do', {})
  },
  getWordById: function (wordId) {
    let params = {'id': wordId}
    return Vue.http.get(config.backendBaseUrl + '/getWordById.do', {params: params})
  },
  getAdditionalInfosOfWord: function (spell) {
    return Vue.http.get(config.backendBaseUrl + '/getAdditionalInfosOfWord.do', {params: {spell: spell}})
  },
  getSentenceById: function (sentenceId) {
    let params = {'sentenceId': sentenceId}
    return Vue.http.get(config.backendBaseUrl + '/getSentence.do', {params: params})
  },
  getDictById: function (dictId) {
    let params = {'dictId': dictId}
    return Vue.http.get(config.backendBaseUrl + '/getDictById.do', {params: params})
  },
  getWordBySpell: function (spell) {
    let params = {'spell': spell}
    return Vue.http.get(config.backendBaseUrl + '/getWordBySpell.do', {params: params})
  },
  saveSelectedDicts: function (selectedDicts) {
    let dictIds = []
    for (let i = 0; i < selectedDicts.length; i++) {
      let dict = selectedDicts[i].dict
      dictIds.push(dict.id)
    }
    let params = {'selectedDicts': dictIds}
    return Vue.http.post(config.backendBaseUrl + '/saveConfig.do', {emulateJSON: true}, {params: params})
  },
  prepareForStudy: function () {
    return Vue.http.post(config.backendBaseUrl + '/prepareForStudy.do', {emulateJSON: true}, {})
  },
  continueAtTheLastBreakPoint: function () {
    return Vue.http.post(config.backendBaseUrl + '/continueAtTheLastBreakPoint.do', {emulateJSON: true}, {})
  },
  getNextWord: function (isAnswerCorrect, isWordMastered, shouldEnterNextStage) {
    let params = {
      'isAnswerCorrect': isAnswerCorrect,
      'isWordMastered': isWordMastered,
      'shouldEnterNextStage': shouldEnterNextStage
    }
    return Vue.http.get(config.backendBaseUrl + '/getWords.do', {params: params})
  },
  saveUserConfig: function (autoPlayWord, autoPlaySentence, showAnswersDirectly) {
    let params = {
      'autoPlayWord': autoPlayWord,
      'autoPlaySentence': autoPlaySentence,
      'showAnswersDirectly': showAnswersDirectly
    }
    return Vue.http.post(config.backendBaseUrl + '/saveUserConfig.do', {emulateJSON: true}, {params: params})
  },
  clearWordsOfDict: function (dictId) {
    return Vue.http.post(config.backendBaseUrl + '/clearWordsOfDict.do', {emulateJSON: true}, {params: {dictId: dictId}})
  },
  finishEditingDict: function (dictId) {
    return Vue.http.post(config.backendBaseUrl + '/finishEditingDict.do', {emulateJSON: true}, {params: {dictId: dictId}})
  },
  createNewDict: function (dictName) {
    return Vue.http.post(config.backendBaseUrl + '/createNewDict.do', {emulateJSON: true}, {params: {dictName: dictName}})
  },
  saveSentenceDiyItem: function (sentenceId, chinese) {
    return Vue.http.post(config.backendBaseUrl + '/saveSentenceDiyItem.do',
      {emulateJSON: true}, {params: {sentenceId: sentenceId, chinese: chinese}})
  },
  handSentenceDiyItem: function (diyItemId) {
    return Vue.http.post(config.backendBaseUrl + '/handSentenceDiyItem.do',
      {emulateJSON: true}, {params: {id: diyItemId}})
  },
  footSentenceDiyItem: function (diyItemId) {
    return Vue.http.post(config.backendBaseUrl + '/footSentenceDiyItem.do',
      {emulateJSON: true}, {params: {id: diyItemId}})
  },
  deleteSentenceDiyItem: function (diyItemId) {
    return Vue.http.post(config.backendBaseUrl + '/deleteSentenceDiyItem.do',
      {emulateJSON: true}, {params: {id: diyItemId}})
  },
  replyAdvice: function (content, toUser) {
    return Vue.http.post(config.backendBaseUrl + '/replyAdvice.do',
      {emulateJSON: true}, {params: {content: content, toUser: toUser}})
  },
  getLastestMsgsBetweenTwoUsers: function (user1, user2, msgCount) {
    let params = {
      'user1': user1,
      'user2': user2,
      'msgCount': msgCount
    }
    return Vue.http.get(config.backendBaseUrl + '/getLastestMsgsBetweenTwoUsers.do', {params: params})
  }
}
