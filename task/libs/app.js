let timeLapse;
const preLoader = () => {
  timeLapse = setTimeout(showPage, 3000);
}

const showPage = () => {
    document
      .getElementById('preloader')
      .style
      .display = 'none';
  }

  showPage();

  $('#weatherBtn').click(function () {
    // console.log('3....2....1 Testing :P');
    $.ajax({
        url: 'libs/weatherStation.php',
        type: 'GET',
        dataType: 'json',
        success: function(result){
            console.log(JSON.stringify(result));
            //console.log(result["weatherObservation"]["stationName"]);
            $('#results').empty();
            $('#results').append('Weather-Station Name: ' + result["weatherObservation"]["stationName"]);
        }
    })
})

$('#cityBtn').click(function () {
    // console.log('3....2....1 Testing :P');
    $.ajax({
        url: 'libs/cityName.php',
        type: 'GET',
        dataType: 'json',
        success: function(result){
            //console.log(JSON.stringify(result));
            //console.log(result["geonames"])
            //array 10
            const countries = result["geonames"]
            //console.log(countries)
            const countryByName = countries.filter(val => val.name === 'Beijing');
            //console.log(countryByName);
            $('#results').empty();
            $('#results').append('Capital of China: ' + countryByName.map(val => val.name));
        }
    })
})

$('#earthquakeBtn').click(function () {
    // console.log('3....2....1 Testing :P');
    $.ajax({
        url: 'libs/earthquake.php',
        type: 'GET',
        dataType: 'json',
        success: function(result){
            //console.log(JSON.stringify(result));
            const earthquakes = result["earthquakes"];
            //console.log(earthquakes)
            const earthquakeFilter = earthquakes.filter(val  => val.depth === 24.4);
            console.log(earthquakeFilter);
            //decontstructuring
            const [{datetime, depth}] = earthquakeFilter;
            console.log(depth)
            $('#results').empty();
            $('#results').append('The date of this earthquake was: ' + datetime + ' and the magnitude was ' + depth + '.' );
        }
    })
})

            
          
                   
                
        
