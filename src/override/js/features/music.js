// What I'm trying to do.... https://webaudioapi.com/samples/visualizer/
// stackoverflow question: https://stackoverflow.com/questions/53030205/analysernode-getfloatfrequencydata-always-returns-infinity
// https://developer.mozilla.org/en-US/docs/Web/API/MediaElementAudioSourceNode
// Sample: view-source:https://webaudioapi.com/samples/visualizer/

window.requestAnimFrame = (function(){
return  window.requestAnimationFrame       ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  window.oRequestAnimationFrame      ||
  window.msRequestAnimationFrame     ||
  function( callback ){
  window.setTimeout(callback, 1000 / 60);
};
})();

var HEIGHT = 360
var WIDTH = window.width

class Music {
  constructor() {

    this.ctx = new AudioContext()
    this.file = 'media/Dr_Doctor_-_12_-_Semilanceata.mp3'
    this.audio = new Audio(this.file)
    this.source = this.ctx.createMediaElementSource(this.audio)
    this.analyser = this.ctx.createAnalyser()
    this.analyser.connect(this.ctx.destination)

    this.playBtn = document.querySelector('.btn-play')
    this.freqs = false
    this.playing = false
    this.addEvents()
    this.canvas = document.querySelector('canvas')
    this.drawContext = this.canvas.getContext('2d')
    // this.ctx.globalCompositeOperation = "xor";
    this.width = window.innerWidth
    this.height = 360
    // this.source.connect(this.ctx.destination)
    // this.analyser.connect(this.ctx.destination)
  }
  addEvents() {
    this.playBtn.addEventListener('click', (e) => {
      if (!this.playing){
        fetch(this.file, {
          headers: new Headers({
            "Content-Type" : "audio/mpeg"
          })
        }).then(function(response){
          return response.arrayBuffer()
        }).then((ab) => {
          this.ctx.decodeAudioData(ab, (buffer) => {
            this.source = this.ctx.createBufferSource();
            this.source.connect(this.analyser);
            this.source.buffer = buffer;
            this.source.start(0)
            requestAnimFrame(this.draw.bind(this))
          });
        });
      } else {
        this.source.stop()
      }
      this.playing = !this.playing;
      this.btnToggle()
    })
  }
  btnToggle() {
    if (this.playBtn.innerText == "Play") {
      this.playing = true
      this.playBtn.innerText = "Pause"
    } else {
      this.playing = false
      this.playBtn.innerText = "Play"
    }
  }
  draw() {
    // Get the frequency data from the currently playing music
    this.freqs = new Uint8Array(this.analyser.frequencyBinCount);
    this.times = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.smoothingTimeConstant = 0.8;
    this.analyser.fftSize = 2048;
    this.analyser.getByteFrequencyData(this.freqs);
    this.analyser.getByteTimeDomainData(this.times);
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Draw the frequency domain chart.
    for (var i = 0; i < this.analyser.frequencyBinCount; i++) {
      var value = this.freqs[i];
      var percent = value / 256;
      var height = HEIGHT * percent;
      var offset = HEIGHT - height - 1;
      var barWidth = WIDTH/this.analyser.frequencyBinCount;
      var hue = i / this.analyser.frequencyBinCount * 360;
      this.drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
      this.drawContext.fillStyle = '#74c76e';
      this.drawContext.fillRect(i, offset, 1, 10);
      // this.drawContect.fillRect(i * barWidth, offset, barWidth, 10)
    }

    // // Draw the time domain chart.
    console.log(this.times)
    for (var i = 0; i < this.analyser.frequencyBinCount; i++) {
      var value = this.times[i];
      this.drawContext.fillStyle = '#74c76e';
      this.drawContext.fillRect(i, value, 1, 2);
    }

    if (this.playing) {
      requestAnimFrame(this.draw.bind(this))
    }
  }
}
const music = new Music()
