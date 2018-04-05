function initCrossTabStorage() {

  var code = document.getElementById("hidden-textarea");
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
    chrome.storage.local.set(obj, function(res) {
    });
  });

}

function initInvert(){

  var key = "scratchtab_invert";
  var code = "patrick";
  var usersCode = "";

  // Set event
  chrome.storage.local.get([key], function(result){
    if (result[key]) {
      document.body.classList.add('invert')
    } else {
      var obj = {};
      obj[key] = 0;
      chrome.storage.local.set(obj);
    }
  })

  // Toggle event
  document.addEventListener("keyup", function(e) {
    usersCode = usersCode + e.key;
    if (usersCode.match(code)) {
      usersCode = "";
      chrome.storage.local.get([key], function(result){
        //alert("Invert Colors!")
        var obj = {}
        obj[key] = !result[key];
        chrome.storage.local.set(obj);
        if (obj[key]) {
          document.body.classList.add('invert');
        } else {
          document.body.classList.remove('invert');
        }
      })
    }
  });
}
initInvert();
initCrossTabStorage();


