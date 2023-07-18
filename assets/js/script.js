// GLOBAL VARIABLES
const searchBtn = $("#search");
const API_KEY = "7efeea0385eeddc77479b9ad9143d71b";
const $storageList = $("#storage-list");
let storage = [];

// 2. Check local storage / Invoke renderStorageList()
function init() {
	let history = JSON.parse(localStorage.getItem("storage"));
	if (history !== null) {
		storage = history;
	}
	renderStorageList();
}

// 3. For every element in storage array, create/append a button for each stored location
function renderStorageList() {
	$storageList.html("");
	for (let i = 0; i < storage.length; i++) {
		let search = storage[i];
		let locationEl = $(`<button>${search}</button>`);

		locationEl.addClass("btn").attr("id", search);
		$storageList.append(locationEl);
	}
	appendTodayNodes();
}

// 4. Create and append node elements used to display Today's weather
// This stops node elements from been duplicated when additional locations are checked
function appendTodayNodes() {
	$(".today").append(
		$("<h2>"),
		$("<h3>").addClass("normal"),
		$("<img>"),
		$("<p>"),
		$("<p>"),
		$("<p>")
	);
	appendForecastNodes();
}

// 5. Create and append node elements used to display 5 day Forecast
function appendForecastNodes() {
	for (let i = 0; i <= 4; i++) {
		$(".cards").append(
			$("<div><h4></h4><img/><p></p><p></p><p></p></div>")
		);
	}

	// Assign each element with a class to set their position in the HTML document
	$(".cards").children().eq(0).addClass("card-zero");
	$(".cards").children().eq(1).addClass("card-one");
	$(".cards").children().eq(2).addClass("card-two");
	$(".cards").children().eq(3).addClass("card-three");
	$(".cards").children().eq(4).addClass("card-four");
}

// 7. Add search to local storage / render storage list
function setLocalStorage() {
	localStorage.setItem("storage", JSON.stringify(storage));
	renderStorageList();
}

// 7. Uses the geolocation API to convert the city, country to lat, lon format
function getLatLon(location) {
	let locationUrl =
		"https://api.openweathermap.org/geo/1.0/direct?q=" +
		location +
		"&limit=1&appid=" +
		API_KEY;

	// Set integer to a two decimal format to meet requirements of weather API
	// Invoke the getWeatherApi()
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

// 8. Use lat & lon to GET the weather/forecast from the API
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
			// send data to sortObj()
			sortObj(data);
			// Cycle data for Location
			let requestLocation = data.city.name;
			// Cycle data for Today weather, which will be at index 0
			let todayData = data.list[0];
			// Pass location and today weather object to populateToday()
			populateToday(requestLocation, todayData);
		});
}

// 9. Use weather data to populate 5 day forecast
function sortObj(data) {
	// for loop to pull data lists
	// GET request returns an object with 40 timestamps
	// timestamp at index [7] will be day 1 forecast
	// set the corresponding [index] to each day of the forecast & populate the data
	let obj;
	for (let j = 7; j <= 40; j += 8) {
		if (j === 7) {
			obj = data.list[j];
			populate(obj, $(".card-zero"));
		} else if (j === 15) {
			obj = data.list[j];
			populate(obj, $(".card-one"));
		} else if (j === 23) {
			obj = data.list[j];
			populate(obj, $(".card-two"));
		} else if (j === 31) {
			obj = data.list[j];
			populate(obj, $(".card-three"));
		} else if (j === 39) {
			obj = data.list[j];
			populate(obj, $(".card-four"));
		} else {
			console.log("error");
		}
	}
}

// 10. Populate the Forecast Weather
function populate(obj, card) {
	// Each time this function is called it will be passed the next forecast date data & the matching card's class
	// Populate data by updating the .text() content of each node element
	let $card = card;

	// DATE
	$card
		.children()
		.eq(0)
		.text(
			dayjs(new Date(obj.dt * 1000).toLocaleString()).format(
				"ddd, DD MMM"
			)
		);

	// ICON
	$card
		.children()
		.eq(1)
		.attr(
			"src",
			"https://openweathermap.org/img/wn/" +
				obj.weather[0].icon +
				"@2x.png"
		);

	// TEMP
	$card.children().eq(2).text(`Temp:  ${obj.main.temp}°C`);
	// WIND
	$card.children().eq(3).text(`Wind:  ${obj.wind.speed} mpH`);
	// HUMIDITY
	$card.children().eq(4).text(`Humidity: ${obj.main.humidity}%`);
}

// 11. Uses weather data to populate Today's weather
function populateToday(id, d) {
	// format the date to display
	let dateFormat = new Date(d.dt * 1000).toLocaleString();

	// Populate data by updating the .text() content of each node element
	// <h2> node to populate/display location data
	$(".today").children().eq(0).text(id);

	// <h3> node to populate/display date
	$(".today").children().eq(1).text(dayjs(dateFormat).format("dddd, DD MMM"));

	// <img> node to populate/display icon
	$(".today")
		.children()
		.eq(2)
		.attr(
			"src",
			"https://openweathermap.org/img/wn/" + d.weather[0].icon + "@2x.png"
		);

	// <p> node to populate/display temp data
	$(".today").children().eq(3).text(`Temp:   ${d.main.temp}°C`);
	// <p> node to populate/display wind data
	$(".today").children().eq(4).text(`Wind:   ${d.wind.speed} mpH`);
	// <p> node to populate/display humidity data
	$(".today").children().eq(5).text(`Humidity: ${d.main.humidity}%`);
}

// 6. CLICK EVENT triggered when a user searches a location
$(".form").on("click", ".form-btn", function (e) {
	e.preventDefault();

	// DOM traversal to access the value from city input / country input
	let city = $(this).parent().children().eq(2).val();
	let country = $(this).prev().val();
	
	let cityCountry = `${city},${country}`;
	getLatLon(cityCountry);


	// Check if the location is already existing in local storage then push to storage array
	if (storage.includes(cityCountry)) {
		// CLEAR input fields
		$(":input",".form").val("");
	} else {
		storage.push(cityCountry);
		$(":input",".form").val("");
	}
	setLocalStorage();
});

// 1. On page load, this function will execute
init();

// On click event - for locations saved in local storage
$(".btn").on("click", function (e) {
	let btn = $(e.currentTarget).attr("id");
	getLatLon(btn);
});