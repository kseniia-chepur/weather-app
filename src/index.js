// video settings

document.querySelector("video").playbackRate = "0.3";

// Get current date

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

let currentDate = document.querySelector("#date");
currentDate.innerHTML = getCurrentDateAndTime(new Date());

// Search by input

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

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

// Get current weather forecast

function getWeatherForecast(response) {
  document.querySelector("#city").innerHTML = response.data.name;

  document
    .querySelector("#weather-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );

  document
    .querySelector("#weather-icon")
    .setAttribute("alt", response.data.weather[0].description);

  celsiusTemperature = response.data.main.temp;
  document.querySelector("#temperature").innerHTML =
    Math.round(celsiusTemperature);

  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;

  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

  document.querySelector("#real-feels").innerHTML = Math.round(
    response.data.main.feels_like
  );
}

// Get geolocation coordinates

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

let currentLocationBtn = document.querySelector("#current-location-btn");
currentLocationBtn.addEventListener("click", requestGeolocationCoords);

// Convert temperature scales

function convertToFahrenheit(event) {
  event.preventDefault();

  fahrenheit.classList.add("active");
  celsius.classList.remove("active");

  let fahrenheitTemperature = celsiusTemperature * 1.8 + 32;
  document.querySelector("#temperature").innerHTML = Math.round(
    fahrenheitTemperature
  );
}

function convertToCelsius(event) {
  event.preventDefault();

  celsius.classList.add("active");
  fahrenheit.classList.remove("active");

  document.querySelector("#temperature").innerHTML =
    Math.round(celsiusTemperature);
}

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", convertToFahrenheit);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", convertToCelsius);

let celsiusTemperature = null;

// Initial forecast

searchByCity("London");
