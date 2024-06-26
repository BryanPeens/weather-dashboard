// This event listener ensures that the JavaScript code inside it runs
// only after the DOM (Document Object Model) has been fully loaded.
document.addEventListener("DOMContentLoaded", () => {
  buildHistoryElement();

  // These lines retrieve references to various elements in the index.html document
  const locationInput = document.getElementById("locationInput");
  const searchButton = document.getElementById("search-button");
  const weatherData = document.getElementById("weatherData");
  const forecastData = document.getElementById("forecastData");
  const forecastCards = document.getElementById("forecastCards");

  // let history = JSON.parse(localStorage.getItem('search-history')) || ["Atlanta", "New York"];

  // This is the API key required to access the OpenWeatherMap API. (Move to .env file hmmm...)
  const apiKey = "140cfd054be5e2fd76e0b0d383efacad";

  // This event listener is triggered when the search button is clicked.
  searchButton.addEventListener("click", () => {
    // It retrieves the value entered in the location input field.
    let location = locationInput.value;
    location = location.trim();

    // Constructs the URL for fetching current weather data using the OpenWeatherMap API.
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;

    // Fetches current weather data from the OpenWeatherMap API.
    fetch(url)
      .then((response) => response.json())
      // The data parameter represents the response received from the OpenWeatherMap API after making a
      // successful HTTP request using the fetch() method. This response typically contains JSON-formatted
      // weather data, including information such as temperature, humidity, wind speed, and weather descriptions.
      // The data parameter is used as input to the callback function defined within the .then() method. Within this function,
      // the code processes and extracts relevant information from the data object to update the weather display on the webpage.
      .then((data) => {
        // Extracts relevant weather information from the retrieved data.
        const { name, main, weather, wind } = data;
        // Updates the HTML elements with the retrieved weather information.
        document.getElementById("locationName").textContent = name;
        document.getElementById(
          "temperature"
        ).textContent = `${main.temp.toFixed()} °C`;
        document.getElementById("weatherDescription").textContent =
          weather[0].description;
        document.getElementById(
          "feelsLike"
        ).textContent = `${main.feels_like.toFixed()} °C`;
        document.getElementById("humidity").textContent = `${main.humidity} %`;
        document.getElementById(
          "windSpeed"
        ).textContent = `${wind.speed.toFixed()} m/s`;

        // Displays the weather data section.
        weatherData.style.display = "block";

        // Update local storage, with new item
        addHistory(location);

        // Build new element
        buildHistoryElement();
      })
      .catch((error) => console.error("Error fetching weather data:", error));

    // Constructs the URL for fetching 5-day forecast data using the OpenWeatherMap API.
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;

    // Fetches 5-day forecast data from the OpenWeatherMap API.
    fetch(forecastUrl)
      .then((response) => response.json())
      // The data parameter represents the response received from the OpenWeatherMap API after making a
      // successful HTTP request using the fetch() method. This response typically contains JSON-formatted
      // weather data, including information such as temperature, humidity, wind speed, and weather descriptions.
      // The data parameter is used as input to the callback function defined within the .then() method. Within this function,
      // the code processes and extracts relevant information from the data object to update the weather display on the webpage.
      .then((data) => {
        // Extracts the list of forecasted data points.
        const forecastList = data.list;
        // Clears any existing forecast cards.
        forecastCards.innerHTML = "";
        // Iterates over the forecast list, creating forecast cards for every 8th data point (one per day).
        for (let i = 0; i < forecastList.length; i += 8) {
          const forecast = forecastList[i];
          const forecastDateTime = new Date(forecast.dt * 1000);
          // Creates HTML structure for each forecast card.
          const forecastCard = document.createElement("div");
          forecastCard.classList.add("col-lg-6", "col-md-3", "mb-3");

          forecastCard.innerHTML = `
              <div class="card bg-secondary text-light">
                <div class="card-body">
                  <h5 class="card-title">${forecastDateTime.toLocaleDateString(
                    "en-US",
                    { weekday: "long" }
                  )} ${forecastDateTime.toLocaleDateString({
                     weekday: "long",
                  })}</h5>
                  <p class="card-text">Forecast Time : ${forecastDateTime.toLocaleTimeString(
                    "en-US",
                    { hour: "numeric" }
                  )}</p>
                  <p class="card-text">Temp : ${forecast.main.temp.toFixed()} °C</p>
                  <p class="card-text">Wind speed : ${forecast.wind.speed.toFixed()} MPH</p>
                  <p class="card-text">Humidity : ${
                    forecast.main.humidity
                  } %</p>
                  <p class="card-text">Expected : ${
                    forecast.weather[0].description
                  }</p>
                </div>
              </div>
            `;
          // Appends the forecast card to the forecast cards container.
          forecastCards.appendChild(forecastCard);
        }

        // Displays the forecast data section.
        forecastData.style.display = "block";
      })
      .catch((error) => console.error("Error fetching forecast data:", error));
  });
});

//// Get search option when clicked
const searchOption = document.getElementById("search-history");
const showHide = document.getElementById("show-options");

searchOption.addEventListener("click", (event) => {
  const clickedLine = event.target.innerHTML;
  // Update the value of the input, with the value from the clicked item / list option selected
  locationInput.value = clickedLine;

  searchOption.style.display = "none";
});

// Show and hide list if visible or hidden
showHide.addEventListener("click", (event) => {
  if (searchOption.style.display === "none") {
    // Show if hidden
    searchOption.style.display = "initial";
  } else {
    // Hide if not hidden
    searchOption.style.display = "none";
  }
});

// Get local storage history, with dummy locations
function getHistory() {
  let history = JSON.parse(localStorage.getItem("search-history")) || [
    "Atlanta",
    "New York",
    "Texas",
  ];
  return history;
}

// Add new item to the history
function addHistory(historyItem) {
  let history = getHistory();
  history.push(historyItem);
  history = history.filter((value, index) => history.indexOf(value) === index);
  localStorage.setItem("search-history", JSON.stringify(history));
  return history;
}

// Create the new element for the history
function buildHistoryElement() {
  const history = getHistory();
  const searchHistory = document.getElementById("search-history");
  // Remove child element
  searchHistory.innerHTML = "";
  // Loop through tasks and create task cards for each status
  for (let historyItem of history) {
    const item = document.createElement("a");
    item.className = "list-group-item list-group-item-action";
    item.textContent = historyItem;
    searchHistory.appendChild(item);
  }
}
