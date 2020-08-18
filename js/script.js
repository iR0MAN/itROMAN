new Vue({

  el: "#app",
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      tracks: [{
          name: "Dreams",
          artist: "A$AP Rocky",
          cover: "./musicgraphic/asap.jpg",
          source: "./music/1.mp3",
          url: "https://www.youtube.com/watch?v=gb5xqazOhf8",
          favorited: false
        },
        {
          name: "Syzyfowe prace",
          artist: "Przemek Ferguson",
          cover: "./musicgraphic/ferguson.jpg",
          source: "./music/2.mp3",
          url: "https://www.youtube.com/watch?v=ytJphu_6Tco",
          favorited: false
        },
        {
          name: "Sweet Home",
          artist: "Białas & Whtie 2115",
          cover: "./musicgraphic/bialas.jpg",
          source: "./music/3.mp3",
          url: "https://www.youtube.com/watch?v=zURY9aiun34",
          favorited: false
        },
        {
          name: "Kwit",
          artist: "Chillwagon",
          cover: "./musicgraphic/kwit.jpg",
          source: "./music/4.mp3",
          url: "https://www.youtube.com/watch?v=AbJdRi7hsL8",
          favorited: false
        },
        {
          name: "Heavy",
          artist: "Linkin Park",
          cover: "./musicgraphic/LP.jpg",
          source: "./music/5.mp3",
          url: "https://www.youtube.com/watch?v=5dmQ3QWpy1Q",
          favorited: false
        },
        {
          name: "Pustka",
          artist: "Kacper x Gibbs",
          cover: "./musicgraphic/gibbs.jpg",
          source: "./music/6.mp3",
          url: "https://www.youtube.com/watch?v=q_3ko1GVKn4",
          favorited: false
        },
        {
          name: "Come 2gether",
          artist: "Ooyy",
          cover: "./musicgraphic/ooyy.jpg",
          source: "./music/7.mp3",
          url: "https://www.youtube.com/watch?v=7aouQRbx6ts",
          favorited: false
        },
        {
          name: ":)",
          artist: "Radio",
          cover: "./musicgraphic/radio.jpg",
          source: "http://pldm.ml/radio.php?url=https://www.eskago.pl/radio/eska-warszawa",
          url: "https://www.youtube.com/watch?v=oTUaBIOyLrM",
          favorited: false
        },
        {
          name: "Where Have You Been (SENSE Remix)",
          artist: "Rihanna",
          cover: "./musicgraphic/rihanna.jpg",
          source: "./music/9.mp3",
          url: "https://www.youtube.com/watch?v=JdRvEpz343w",
          favorited: false
        },
        {
          name: "Jumpsuit",
          artist: "Twenty One Pilots",
          cover: "./musicgraphic/top.jpg",
          source: "./music/10.mp3",
          url: "https://www.youtube.com/watch?v=UOUBW8bkjQ4",
          favorited: false
        },



      ],
      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null
    };
  },

  methods: {
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if (this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[
        this.currentTrackIndex
      ].favorited;
    }
  },


  created() {
    let vm = this;
    this.currentTrack = this.tracks[0];
    this.audio = new Audio();
    this.audio.src = this.currentTrack.source;
    this.audio.ontimeupdate = function () {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function () {
      vm.generateTime();
    };
    this.audio.onended = function () {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };

    // this is optional (for preload covers)
    for (let index = 0; index < this.tracks.length; index++) {
      const element = this.tracks[index];
      let link = document.createElement('link');
      link.rel = "prefetch";
      link.href = element.cover;
      link.as = "image"
      document.head.appendChild(link)
    }


  }
});