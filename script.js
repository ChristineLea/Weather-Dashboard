// test fetch & API
let obj;

function getWeatherApi() {
	let requestUrl =
		"https://api.openweathermap.org/data/2.5/forecast?lat=-37.81&lon=144.96&units=metric&appid=7efeea0385eeddc77479b9ad9143d71b";

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
	let date = dayjs(dateFormat).format("dddd, DD MMM");

	let dateEl = $("<h3>").addClass("card-title").text(date);
	let iconEl = $("<img>")
		.attr(
			"src",
			"https://openweathermap.org/img/wn/" + iconData + "@2x.png"
		)
		.addClass("card-icon");
	let tempEl = $("<p>").addClass("temp pd-xs").text(`Temp: ${tempData} °C`);
	let windEl = $("<p>").addClass("wind pd-xs").text(`Wind: ${windData} MPH`);
	let humidityEl = $("<p>")
		.addClass("humidity pd-xs")
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

	let locationEl = $("<h2>").addClass("location").text(locationData);
	let dateEl = $("<h3>").addClass("date").text(date);
	let iconEl = $("<img>").addClass("icon")
		.attr(
			"src",
			"https://openweathermap.org/img/wn/" + iconData + "@2x.png"
		)

	let tempEl = $("<p>").addClass("info").text(`Temp: ${tempData} °C`);
	let windEl = $("<p>").addClass("info").text(`Wind: ${windData} MPH`);
	let humidityEl = $("<p>")
		.addClass("info")
		.text(`Humidity: ${humidityData} %`);

	let todayEl = $(".today");
	todayEl.append(locationEl, dateEl, iconEl, tempEl, windEl, humidityEl);
}
