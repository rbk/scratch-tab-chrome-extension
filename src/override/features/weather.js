
var api_key = "ea2e2be4f76c34455c0e8b8e5a81ff53"

var $ = function(id) {
  return document.getElementById(id)
}

var key = "coordinates";
var savedInfo = false;
var obj = {}
chrome.storage.local.get([key], function(result){
  if (result[key]) {
    savedInfo = true;
    console.log(result[key])
    init(result[key])
  } else {
    getJson("https://api.ipify.org?format=json").then(function(response){
      var ip = response.ip;
      getJson(`http://api.ipstack.com/${ip}?access_key=ea2e2be4f76c34455c0e8b8e5a81ff53`).then(function(location){
        console.log(location);
        obj[key] = location;
        chrome.storage.local.set(obj);
        init(location)
      });
    });
  }
})

function init(object){
  $('ip').innerText = object.ip;
  showWeather(object)
}

// https://api.weather.gov/gridpoints/TSA/45,102/forecast
function showWeather(object) {
  let url = `https://api.weather.gov/points/${object.latitude},${object.longitude}`
  console.log(url)
  getJson(url).then(function(response){
    console.log(response)
    var url = response.properties.forecast;
    getJson(url).then(function(weather){
      console.log(weather)
      $('temp-deg').innerText = weather.properties.periods[0].temperature;
    })
  })
}

async function getJson(url) {
  let response = await fetch(url);
  let json = await response.json();
  return json;
}
