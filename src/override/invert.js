
function initInvert(){

  var main = document.getElementById("hidden-textarea");
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
