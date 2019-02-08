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
    init(result[key])
  } else {
    getJson("https://api.ipify.org?format=json").then(function(response){
      var ip = response.ip;
      getJson(`http://api.ipstack.com/${ip}?access_key=${api_key}`).then(function(location){
        obj[key] = location;
        chrome.storage.local.set(obj);
        init(location)
      });
    });
  }
})

function init(object){
  showWeather(object)
}

// https://api.weather.gov/gridpoints/TSA/45,102/forecast
async function showWeather(object) {
  let url = `https://api.weather.gov/points/${object.latitude},${object.longitude}`;
  let weather = await getJson(url);
  console.log(weather);
  console.log(weather.properties.forecast);
  console.log(weather.properties.forecastHourly);
  let forecast = await getJson(weather.properties.forecast);
  let hourly = await getJson(weather.properties.forecastHourly);
  $('temp').innerHTML = `${hourly.properties.periods[0].temperature} <span class="text-small">&#8457;</span>`;
  let temp = $('temp').innerHTML;
  forecast.properties.periods.forEach(function(period){
    if (period.name == "Saturday") {
      $('temp').innerHTML = $('temp').innerHTML + `<div class="text-small">${period.name}/${period.temperature}</div>`;
    }
    if (period.name == "Sunday") {
      $('temp').innerHTML = $('temp').innerHTML + `<div class="text-small">${period.name}/${period.temperature}</div>`;
    }
  });
  $('temp').innerHTML = `${$('temp').innerHTML} <div class="text-small">${forecast.properties.periods[0].shortForecast}</div>`;
}

async function getJson(url) {
  let response = await fetch(url);
  let json = await response.json();
  return json;
}
