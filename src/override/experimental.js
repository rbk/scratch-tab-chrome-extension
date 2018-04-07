function initCrossTabStorageExperiment() {


  var code = document.getElementById("main_notes");
  var key = "scratchtab_experimental";

  chrome.storage.local.get([key], function(result){
    var raw = result[key]

    if (code && raw) {

      // raw = raw.replace(/\n/g, "<br>")
      // raw = raw.replace(/\r/g, "<br>")

      code.innerHTML = raw;
    }
  });

  function stringToHtml(string) {
    var html = "";
    var lines = string.split("<br>");
    html = lines.reduce((acc, curr) => {
      return acc + mark(curr);
    }, "");
    return html;
  }

  function mark(string) {
    if (string.match("<h1><br></h1>")) {
      return "";
    }
    if (string.match("#")) {
      return `<h1>${string.replace("#", "")}</h1>`
    }
    return string;
  }

  // chrome.storage.onChanged.addListener(function(changes, namespace) {
  //   if(changes.scratchtab &&  code.value != changes.scratchtab.newValue) {
  //     code.value = changes.scratchtab.newValue;
  //   }
  // });

  document.addEventListener('keyup', function(e){
    var value = code.innerHTML;
    var obj = {}

    // format value
    //value = stringToHtml(value);
    //console.log(value)

    var divs = code.querySelectorAll("div");
    if (!divs.length) {
      // single line of text
      if (value.match("#")) {
        code.innerHTML = `<h1>${value.replace("#", "")}</h1>`
      }
    } else {

      var divs = code.querySelectorAll("div");

      divs = [].slice.call(code.querySelectorAll("div"))

      console.log(divs)
      if (divs) {
        value = divs.reduce((acc, div) => {
          if (div.innerHTML.match(/##\s/)) {
            console.log("match")

            div.innerHTML = `<h2>${div.innerHTML.replace("##", "")}</h2>`

            console.log(div.innerHTML)
            return acc + `<h2>${div.innerHTML.replace("##", "")}</h2>`;
          }
          // if (div.innerHTML.includes("# ")) {
          //   return acc + `<h1>${div.innerHTML.replace("#", "")}</h1>`;
          // }
          return acc + div.innerHTML;
        }, "")
      }

    }
    obj[key] = value;
    chrome.storage.local.set(obj);
  });

}

initCrossTabStorageExperiment();


