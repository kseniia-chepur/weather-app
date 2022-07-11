// video settings

document.querySelector("video").playbackRate = "0.3";

// Get current date

let currentDate = document.querySelector("#date");
currentDate.innerHTML = getCurrentDateAndTime(new Date());

function getCurrentDateAndTime(currentDate) {
  let week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let year = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let day = week[currentDate.getDay()];
  let month = year[currentDate.getMonth()];
  let date = currentDate.getDate();

  return `${day}, ${month} ${date}`;
}

// Search by input

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  let city = document.querySelector("#search-input").value;
  searchByCity(city);
}

function searchByCity(city) {
  let key = "9f2e2f52f885114eaafb1054b63cf92c";
  let units = "metric";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=${units}`;

  axios.get(url).then(getWeatherForecast);
}

// Get current weather forecast

function getWeatherForecast(response) {
  document.querySelector("#city").innerHTML = response.data.name;

  document
    .querySelector("#weather-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );

  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );

  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;

  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  document.querySelector("#real-feels").innerHTML = Math.round(
    response.data.main.feels_like
  );
}

// Get geolocation coordinates

let currentLocationBtn = document.querySelector("#current-location-btn");
currentLocationBtn.addEventListener("click", requestGeolocationCoords);

function requestGeolocationCoords(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getGeolocationCoords);
}

function getGeolocationCoords(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let key = "9f2e2f52f885114eaafb1054b63cf92c";
  let units = "metric";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=${units}`;

  axios.get(url).then(getWeatherForecast);
}

// Initial forecast

searchByCity("London");
