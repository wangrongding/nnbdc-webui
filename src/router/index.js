import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/index'
import main from '@/pages/main'
import register from '@/pages/register'
import getPwd from '@/pages/getPwd'
import selectDict from '@/pages/selectDict'
import beforeStudy from '@/pages/beforeStudy'
import bdc from '@/pages/bdc'
import stageReview from '@/pages/stageReview'
import finish from '@/pages/finish'
import rawWord from '@/pages/rawWord'
import studyGroupList from '@/pages/studyGroupList'
import createStudyGroup from '@/pages/createStudyGroup'
import editStudyGroup from '@/pages/editStudyGroup'
import studyGroupInfo from '@/pages/studyGroupInfo'
import studyGroupPostInfo from '@/pages/studyGroupPostInfo'
import createStudyGroupPost from '@/pages/createStudyGroupPost'
import forum from '@/pages/forum'
import forumPostInfo from '@/pages/forumPostInfo'
import createForumPost from '@/pages/createForumPost'
import paihang from '@/pages/paihang'
import gameCenter from '@/pages/gameCenter'
import chat from '@/pages/chat'
import russia from '@/pages/russia'
import wordEdit from '@/pages/wordEdit'
import dictEdit from '@/pages/dictEdit'
import handleAdvice from '@/pages/handleAdvice'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      component: login
    },
    {
      path: '/main',
      name: '主界面',
      component: main
    },
    {
      path: '/register',
      name: '注册',
      component: register
    },
    {
      path: '/getPwd',
      name: '找回密码',
      component: getPwd
    },
    {
      path: '/selectDict',
      name: '选择单词书',
      component: selectDict
    },
    {
      path: '/beforeStudy',
      name: '正式学习前提示',
      component: beforeStudy
    },
    {
      path: '/bdc',
      name: '背单词',
      component: bdc
    },
    {
      path: '/stageReview',
      name: '阶段复习',
      component: stageReview
    },
    {
      path: '/finish',
      name: '学习完成',
      component: finish
    },
    {
      path: '/rawWord',
      name: '生词本',
      component: rawWord
    },
    {
      path: '/studyGroupList',
      name: '学习小组',
      component: studyGroupList
    },
    {
      path: '/createStudyGroup',
      name: '创建学习小组',
      component: createStudyGroup
    },
    {
      path: '/editStudyGroup',
      name: '编辑学习小组',
      component: editStudyGroup
    },
    {
      path: '/studyGroupInfo',
      name: '学习小组详情',
      component: studyGroupInfo
    },
    {
      path: '/studyGroupPostInfo',
      name: '学习帖子详情',
      component: studyGroupPostInfo
    },
    {
      path: '/createStudyGroupPost',
      name: '小组内发帖',
      component: createStudyGroupPost
    },
    {
      path: '/forum',
      name: '论坛',
      component: forum
    },
    {
      path: '/forumPostInfo',
      name: '论坛帖子详情',
      component: forumPostInfo
    },
    {
      path: '/createForumPost',
      name: '创建论坛帖子',
      component: createForumPost
    },
    {
      path: '/paihang',
      name: '排行榜',
      component: paihang
    },
    {
      path: '/gameCenter',
      name: '游戏中心',
      component: gameCenter
    },
    {
      path: '/chat',
      name: '聊天',
      component: chat
    },
    {
      path: '/russia',
      name: '单词俄罗斯',
      component: russia
    },
    {
      path: '/wordEdit',
      name: '单词编辑',
      component: wordEdit
    },
    {
      path: '/handleAdvice',
      name: '意见处理',
      component: handleAdvice
    },
    {
      path: '/dictEdit',
      name: '单词书编辑',
      component: dictEdit
    }
  ]
})
