/* Parse weather data and display */
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
    } else {
      var obj = {};
      obj[weatherActivationKey] = 0;
      chrome.storage.local.set(obj);
    }
  });

  var weatherCode = "briefmedia12345";
  var usersCode = "";
  document.addEventListener("keyup", function(e) {
    usersCode = usersCode + e.key;
    if (usersCode.match(weatherCode)) {
      //alert("Tulsa Weather Activated!")
      chrome.storage.local.get([weatherActivationKey], function(result){
        var obj = {}
        obj[weatherActivationKey] = !result[weatherActivationKey];
        chrome.storage.local.set(obj);
        window.location.reload();
      });
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
    document.getElementById("weather-today").innerHTML = "Tulsa " + far + "&#176;"
  });
}

function get_forecast() {
  loadJSON('https://s3.amazonaws.com/lambda-project-files/forecast_5_day.json', function(response) {
    var res = JSON.parse(response);
    var data = parseWeather(res)
    var result = "";
    var unique = "";
    var test_unique = "";
    result = res.list.reduce(function(acc, curr){

      var d = new Date(0);
      d.setUTCSeconds(curr.dt);
      var day = d.getDay();
      day = day_key(day)
      var hi = data[day].hi;
      var lo = data[day].lo;
      var desc = data[day].desc;

      test_unique = `${day}${hi}${lo}`;

      if (!unique.match(test_unique)) {
        hi = kelvinToFahrenheit(hi);
        lo = kelvinToFahrenheit(lo);
        unique = test_unique;
        var string = `<div>${day} ${hi}/${lo} ${desc}</div>`;
        return acc + string;
      } else {
        return acc;
      }

    }, '');

    result_old = res.list.reduce(function(acc, curr){
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

function parseWeather(data) {
  var i, day, d;
  var parsedData = {
    "Sun" : {hi:0,lo:0},
    "Mon" : {hi:0,lo:0},
    "Tue" : {hi:0,lo:0},
    "Wed" : {hi:0,lo:0},
    "Thu" : {hi:0,lo:0},
    "Fri" : {hi:0,lo:0},
    "Sat" : {hi:0,lo:0},
  };
  for(i=0; i < data.list.length; i++) {
    d = new Date(0)
    d.setUTCSeconds(data.list[i].dt);
    day = day_key(d.getDay());
    parsedData[day]['desc'] = data.list[i].weather[0].main;
    parsedData[day]['hi'] = (data.list[i].main.temp_max > parsedData[day]['hi']) ? data.list[i].main.temp_max : parsedData[day]['hi'];
    parsedData[day]['lo'] = (parsedData[day]['lo'] == 0 || data.list[i].main.temp_min < parsedData[day]['lo']) ? data.list[i].main.temp_min : parsedData[day]['lo'];
  }
  //console.log(data)
  //console.log(parsedData)
  return parsedData;
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

initWeather();
