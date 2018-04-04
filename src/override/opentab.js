
function initHotkey(){
  var hotkey = "9173"
  var usrKey = "";
  document.addEventListener("keyup", function(e) {
    console.log(e)
    if (e.keyCode == 91) {
      usrKey += "91";
    }
    if (e.keyCode == 73) {
      usrKey += "73"
    }

    if (usrKey.match(hotkey)) {
      console.log('works')
      chrome.tabs.create();
      usrKey = "";
    }
  });
}

initHotkey();

