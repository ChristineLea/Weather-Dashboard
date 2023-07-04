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
				let dateData = dataList.dt;
				let iconData = dataList.weather[0].icon;
				let tempData = dataList.main.temp;
				let windData = dataList.wind.speed;
				let humidityData = dataList.main.humidity;

				let dateFormat = new Date(dateData * 1000).toLocaleString();
				let date = dayjs(dateFormat).format("DD MMM");

				let dateEl = $("<h3>").addClass("card-title").text(date);
				let iconEl = $("<img>")
					.attr(
						"src",
						"https://openweathermap.org/img/wn/" + iconData + "@2x.png"
					)
					.addClass("card-icon");
				let tempEl = $("<p>")
					.addClass("temp pd-xs")
					.text(`Temp: ${tempData} °C`);
				let windEl = $("<p>")
					.addClass("wind pd-xs")
					.text(`Wind: ${windData} MPH`);
				let humidityEl = $("<p>")
					.addClass("humidity pd-xs")
					.text(`Humidity: ${humidityData} %`);
				
				let cardEl = $("<div>").addClass("card");
				let cardsGrid = $(".cards");
				cardEl.append(dateEl, iconEl, tempEl, windEl, humidityEl);
				cardsGrid.append(cardEl);
			}
// let date1 = data.list[8].dt;
// let icon1 = data.list[8].weather[0].icon;
// let temp1 = data.list[8].main.temp;
// let wind1 = data.list[8].wind.speed;
// let humidity1 = data.list[8].main.humidity;

// let dateFormat = new Date(date1 * 1000).toLocaleString();
// let date = dayjs(dateFormat).format("DD MMM");

// let dateEl = $("<h3>").addClass("card-title").text(date);
// let iconEl = $("<img>")
// 	.attr("src", "https://openweathermap.org/img/wn/" + icon1 + "@2x.png")
// 	.addClass("card-icon");
// let tempEl = $("<p>").addClass("temp pd-xs").text(`Temp: ${temp1} °C`);
// let windEl = $("<p>").addClass("wind pd-xs").text(`Wind: ${wind1} MPH`);
// let humidityEl = $("<p>")
// 	.addClass("humidity pd-xs")
// 	.text(`Humidity: ${humidity1} %`);

// let cardEl = $(".card");
// cardEl.append(dateEl, iconEl, tempEl, windEl, humidityEl);


			// let date1 = data.list[8].dt;
			// let icon1 = data.list[8].weather[0].icon;
			// let temp1 = data.list[8].main.temp;
			// let wind1 = data.list[8].wind.speed;
			// let humidity1 = data.list[8].main.humidity;

			// let dateFormat = new Date(date1 * 1000).toLocaleString();
			// let date = dayjs(dateFormat).format("DD MMM");

			// let dateEl = $("<h3>").addClass("card-title").text(date);
			// let iconEl = $("<img>").attr(
			// 	"src",
			// 	"https://openweathermap.org/img/wn/" + icon1 + "@2x.png"
			// ).addClass("card-icon");
			// let tempEl = $("<p>").addClass("temp pd-xs").text(`Temp: ${temp1} °C`);
			// let windEl = $("<p>").addClass("wind pd-xs").text(`Wind: ${wind1} MPH`);
			// let humidityEl = $("<p>").addClass("humidity pd-xs").text(`Humidity: ${humidity1} %`);

			// let cardEl = $(".card");
			// cardEl.append(dateEl, iconEl, tempEl, windEl, humidityEl);
		});
}
