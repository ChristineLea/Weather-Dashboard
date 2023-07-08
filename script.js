const searchBtn = $("#search");
const API_KEY = "7efeea0385eeddc77479b9ad9143d71b";
const $storageList = $("#storage-list");
let storage = [];
	let todayEl = $(".today");
	let cardsGrid = $(".cards");
function renderStorageList() {
	$storageList.html("");
	for (let i = 0; i < storage.length; i++) {
		let search = storage[i];
		let li = $("<li>");
		li.text(search).addClass("li");
		$storageList.append(li);
	}
}

function init() {
	let history = JSON.parse(localStorage.getItem("storage"));
	if (history !== null) {
		storage = history;
	}

	renderStorageList();
}

function setLocalStorage() {
	localStorage.setItem("storage", JSON.stringify(storage));
	renderStorageList();
}

// Uses the geolocation API to convert the city, country to lat, lon
function getLatLon(city, country) {

	// GET lat lon
	let locationUrl =
		"http://api.openweathermap.org/geo/1.0/direct?q=" +
		city +
		"," +
		country +
		"&limit=1&appid=" +
		API_KEY;

	// Set integer to a two decimal format to meet requirements of weather API
	fetch(locationUrl)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			console.log(data);
			let lat = data[0].lat.toFixed(2);
			let lon = data[0].lon.toFixed(2);
			getWeatherApi(lat, lon);
		});
}

// GET weather from lat & lon
function getWeatherApi(lat, lon) {
	let latitude = lat;
	let longitude = lon;
	let requestUrl =
		"https://api.openweathermap.org/data/2.5/forecast?lat=" +
		latitude +
		"&lon=" +
		longitude +
		"&units=metric&appid=" +
		API_KEY;

	fetch(requestUrl)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			for (let i = 7; i <= 40; i += 8) {
				// cycle through get request to access the relevant data for 5 day forecast
				let dataList = data.list[i];
				populate(dataList);
			}
			// Cycle data for location & todays weather
			let requestLocation = data.city.name;
			console.log(requestLocation);
			let todayData = data.list[0];
			populateToday(requestLocation, todayData);
		});
}

// Uses weather data to populate 5 day forecast
function populate(list) {
	cardsGrid.text("");
	let dateData = list.dt;
	let iconData = list.weather[0].icon;
	let tempData = list.main.temp;
	let windData = list.wind.speed;
	let humidityData = list.main.humidity;

	// format the date to display
	let dateFormat = new Date(dateData * 1000).toLocaleString();
	let date = dayjs(dateFormat).format("ddd, DD MMM");

	// Populate data by creating and appending elements in HTML
	let dateEl = $("<h4>").addClass("card-title").text(date);
	let iconEl = $("<img>")
		.attr(
			"src",
			"https://openweathermap.org/img/wn/" + iconData + "@2x.png"
		)
		.addClass("card-icon");
	let tempEl = $("<p>").addClass("card-body").text(`Temp: ${tempData} °C`);
	let windEl = $("<p>")
		.addClass("card-body wind")
		.text(`Wind: ${windData} MPH`);
	let humidityEl = $("<p>")
		.addClass("card-body")
		.text(`Humidity: ${humidityData} %`);

	let cardEl = $("<div>").addClass("card");
	// let cardsGrid = $(".cards");
	cardEl.append(dateEl, iconEl, tempEl, windEl, humidityEl);
	cardsGrid.append(cardEl);
}

// Populate todays weather
function populateToday(id, d) {
	todayEl.text("");
	let locationData = id;
	let dateData = d.dt;
	let iconData = d.weather[0].icon;
	let tempData = d.main.temp;
	let windData = d.wind.speed;
	let humidityData = d.main.humidity;

	let dateFormat = new Date(dateData * 1000).toLocaleString();
	let date = dayjs(dateFormat).format("dddd, DD MMM");

	// Create and append HTML elements for today weather
	let locationEl = $("<h2>").text(locationData);
	let dateEl = $("<h3>").addClass("display").text(date);
	let iconEl = $("<img>")
		.addClass("icon")
		.attr(
			"src",
			"https://openweathermap.org/img/wn/" + iconData + "@2x.png"
		);

	let tempEl = $("<p>").addClass("info").text(`Temp: ${tempData} °C`);
	let windEl = $("<p>").addClass("info wind").text(`Wind: ${windData} MPH`);
	let humidityEl = $("<p>")
		.addClass("info")
		.text(`Humidity: ${humidityData} %`);
	dateEl.append(locationEl);
	// let todayEl = $(".today");
	todayEl.append(dateEl, iconEl, tempEl, windEl, humidityEl);
}

// CLEAR weather data shown
$(".form").on("click", ".form-btn", function (e) {
	e.preventDefault();

	// DOM traversal to access the value from city / country input
	let city = $(this).parent().children().eq(2).val();
	let country = $(this).prev().val();

	let addHistory = `${city}, ${country}`;

	if (storage.includes(addHistory)) {
		// CLEAR input fields
		$(":input", ".form").val("");
	} else {
		storage.push(addHistory);
		$(":input", ".form").val("");
	}

	setLocalStorage();
	getLatLon(city, country);
});
init();
