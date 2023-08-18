new Vue({
  el: '#app',
  data: {
    // 呼吸回数カウント
    isCounting: false,
    breathCount: 0,
    timeLeft: 15,
    timer: null,
    buttonLabel: 'スタート',
    // 息止め時間測定
    isPreparing: false,
    isMeasuring: false,
    holdTime: null,
    startTime: null,
		// 呼吸法ジェネレータ―
    breathRate: '',
    breathHoldTime: '',
    selectedPurpose: 'relax',
    breathingPattern: null,
    errorMessage: '',
    
    showPopup: false, // ポップアップ表示フラグ
    closedPopup: false // ポップアップが既に閉じられたかどうかのフラグ
  },
  created() {
    // スクロールイベントを監視
    window.addEventListener('scroll', this.checkScroll);
  },
  beforeDestroy() {
    // イベントリスナーを削除
    window.removeEventListener('scroll', this.checkScroll);
  },
  methods: {
    // 呼吸回数カウント
    startCounting() {
      this.isCounting = true;
      this.breathCount = 0;
      this.timeLeft = 15;
      this.timer = setInterval(this.updateTimer, 1000);
    },
    updateTimer() {
      this.timeLeft--;
      if (this.timeLeft === 0) {
        clearInterval(this.timer);
        this.isCounting = false;
        this.breathRate = this.breathCount * 4;
      }
    },
    incrementBreathCount() {
      this.breathCount++;
    },
    // 息止め時間測定
    startPreparing() {
      this.isPreparing = true;
      this.isMeasuring = false;
      this.holdTime = null;
    },
    startMeasuring() {
      this.isPreparing = false;
      this.isMeasuring = true;
      this.startTime = new Date().getTime();
    },
    stopMeasuring() {
      this.isMeasuring = false;
      const endTime = new Date().getTime();
      this.holdTime = ((endTime - this.startTime) / 1000).toFixed(2);
      this.breathHoldTime = this.holdTime;
    },
		// 呼吸法ジェネレータ―
		selectPurpose(purpose) {
      this.selectedPurpose = purpose;
    },
		generateBreathingPattern() {
			if (!this.breathRate || !this.breathHoldTime) {
        this.errorMessage = '1分間呼吸回数 または 息止め可能時間 を入力してください。';
        return;
      }
      else {
      	// 入力値が正しい場合、エラーメッセージをクリア
        this.errorMessage = '';
        const breathRatePoints = this.breathRate >= 18 ? 1 : this.breathRate <= 12 ? 3 : 2;
        const breathHoldPoints = this.breathHoldTime < 20 ? 1 : this.breathHoldTime >= 30 ? 3 : 2;
        const totalPoints = breathRatePoints + breathHoldPoints;
        let pattern;
        const patterns = {
          beginner: {
            relax: { name: '周期的なため息呼吸', description:'吸う: 1秒, 吸う: 0.25秒, 吐く: 2秒, 5分間繰り返す'},
            health: { name:  'Box(3s)呼吸法', description:'吸う: 3秒, 息を止める:3秒, 吐く: 3秒, 息を止める:3秒, 5分間繰り返す'},
            exercise: { name:  'パワーブレス', description:'吸う: 3秒, 息を止める: 1秒, 連続で吐く: 5回, 5分間繰り返す'},
            focus: { name:  '4-4-4 呼吸法', description:'吸う: 4秒, 息を止める:4秒, 吐く: 4秒, 5分間繰り返す'},
          },
          general: {
            relax: { name:  '周期的なため息呼吸', description:'吸う: 1秒, 吸う: 0.25秒, 吐く: 2秒, 5分間繰り返す'},
            health: { name:  'Box(4s)呼吸法', description:'吸う: 4秒, 息を止める:4秒, 吐く: 4秒, 息を止める:4秒, 5分間繰り返す'},
            exercise: { name:  'パワーブレス', description:'吸う: 3秒, 息を止める: 1秒, 連続で吐く: 10回, 5分間繰り返す'},
            focus: { name:  '代替鼻孔呼吸法', description:'吸う: 左鼻孔 4秒, 息を止める: 4秒, 吐く: 右鼻孔 4秒, 5分間繰り返す'},
          },
          veteran: {
            relax: { name:  '4-7-8呼吸法', description:'吸う: 4秒, 息を止める: 7秒, 吐く: 8秒'},
            health: { name:  'Box(5s)呼吸法', description:'吸う: 5秒, 息を止める:5秒, 吐く: 5秒, 息を止める:5秒, 5分間繰り返す'},
            exercise: { name:  '周期的な過呼吸', description:'吸う: 2秒, 吐く: 1秒, 30回繰り返し, 息を止める: 15秒, 最初から3回繰り返す'},
            focus: { name:  '片鼻呼吸法', description:'吸う: 左鼻孔 4秒, 息を止める: 4秒, 吐く: 右鼻孔 4秒, 5分間繰り返す'},
          },
        };
        if (totalPoints <= 2) {
          pattern = patterns.beginner[this.selectedPurpose];
        } else if (totalPoints <= 4) {
          pattern = patterns.general[this.selectedPurpose];
        } else {
          pattern = patterns.veteran[this.selectedPurpose];
        }
        this.breathingPattern = pattern;
      }
    },
    checkScroll() {
      // ページの最下部にスクロールしたかを確認
      const scrolledToBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
      // ページの最下部にスクロールして、ポップアップがまだ閉じられていない場合、ポップアップを表示
      if (scrolledToBottom && !this.closedPopup) {
        this.showPopup = true;
        console.log("showPopup:", this.showPopup);
      }
    },
    closePopup() {
      this.showPopup = false;   // ポップアップを非表示に
      this.closedPopup = true;  // ポップアップが閉じられたことを示すフラグをセット
    },
  },
  computed: {
    steps() {
      if (this.breathingPattern) {
        return this.breathingPattern.description.split(',').map((step, index) => `ステップ${index + 1}: ${step.trim()}`);
      }
      return [];
    },
    
  },
});
