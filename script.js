const searchBtn = $("#search");
const API_KEY = "7efeea0385eeddc77479b9ad9143d71b";
const $storageList = $("#storage-list");
let storage = [];

function renderStorageList() {
	$storageList.html("");
	for (let i = 0; i < storage.length; i++) {
		let search = storage[i];
		let locationEl = $(`<button>${search}</button>`);
		locationEl.addClass("btn").attr("id", search);
		// add attr of id of city name?
		console.log(typeof search);
		console.log(search);
		$storageList.append(locationEl);
	}
	// append emptyNodes
	appendTodayNodes();
}

// on click ".btn" check for "id"
// pass id to getLatLon to render weather

// get storage to weather

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
			// for (let i = 7; i <= 40; i += 8) {
			// 	// cycle through get request to access the relevant data for 5 day forecast
			// 	let dataList = data.list[i];
			// 	populate(dataList);
			// }
			sortObj(data);
			// Cycle data for location & todays weather
			let requestLocation = data.city.name;
			console.log(requestLocation);
			let todayData = data.list[0];
			populateToday(requestLocation, todayData);
		});
}

// Uses weather data to populate 5 day forecast
function sortObj(data) {
	// for loop to pull data lists
	// then loop data.list[j].dt
	let obj;
	for (let j = 7; j <= 40; j += 8) {
		console.log(j);
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

	// console.log(data.list[7]); //card-zero
	// console.log(data.list[15]); //card-one
	// console.log(data.list[23]); //card-two
	// console.log(data.list[31]); //card-three
	// console.log(data.list[39]); //card-four


	// cycle through get request to access the relevant data for 5 day forecast
}
function populate(obj, card) {
	let $card = card;

	// DATE
	$card
		.children()
		.eq(0)
		.text(
			dayjs(new Date(obj.dt * 1000).toLocaleString()).format(
				"dddd, DD MMM"
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

	$card
		.children()
		.eq(2)
		.text(`Temp:  ${obj.main.temp}°C`);

	$card
		.children()
		.eq(3)
		.text(`Wind:  ${obj.wind.speed} mpH`);

	$card
		.children()
		.eq(4)
		.text(`Humidity: ${obj.main.humidity}%`);
}



function appendForecastNodes() {
	for (let i = 0; i <= 4; i++) {
		$(".cards").append(
			$("<div><h4></h4><img/><p></p><p></p><p></p></div>")
		);
	}

	$(".cards").children().eq(0).addClass("card-zero");
	$(".cards").children().eq(1).addClass("card-one");
	$(".cards").children().eq(2).addClass("card-two");
	$(".cards").children().eq(3).addClass("card-three");
	$(".cards").children().eq(4).addClass("card-four");
}

function appendTodayNodes() {
	// Append empty node elements for Today
	$(".today").append(
		$("<h2>"),
		$("<h3>").addClass("normal"),
		$("<img>"),
		$("<p>"),
		$("<p>"),
		$("<p>")
	);
	appendForecastNodes();
	// populateToday() will update text content to display
	// INVOKE ON PAGE LOAD
	// This stops node elements from been duplicated when additional locations are checked
}

// Uses weather data to populate Today's weather
function populateToday(id, d) {
	// Update content of appended node elements

	// format the date to display
	let dateFormat = new Date(d.dt * 1000).toLocaleString();
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

// CLEAR weather data shown
$(".form").on("click", ".form-btn", function (e) {
	e.preventDefault();

	// DOM traversal to access the value from city / country input
	let city = $(this).parent().children().eq(2).val();
	let country = $(this).prev().val();
	getLatLon(city, country);
	let addHistory = `${city}, ${country}`;

	if (storage.includes(addHistory)) {
		// CLEAR input fields
		$(":input", ".form").val("");
	} else {
		storage.push(addHistory);
		$(":input", ".form").val("");
	}

	setLocalStorage();
});

init();
// TEST THAT LOCAL STORAGE WHEN CLICKED WILL OPEN WEATHER FOR THAT LOCATION
$(".btn").on("click", function () {
	let thisBtnId = $(this).attr("id");
	getLatLon(thisBtnId);
});
