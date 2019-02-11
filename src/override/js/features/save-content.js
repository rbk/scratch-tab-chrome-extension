function initCrossTabStorage() {

  var code = document.getElementById("notes");
  var key = "scratchtab";

  chrome.storage.local.get([key], function(result){
    var raw = result[key]
    if (raw) {
      code.value = raw;
    }
  });

  // this should not run on active tab
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if(changes.scratchtab &&  code.value != changes.scratchtab.newValue) {
      code.value = changes.scratchtab.newValue;
    }
  });

  document.addEventListener('keyup', function(e){
    var value = code.value;
    var obj = {}
    obj[key] = value
    chrome.storage.local.set(obj, function(res) {});
  });

  document.addEventListener('keydown', function(e){
    if (e.code == "Tab") {
      return false;
    }
    return true;
  });

}

initCrossTabStorage();
