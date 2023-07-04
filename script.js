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
			let todayData = data.list[0];
			populateToday(todayData);
		});
}

function populate(d) {
	let dateData = d.dt;
	let iconData = d.weather[0].icon;
	let tempData = d.main.temp;
	let windData = d.wind.speed;
	let humidityData = d.main.humidity;

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

function populateToday(d) {
	let dateData = d.dt;
	let iconData = d.weather[0].icon;
	let tempData = d.main.temp;
	let windData = d.wind.speed;
	let humidityData = d.main.humidity;

	let dateFormat = new Date(dateData * 1000).toLocaleString();
	let date = dayjs(dateFormat).format("dddd, DD MMM");

	let dateEl = $("<h2>").text(date);
	let iconEl = $("<img>")
		.attr(
			"src",
			"https://openweathermap.org/img/wn/" + iconData + "@2x.png"
		)

	let tempEl = $("<p>").text(`Temp: ${tempData} °C`);
	let windEl = $("<p>").text(`Wind: ${windData} MPH`);
	let humidityEl = $("<p>")
		.text(`Humidity: ${humidityData} %`);

	let today = $(".today");
	today.append(dateEl, iconEl, tempEl, windEl, humidityEl);
}
