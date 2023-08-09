new Vue({
  el: '#app',
  data: {
    breathRate: '',
    breathHoldTime: '',
    selectedPurpose: 'relax',
    breathingPattern: null,
    errorMessage: '',
  },
  methods: {
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
    selectPurpose(purpose) {
      this.selectedPurpose = purpose;
    }
  },
  computed: {
    steps() {
      if (this.breathingPattern) {
        return this.breathingPattern.description.split(',').map((step, index) => `ステップ${index + 1}: ${step.trim()}`);
      }
      return [];
    }
  }
});
