/*
 * @name 音准对应得频率
 * @ext C:D = 8:9, D:E = 9:10, E:F = 15:16, F:G = 8:9 ... 三三循环
 */
var sound = {
  'do': 440,
  're': 493.88,
  'mi': 554.37,
  'fa': 587.33,
  'so': 659.33,
  'la': 739.99,
  'xi': 830.61,
}

/*
 * @name Piano类
 */
class Piano {
  constructor (options) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    // 创建音频上下文
    this.audioCtx = new AudioContext()
    this.sound = sound
  }
  /*
   * @name 检测浏览器是否支持AudioContext
   * @return { Boolean } ture -> 支持, false -> 不支持
   */
  check () {
    if (window.AudioContext) {
      return true
    } else {
      return false
    }
  }
  /*
   * @name 给键盘上的对应键绑定特定得声音
   * @param { String } key -> 键盘上的键
   * @param { String } sound -> 声音
   */
  add (key, sound) {
    var that = this
    document.body.addEventListener('keydown', function (event) {
      if (event.key != key) {
        return false
      }
      // 创建(音调)
      var oscillator = that.audioCtx.createOscillator()
      // 创建音量
      var gainNode = that.audioCtx.createGain()
      // 关联节点
      oscillator.connect(gainNode)
      gainNode.connect(that.audioCtx.destination)
      // 指定音调得类型 square | triangle | sawtoothkk | sine
      oscillator.type = 'sine'
      // 设置当前播放得频率
      oscillator.frequency.value = that.sound[sound]
      // 当前时间设置音量为0
      gainNode.gain.setValueAtTime(0, that.audioCtx.currentTime)
      // 0.01秒音量为1
      gainNode.gain.linearRampToValueAtTime(1, that.audioCtx.currentTime + 0.02)
      // 音调从当前时间开始播放
      oscillator.start(that.audioCtx.currentTime)
      // 1秒内声音降低
      gainNode.gain.exponentialRampToValueAtTime(0.001, that.audioCtx.currentTime + 0.01)
      // 1秒后完全停止声音
      oscillator.stop(that.audioCtx.currentTime + 1)
    })
  }
}

var piano = new Piano()
piano.add('a', 'do')
piano.add('s', 're')
piano.add('d', 'mi')
piano.add('f', 'fa')
piano.add('g', 'so')
piano.add('h', 'la')
piano.add('j', 'xi')
piano.add('f', 'fa')

