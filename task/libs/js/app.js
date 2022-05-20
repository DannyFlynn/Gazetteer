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
    //console.log('3....2....1 Testing :P');
    $.ajax({
        url: 'libs/php/weatherStation.php',
        type: 'POST',
        dataType: 'json',
        data: {
            latt: $('#weatherInput').val()
        },
        success: function(result){
            //console.log(JSON.stringify(result));
            //console.log(result["weatherObservation"]["stationName"]);
            $('#results').empty();
            $('#results').append('Weather-Station Name: ' + result["weatherObservation"]["stationName"]);
        }
    })
})

$('#cityBtn').click(function () {
    //console.log('3....2....1 Testing :P');
    $.ajax({
        url: 'libs/php/cityName.php',
        type: 'POST',
        dataType: 'json',
        data: {
            north: $('#cityName').val()
        },
        success: function(result){
            //console.log(JSON.stringify(result));
            //console.log(result["geonames"]);
            //array 10
            const countries = result["geonames"];
            //console.log(countries);
            $('#results').empty();
            $('#results').append(countries[0]["name"] + ' has a population of ' + countries[0]["population"]);
        }
    })
})

$('#earthquakeBtn').click(function () {
        //console.log('3....2....1 Testing :P');
        $.ajax({
        url: 'libs/php/earthquake.php',
        type: 'POST',
        dataType: 'json',
        data: {
            earthquake: $('#earthquakeInfo').val()
        },
        success: function(result){
            //console.log(JSON.stringify(result));
            const earthquakes = result["earthquakes"]; 
            //console.log(earthquakes);
            //decontstructuring
            const {datetime, depth} = earthquakes[0];
            //console.log(datetime);
            $('#results').empty();
            $('#results').append('The date of this earthquake was: ' + datetime + ' and the magnitude was ' + depth + '.' );
        } 
    }) 
})

            
          
                   
                
        
