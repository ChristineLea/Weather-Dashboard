const searchBtn = $("#search");

let searchHistory = [];
function setLocalStorage(city, country) {
	// add new key value pairs for each result

	let addHistory = `${city}, ${country}`;
	// let cityKey = city;
	// let addHistory = [{ [cityKey]: `${city}, ${country}` }];

	searchHistory.push(addHistory);
	console.log(searchHistory);
	localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

function getLatLon(city, country) {
	setLocalStorage(city, country);

	const apiKey = "7efeea0385eeddc77479b9ad9143d71b";
	let locationUrl =
		"http://api.openweathermap.org/geo/1.0/direct?q=" +
		city +
		"," +
		country +
		"&limit=1&appid=" +
		apiKey;

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

function getWeatherApi(lat, lon) {
	const key = "7efeea0385eeddc77479b9ad9143d71b";
	let latitude = lat;
	let longitude = lon;
	let requestUrl =
		"https://api.openweathermap.org/data/2.5/forecast?lat=" +
		latitude +
		"&lon=" +
		longitude +
		"&units=metric&appid=" +
		key;

	fetch(requestUrl)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			for (let i = 7; i <= 40; i += 8) {
				// cycle through cards
				let dataList = data.list[i];
				populate(dataList);
			}
			let requestLocation = data.city.name;
			console.log(requestLocation);
			let todayData = data.list[0];
			populateToday(requestLocation, todayData);
		});
}

function populate(list) {
	let dateData = list.dt;
	let iconData = list.weather[0].icon;
	let tempData = list.main.temp;
	let windData = list.wind.speed;
	let humidityData = list.main.humidity;

	let dateFormat = new Date(dateData * 1000).toLocaleString();
	let date = dayjs(dateFormat).format("ddd, DD MMM");

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
	let cardsGrid = $(".cards");
	cardEl.append(dateEl, iconEl, tempEl, windEl, humidityEl);
	cardsGrid.append(cardEl);
}

function populateToday(id, d) {
	let locationData = id;
	let dateData = d.dt;
	let iconData = d.weather[0].icon;
	let tempData = d.main.temp;
	let windData = d.wind.speed;
	let humidityData = d.main.humidity;

	let dateFormat = new Date(dateData * 1000).toLocaleString();
	let date = dayjs(dateFormat).format("dddd, DD MMM");

	let locationEl = $("<h2>").text(locationData);
	let dateEl = $("<h3>").text(date);
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

	let todayEl = $(".today");
	todayEl.append(locationEl, dateEl, iconEl, tempEl, windEl, humidityEl);
}

// CLEAR weather data shown
$(".form").on("click", ".form-btn", function (e) {
	e.preventDefault();
	let cityId = $(this).parent().children().eq(2).val();
	console.log(cityId);
	let countryId = $(this).prev().val();

	$(":input", ".form").val("");
	getLatLon(cityId, countryId);
});
