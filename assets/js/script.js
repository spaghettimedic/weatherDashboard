var userInput = "";
var lat = [];
var lon = [];
var counter = 1;

var getLatLon = function() {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&units=imperial&appid=126fddb2bf227e0327010f96d6495a39")
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        lat.push(data.coord.lat);
        lon.push(data.coord.lon);
    })
};

var getWeather = function() {
    var requestTodayUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat[0] + "&lon=" + lon[0] + "&units=imperial&appid=126fddb2bf227e0327010f96d6495a39";
    var request5DayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + userInput + "&units=imperial&appid=f57097d5fc9509b14eb672d6357fe102";
        
    fetch(requestTodayUrl)
    .then(function(response) {
        console.log(response);
        return response.json();
    }).then(function(data) {
        console.log(data);

        var icon = data.current.daily.weather.icon;
        var date = "(" + moment().format("MM/DD/YYYY") + ")";
        var temp = data.daily.temp.day + "\xB0" + "F";
        var wind = data.daily.wind_speed + " MPH";
        var humidity = data.daily.humidity + "%";
        var UVIndex = data.daily.uvi;

        // dynamically create elements for daily forecast here
        var todayHeader = $("<h4>").html("<span class='todayHeader'>" + date + " " + "<img src='http://openweathermap.org/img/wn/" + icon + "@2x.png'></span>");
        var pTemp = $("<p>").addClass("mb-2").html("Temp: <span>" + temp + "</span>");
        var pWind = $("<p>").addClass("mb-2").html("Wind: <span>" + wind + "</span>");
        var pHumidity = $("<p>").addClass("mb-2").html("Humidity: <span>" + humidity + "</span>");
        var pUVIndex = $("<p>").addClass("mb-2").html("UV Index: <span id='UVI'>" + UVIndex + "</span>");
        
        if (UVIndex > 4) {
            $("#UVI").addClass("bg-warning border-warning rounded");
        } else if (UVIndex > 8) {
            $("#UVI").addClass("bg-danger border-danger rounded");
        } else {
            $("#UVI").addClass("bg-success border-success rounded");
        };

        $("#weatherToday").append(todayHeader, pTemp, pWind, pHumidity, pUVIndex);
    });
    
    fetch(request5DayUrl)
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        var cityName = data.city.name;
        $("<span>" + cityName + "</span>").insertBefore(".todayHeader");

        for (var i = 0; i < data.list.length; i++) {
            if (i === 6 || i === 14 || i === 22 || i === 30 || i === 38) {

                var date = moment().add(counter, "days").format("MM/DD/YYYY");
                var icon = data.list[i].weather[0].icon;
                var temp = data.list[i].main.temp + "\xB0" + "F";
                var wind = data.list[i].wind.speed + " MPH";
                var humidity = data.list[i].main.humidity + "%";

                // dymanically create elements for 5 day forecast here
                var pDate = $("<p>").addClass("card-text text-white border-0").text(date);
                var pIcon = $("<p>").addClass("card-text text-white border-0").html("<img src='http://openweathermap.org/img/wn/" + icon + "@2x.png'></span>");
                var pTemp = $("<p>").addClass("card-text text-white border-0").text("Temp: " + temp);
                var pWind = $("<p>").addClass("card-text text-white border-0").text("Wind: " + wind);
                var pHumidity = $("<p>").addClass("card-text text-white border-0").text("Humidity: " + humidity);

                $("#card" + counter).append(pDate, pIcon, pTemp, pWind, pHumidity);

                counter++;
            };
        };
    });
};

$("#search").click( function(event) {
    event.preventDefault();
    userInput = $("#userInput").val();
    $.ajax({
        url: getLatLon(),
        success: function() {
            getWeather();
        }
    });
});
