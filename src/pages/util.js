import config from '../config'

export default {
  formatDate: function (date, format) { // 格式化日期
    var d = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      'S+': date.getMilliseconds()
    }
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + '')
        .substr(4 - RegExp.$1.length))
    }
    for (let k in d) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? d[k]
          : ('00' + d[k]).substr(('' + d[k]).length))
      }
    }
    return format
  },

  // 计算两个日期的时间间隔
  daySpan (start, end) {
    if (start === null || start.length === 0 || end === null || end.length === 0) {
      return 0
    }

    let arr = start.split('-')
    let starttime = new Date(arr[0], parseInt(arr[1] - 1), arr[2])
    let starttimes = starttime.getTime()

    let arrs = end.split('-')
    let endtime = new Date(arrs[0], parseInt(arrs[1] - 1), arrs[2])
    let endtimes = endtime.getTime()

    let intervalTime = endtimes - starttimes // 两个日期相差的毫秒数 一天86400000毫秒
    let interDays = ((intervalTime).toFixed(2) / 86400000)

    return interDays
  },

  containsUser (users, user) {
    for (let i in users) {
      if (users[i].id === user.id) {
        return true
      }
      return false
    }
  },

  wordSoundFile (word) {
    if (word.sound) {
      return config.soundBaseUrl + '/' + word.sound + '.mp3'
    } else {
      return null
    }
  },

  clone (obj) {
    return JSON.parse(JSON.stringify(obj))
  },

  isPhase (spell) {
    return spell.trim().indexOf(' ') !== -1
  }
}
