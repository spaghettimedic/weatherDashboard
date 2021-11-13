var userInput = "";
var dateCounter = 1;

var searchBtn = document.getElementById("search");
var weatherToday = document.getElementById("weatherToday");
var fiveDayForecast = document.getElementById("fiveDayForecast");

$(".btn").click( function(event) {
    event.preventDefault();

    userInput = $("#userInput").val();
    var requestTodayUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&units=imperial&appid=126fddb2bf227e0327010f96d6495a39";
    var request5DayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + userInput + "&units=imperial&appid=126fddb2bf227e0327010f96d6495a39";

    fetch(requestTodayUrl)
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);

        var cityName = data.name;
        var date = "(" + moment().format("MM/DD/YYYY") + ")";
        var temp = data.main.temp + "\xB0" + "F";
        var wind = data.wind.speed + " MPH";
        var humidity = data.main.humidity + "%";
        var icon = data.weather[0].icon;

        // dynamically create elements for daily forecast here
    });
    
    fetch(request5DayUrl)
    .then(function(response) {
    }).then(function(data) {

        for (var i = 0; i < data.list.length; i++) {
            if (i === 6 || i === 14 || i === 22 || i === 30 || i === 38) {
                var date = moment().add(dateCounter, "days").format("MM/DD/YYYY");
                var temp = data.list[i].main.temp + "\xB0" + "F";
                var wind = data.list[i].wind.speed + " MPH";
                var humidity = data.list[i].main.humidity + "%";
                var icon = data.list[i].weather[0].icon;

                // dymanically create elements for 5 day forecast here

                dateCounter++;
            };
        };
    });
});