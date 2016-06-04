var currentUnit = 'F';

var iconMap = {};
iconMap['clear-day'] = 'wi-forecast-io-clear-day';
iconMap['clear-night'] = 'wi-forecast-io-clear-night';
iconMap['rain'] = 'wi-forecast-io-rain';
iconMap['snow'] = 'wi-forecast-io-snow';
iconMap['sleet'] = 'wi-forecast-io-sleet';
iconMap['wind'] = 'wi-forecast-io-wind';
iconMap['fog'] = 'wi-forecast-io-fog';
iconMap['cloudy'] = 'wi-forecast-io-cloudy';
iconMap['partly-cloudy-day'] = 'wi-forecast-io-partly-cloudy-day';
iconMap['partly-cloudy-night'] = 'wi-forecast-io-partly-cloudy-night';
iconMap['hail'] = 'wi-forecast-io-hail';
iconMap['thunderstorm'] = 'wi-forecast-io-thunderstorm';
iconMap['tornado'] = 'wi-forecast-io-tornado';

function getPosition() {

  return $.Deferred(deferred => navigator.geolocation.getCurrentPosition(deferred.resolve, deferred.reject));

};

function getWeather(position) {

  const url = `https://api.forecast.io/forecast/83f436fc1b093e004912f28e87f08d9e/${position.coords.latitude},${position.coords.longitude}?callback=?`;

  return $.getJSON(url).then((data) => data);

}

function getLocationName(position) {

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyChcQU2s3VYM45zsGpXJ1-IIKRpTv0j-aM`;

  return $.getJSON(url).then((data) => data);

}

function celsiusToFarenheit(celsius) {
  return celsius * 1.8 + 32;
}

function farenheitToCelsius(farenheit) {
  return (farenheit - 32) / 1.8;
}

function convert(fromUnit, toUnit) {

  var currentVal = $('#temperature').text();
  var newVal;

  if (fromUnit === 'farenheit') {
    newVal = Math.round(farenheitToCelsius(currentVal));
    $('#unit').text('\xB0C');
    currentUnit = 'C';
  } else {
    newVal = Math.round(celsiusToFarenheit(currentVal));
    $('#unit').text('\xB0F');
    currentUnit = 'F';
  }

  $('#temperature').text(newVal);

}

$(document).ready(function() {

  //FETCH WEATHER
  getPosition()

  .then(position => $.when(getWeather(position), getLocationName(position)), function(err) {
    var URL = 'https://veronikaivhed.com/WeatherApp';
    var errorMessage = `${err.message} Try <a href="${URL}">${URL}</a>.`;
    $('#errorMessage').html(errorMessage);
    $('.loader').hide();
  })

  .then(function(weatherData, locationData) {

    $('#userLocation').text(locationData.results[3].formatted_address);
    $('#weatherDescription').text(weatherData.currently.summary);
    $('#temperature').text(Math.round(weatherData.currently.temperature));
    $('#unit').text('\xB0F');
    $('#weatherIcon').addClass(iconMap[weatherData.currently.icon]);

    $('.loader').hide();
    $('.inner-container').css('opacity', 1);

  });

  //EVENT LISTENERS
  $('#settings').click(function() {
    $('.options').slideToggle();
  });

  $('body').on('click', '#celsius', function() {
    $('.options').slideToggle();
    if (currentUnit != 'C') {
      convert('farenheit', 'celsius');
    }
  });

  $('body').on('click', '#farenheit', function() {
    $('.options').slideToggle();
    if (currentUnit != 'F') {
      convert('celsius', 'farenheit');
    }
  });

});