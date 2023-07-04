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
			let date1 = data.list[8].dt;
			let icon1 = data.list[8].weather[0].icon;
			let temp1 = data.list[8].main.temp;
			let wind1 = data.list[8].wind.speed;
			let humidity1 = data.list[8].main.humidity;

			let dateFormat = new Date(date1 * 1000).toLocaleString();
			let date = dayjs(dateFormat).format("DD MMM");

			let dateEl = $("<h3>").addClass("card-title").text(date);
			let iconEl = $("<img>").attr(
				"src",
				"https://openweathermap.org/img/wn/" + icon1 + "@2x.png"
			).addClass("card-icon");
			let tempEl = $("<p>").addClass("temp").text(`Temp: ${temp1} °C`);
			let windEl = $("<p>").addClass("wind").text(`Wind: ${wind1} MPH`);
			let humidityEl = $("<p>").addClass("humidity").text(`Humidity: ${humidity1} %`);

			let cardEl = $(".card");
			cardEl.append(dateEl, iconEl, tempEl, windEl, humidityEl);
		});
}
