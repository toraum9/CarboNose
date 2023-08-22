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
            relax: { name:  'コヒーレント呼吸', description:'鼻から5.5秒間息を吸う, 鼻で同じ時間だけ息を吐く, これを10回繰り返す', url:'https://www.frontiersin.org/articles/10.3389/fnhum.2018.00353/full'},
            exercise: { name: '横隔膜呼吸', description:'楽な姿勢で座る, 片方の手を胸に、もう片方の手を腹に当てる, 鼻から2秒間息を吸う, お腹を押しながら、すぼめた口で出来るだけゆっくりと吐く, これを5回繰り返す', url:'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7602530/'},
            focus: { name:  'ブテイコ呼吸', description:'息を吐ききってから鼻をつまんで息を止める, 息を吸いたくなったら鼻から息を吸う, 30秒間いつも通り呼吸して息を整える, これを5回程度繰り返す', url:'https://www.sciencedirect.com/science/article/pii/S0422763812000520'},
          },
          general: {
            relax: { name:  '周期的なため息呼吸', description:'鼻から1~2秒間息を吸う, もう一度息を吸えるだけ吸う, 口から吸った時間以上の時間をかけて息を吐く, これを30回繰り返す', url:'https://www.cell.com/cell-reports-medicine/fulltext/S2666-3791(22)00474-8#'},
            exercise: { name: '横隔膜呼吸', description:'楽な姿勢で座る, 片方の手を胸に、もう片方の手を腹に当てる, 鼻から2秒間息を吸う, お腹を押しながら、すぼめた口で出来るだけゆっくりと吐く, これを5回繰り返す', url:'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7602530/'},
            focus: { name:  '片鼻呼吸法', description:'右鼻を閉じて左鼻で4秒間吸う, 4秒間息を止める, 左鼻を閉じて右鼻で4秒間吐く, 左右を逆にして、これを左右で5回ずつ計10回繰り返す', url:'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8378456/'},
          },
        };
        if (totalPoints <= 5) {
          pattern = patterns.beginner[this.selectedPurpose];
        } else {
          pattern = patterns.general[this.selectedPurpose];
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
        return this.breathingPattern.description.split(',').map((step, index) => `${index + 1}: ${step.trim()}`);
      }
      return [];
    },
    
  },
});
