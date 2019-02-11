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
var a = document.querySelector("audio")
var file = 'media/Dr_Doctor_-_12_-_Semilanceata.mp3'
a.src=file
var ctx = new AudioContext()
var audio = ctx.createMediaElementSource(a)
var analyser = ctx.createAnalyser()
analyser.connect(ctx.destination)
var playBtn = document.querySelector('.btn-play')
var freqs = false
var playing = false
var canvas = document.querySelector('canvas')
var drawContext = canvas.getContext('2d')
var width = 640
var height = 360
console.log(audio)
console.log(analyser)

playBtn.addEventListener('click', (e) => {
  console.log(audio)
  // requestAnimFrame(draw.bind(this))
});

function draw() {
  freqs = new Uint8Array(analyser.frequencyBinCount);
  analyser.smoothingTimeConstant = 0.8;
  analyser.fftSize = 2048;
  analyser.getByteTimeDomainData(freqs);
  canvas.width = width;
  canvas.height = height;

  for (var i = 0; i < analyser.frequencyBinCount; i++) {
    var value = freqs[i];
    var percent = value / 256;
    var height = height * percent;
    var offset = height - height - 1;
    var barWidth = width/analyser.frequencyBinCount;
    var hue = i / analyser.frequencyBinCount * 360;
    drawContext.fillStyle = 'hsl(' + hue + ', 100%, 50%)';
    drawContext.fillRect(i * barWidth, offset, barWidth, 10);
  }
  if (playing) {
    requestAnimFrame(draw.bind(this))
  }
}
