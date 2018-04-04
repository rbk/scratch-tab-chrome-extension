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

function initWeather() {

  var weatherActivationKey = "scratchtab_weather";
  chrome.storage.local.get([weatherActivationKey], function(result){
    var res = result[weatherActivationKey]
    if (res) {
      var timeout = 1000*60*16; // 15 minutes
      get_weather();

      // Load weather every 15 minutes
      setInterval(function(){
        get_weather();
      },timeout);

      get_forecast();
    }
  });

  var weatherCode = "briefmedia12345";
  var usersCode = "";
  document.addEventListener("keyup", function(e) {
    usersCode = usersCode + e.key;
    if (usersCode.match(weatherCode)) {
      alert("Tulsa Weather Activated!")
      var obj = {}
      obj[weatherActivationKey] = 1;
      chrome.storage.local.set(obj);
      window.location.reload();
    }
  });

}

function kelvinToFahrenheit(kelvin) {
  var farenheight = (9/5)*(kelvin-273)+32;
  farenheight = farenheight.toFixed(0)
  return farenheight;
}

function get_weather() {
  loadJSON('https://s3.amazonaws.com/lambda-project-files/current_weather.json', function(response) {
    var res = JSON.parse(response);
    var far = kelvinToFahrenheit(res.main.temp)
    document.getElementById("weather-today").innerHTML = far + "&#176;"
  });
}

function get_forecast() {
  loadJSON('https://s3.amazonaws.com/lambda-project-files/forecast_5_day.json', function(response) {
    var res = JSON.parse(response);
    var result = "";
    //console.log(res)
    result = res.list.reduce(function(acc, curr){
      if (curr.dt_txt.match("12:00")) {
        var d = new Date(0);
        d.setUTCSeconds(curr.dt);
        var month = d.getMonth()+1;
        var date = d.getDate();
        var day = d.getDay();
        day = day_key(day)
        return acc + `<div>${day} ${kelvinToFahrenheit(curr.main.temp)}</div>`
      } else {
        return acc;
      }
    }, '');
    document.getElementById("weather-forecast").innerHTML = result
  });
}

function day_key(integer) {
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[integer];
}

function loadJSON(url, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

initCrossTabStorage();
initWeather();


