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

// Format dates for daily forecast

function formatDay(timestamp) {
  let time = new Date(timestamp * 1000);
  let week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let day = week[time.getDay()];

  return day;
}

function formatDate(timestamp) {
  let time = new Date(timestamp * 1000);
  let date = time.getDate();
  let year = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = year[time.getMonth()];

  return `${date} ${month}`;
}

// Add html for 5-days forecast and display daily forecast

function addFiveDaysForecast(response) {
  let dailyForecast = response.data.daily;

  let forecastHtml = "";

  dailyForecast.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml = `${forecastHtml} 
        <div class="col">
          <div class="card selected-day">
            <div class="card-body">
              <h2 class="card-title day-of-week">${formatDay(day.dt)}</h2>
              <h3 class="date">${formatDate(day.dt)}</h3>
              <div class="card-text daily-values"><img class="daily-icon" src="http://openweathermap.org/img/wn/${
                day.weather[0].icon
              }@2x.png"> ${day.weather[0].main}
              </div>
              <p class="card-text daily-values"><span id="max-temp">
                  ${Math.round(
                    day.temp.max
                  )}°C</span><br /><span class="min-temp">${Math.round(
        day.temp.min
      )}°C</span>
              </p>
            </div>
          </div>
        </div>      
      `;
    }
  });

  document.querySelector("#forecast").innerHTML = forecastHtml;
}

// Search by input

function handleSubmit(event) {
  event.preventDefault();

  cityInput = document.querySelector("#search-input").value;
  searchByCity(cityInput);
}

function searchByCity(city) {
  let key = "9f2e2f52f885114eaafb1054b63cf92c";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=${units}`;

  axios.get(url).then(getWeatherForecast);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

// Get current weather forecast

function getWeatherForecast(response) {
  city = response.data.name;

  document.querySelector(
    "#city"
  ).innerHTML = `${city}, ${response.data.sys.country}`;

  document
    .querySelector("#weather-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );

  document
    .querySelector("#weather-icon")
    .setAttribute("alt", response.data.weather[0].main);

  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );

  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;

  if (units === "metric") {
    document.querySelector("#wind").innerHTML = `${Math.round(
      response.data.wind.speed * 3.6
    )} km/h`;
  } else {
    document.querySelector("#wind").innerHTML = `${Math.round(
      response.data.wind.speed
    )} mph`;
  }

  document.querySelector("#real-feels").innerHTML = Math.round(
    response.data.main.feels_like
  );

  getCoordinatesBySearch(response.data.coord);
}

// Get geolocation coordinates based on search input

function getCoordinatesBySearch(coords) {
  let key = "9f2e2f52f885114eaafb1054b63cf92c";
  let lat = coords.lat;
  let lon = coords.lon;
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,hourly,minutely&appid=${key}&units=${units}`;

  axios.get(url).then(addFiveDaysForecast);
}

// Get geolocation coordinates of current location

function requestGeolocationCoords(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getGeolocationCoords);
}

function getGeolocationCoords(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let key = "9f2e2f52f885114eaafb1054b63cf92c";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=${units}`;

  axios.get(url).then(getWeatherForecast);
}

let currentLocationBtn = document.querySelector("#current-location-btn");
currentLocationBtn.addEventListener("click", requestGeolocationCoords);

// Convert temperature scales

function convertToFahrenheit(event) {
  event.preventDefault();

  units = "imperial";

  fahrenheit.classList.add("active");
  celsius.classList.remove("active");

  searchByCity(city);
}

function convertToCelsius(event) {
  event.preventDefault();

  units = "metric";

  celsius.classList.add("active");
  fahrenheit.classList.remove("active");

  searchByCity(city);
}

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", convertToFahrenheit);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", convertToCelsius);

// Initial forecast

let units = "metric";
let city = "London";

searchByCity(city);
