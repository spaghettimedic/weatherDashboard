var userInput = "";
var lat = "";
var lon = "";
var counter = 1;
var savedCities = [];

var createCityButton = function(cityName) {
    var savedCityBtn = $("<button>").addClass("border-0 btn btn-secondary my-2 py-0 col-10 mx-auto text-dark btn-city").attr("type", "button").text(cityName);

    $("#cityBtnContainer").append(savedCityBtn);
};

var loadSavedCities = function() {
    if (savedCities === "") {
        localStorage.setItem("savedCities", JSON.stringify(savedCities));
    };
    savedCities = JSON.parse(localStorage.getItem("savedCities"));
    // clear all city buttons so they can be regenerated without being repeated
    $("#cityBtnContainer").html("");

    // create for loop to create button elements for each city in var savedCities
    for (var i = 0; i < savedCities.length; i++) {
        var cityName = savedCities[i];
        createCityButton(cityName);
    };
};

var getLatLon = function(userInput) {
    var getLatLonUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&units=imperial&appid=126fddb2bf227e0327010f96d6495a39"

    fetch(getLatLonUrl)
    .then(function(response) {
        $.ajax({
            url: getLatLonUrl,
            type: "POST",
            statusCode: {
                404: function() {
                    alert('"' + userInput + '"' + " is not a valid City name. Please try again!");
                    return;
                }
            }
        });
        return response.json();
    }).then(function(data) {
            lat = data.coord.lat;
            lon = data.coord.lon;
    }).then(function() {
        getToday();
        return userInput;
    });
};

var getToday = function() {
    var requestTodayUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=126fddb2bf227e0327010f96d6495a39";
        
    fetch(requestTodayUrl)
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        createToday(data);
    }).then(function() {
        get5Day(userInput);
    });
};

var createToday = function(data) {
    var icon = data.current.weather[0].icon;
    var date = "(" + moment().format("MM/DD/YYYY") + ")";
    var temp = data.current.temp + "\xB0" + "F";
    var wind = data.current.wind_speed + " MPH";
    var humidity = data.current.humidity + "%";
    var UVIndex = data.current.uvi;

    // dynamically create elements for daily forecast here
    var todayHeader = $("<h4>").attr("id", "todayHeaderh4").html("<span class='todayHeader'>" + date + " " + "<img src='http://openweathermap.org/img/wn/" + icon + "@2x.png'></span>");
    var pTemp = $("<p>").addClass("mb-2").html("Temp: <span>" + temp + "</span>");
    var pWind = $("<p>").addClass("mb-2").html("Wind: <span>" + wind + "</span>");
    var pHumidity = $("<p>").addClass("mb-2").html("Humidity: <span>" + humidity + "</span>");

    $("#weatherToday").append(todayHeader, pTemp, pWind, pHumidity);
    
    if (UVIndex > 4) {
        var pUVIndex = $("<p>").addClass("mb-2").html("UV Index: <span class='bg-warning border-warning rounded text-white px-2 py-1' id='UVI'>" + UVIndex + "</span>");
        $("#weatherToday").append(pUVIndex);
    } else if (UVIndex > 8) {
        var pUVIndex = $("<p>").addClass("mb-2").html("UV Index: <span class='bg-danger border-danger rounded text-white px-2 py-1' id='UVI'>" + UVIndex + "</span>");
        $("#weatherToday").append(pUVIndex);
    } else {
        var pUVIndex = $("<p>").addClass("mb-2").html("UV Index: <span class='bg-success border-success rounded text-white px-2 py-1' id='UVI'>" + UVIndex + "</span>");
        $("#weatherToday").append(pUVIndex);
    };
};

var get5Day = function(userInput) {
    var request5DayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + userInput + "&units=imperial&appid=f57097d5fc9509b14eb672d6357fe102";
    
    fetch(request5DayUrl)
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        create5Day(data);
        return data;
    }).then(function() {
        loadSavedCities();
    });
};

var create5Day = function(data) {
    var cityName = data.city.name;
    savedCities.push(cityName);

    // check if there are any duplicate cities and remove them from savedCities
    var filteredSavedCities = savedCities.filter((item, index) => savedCities.indexOf(item) === index);
    savedCities = filteredSavedCities;
    if (savedCities.length > 5) {
        savedCities = savedCities.slice(1)
    };

    localStorage.setItem("savedCities", JSON.stringify(savedCities));
    $("<span>" + cityName + " </span>").insertBefore(".todayHeader")

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
    counter = 1;
};

$("#search").click(function(event) {
    event.preventDefault();

    $("#todayHeaderh4").remove();
    $("p").remove();

    userInput = $("#userInput").val();
    getLatLon(userInput);

    $("#userInput").val("");
});

$("#cityBtnContainer").on("click", ".btn-city", function(event) {
    event.preventDefault();

    $("#todayHeaderh4").remove();
    $("p").remove();

    userInput = $(this).text()
    getLatLon(userInput);
});

// clears all cities on button click
$("#delete").click(function(event) {
    event.preventDefault();
    $("#cityBtnContainer").empty();
    savedCities = [];
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
});

$(document).ready(loadSavedCities);
