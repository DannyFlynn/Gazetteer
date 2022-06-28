const map = L.map('map');

let layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

    maxZoom: 19,

    attribution: '© OpenStreetMap'

    }).addTo(map);

$("document").ready(() => {
  
    const selectCountries = document.getElementById('selectCountries');

    //on button click data will be displayed info 
    const newsBtn = document.getElementById('newsBtn');
    const weatherBtn = document.getElementById('weatherBtn');
    const infoBtn = document.getElementById('infoBtn');
    const holidayBtn = document.getElementById('holidayBtn');
    const info  = document.getElementById('info-wrapper');
    const closeInfoBox = document.getElementById('close');
    
    //post request data will go in 1 of the vars below
    let countryInformation;
    let newsDiv; 
    let weatherDiv;
    let nationalHoliday;
    
    //circle marker after info button is clicked
    let circle;
   
    let newsData;
    let options;
    
    let currentLatt;
    let currentLong;
    map.setView([51.505, -0.09], 5);
    //console.log(navigator.geolocation)
    //current postion on load up 
    navigator.geolocation.getCurrentPosition(position => {
        currentLatt = position.coords.latitude;
        //console.log(position.coords.latitude);
        currentLong = position.coords.longitude;
        map.setView([currentLatt, currentLong], 5);
        const marker = L.marker([currentLatt, currentLong]).addTo(map);
        marker.bindPopup("You are Here").openPopup();
    })
    
   

    $.ajax({
        type: 'GET',
        url: "libs/js/json/countryBorders.json",
        data: {},
        dataType: 'json',
        success: function(data) {
           
            const properties = data["features"];
            const geometry = data["features"];
            //console.log(geometry)
            //countries will alphabetical 
            let countrySort = geometry.sort(function(a,b) {
                return a["properties"]["name"].localeCompare(b["properties"]["name"])
            })
            
            
            //Generating options and extracting geo json to apply properties and country names on each individual option
            //console.log(geometry) 

            for(let i = 0; i < countrySort.length; i++){

                options = document.createElement('option');
                options.innerHTML = countrySort[i]["properties"]["name"];
                options.value = countrySort[i]["properties"]["name"];
                options.aTwo = countrySort[i]["properties"]["iso_a2"];
                options.aThree = countrySort[i]["properties"]["iso_a3"];
                options.geometry = countrySort[i]["geometry"];
                
                //console.log(geometry[i]["geometry"]["coordinates"][0][0])
                
                //latitude and longitude
                options.latt = countrySort[i]["geometry"]["coordinates"][0][0].length === 2 ? geometry[i]["geometry"]["coordinates"][0][0][1] : geometry[i]["geometry"]["coordinates"][0][0][0][1]
                options.long = countrySort[i]["geometry"]["coordinates"][0][0].length === 2 ? geometry[i]["geometry"]["coordinates"][0][0][0] : geometry[i]["geometry"]["coordinates"][0][0][0][0]
                //console.log(options.latt)
                
                selectCountries.appendChild(options);
            }
          
          
           
        }
       
    })

   
    
   
   


    //when a country changes it will remove the prev tile layer(map) create a new one with country coordinates and display that country in view
    selectCountries.addEventListener('change', () => { 
        //console.log(selectCountries.options)
    
        for(let i = 0; i < selectCountries.options.length; i++){
           // console.log(selectCountries.options[i]["value"])
           if(selectCountries.value === selectCountries.options[i]["value"]){
                const pinPoint = selectCountries.options[i]["geometry"];
                //console.log(pinPoint)
                layer.remove();
                 
                    layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 9,
                    attribution: '© OpenStreetMap'
                    }).addTo(map);
                    
                    layer = L.geoJSON(pinPoint, {
                    style: function(type) {
                        return {color: 'green'}
                    }
                    }).addTo(map);
                    map.fitBounds(layer.getBounds());

                   
            }
        }   
       
        
    })
     
    //after info button (i) is clicked it will show position on countrys capital :P
     function capitalFlag(capLatt,capLong, capital){
        
         capitalCircle = L.circle([capLong, capLatt], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 5000
            }).addTo(map);

            capitalCircle.bindPopup("Capital: " + capital)
            map.setView([capLong,capLatt], 9)
    
}

//this function is called on weather button click and then will call show weather (weather api needed lat/lon passed below)
function getTheWeather(){
    for(let i = 0; i < selectCountries.options.length; i++){
        //console.log(selectCountries.options[i]["value"])
            if(selectCountries.options[i]["value"] === selectCountries.value){
                showWeather(selectCountries.options[i].latt, selectCountries.options[i].long)
                  
            }
        } 
}



function getHoliday(){
    for(let i = 0; i < selectCountries.options.length; i++){
        
            if(selectCountries.options[i]["value"] === selectCountries.value){
                showHolidayDates(selectCountries.options[i].aTwo);
                  console.log(selectCountries.options[i].aTwo)
            }
        } 
}

    //IF API 'POST' request Fails It will display an error message in the browser

    function apiFail(message){
        const errorDiv = document.createElement('div');
                    const  errorMessage = document.createElement('h4');
                    errorMessage.innerText = message;
                    
                    errorDiv.className = 'errorDiv';

                    $(errorDiv).append(errorMessage);
                    $('#newContent').append(errorDiv);

                    info.style.display = 'block'
                    map.dragging.disable();
                    map.removeControl(map.zoomControl);
                    selectCountries.disabled = true;
    }

   
    //post requests called on button click


    function countryInfo(){
        const adjustCountryName = selectCountries.value.split(" ").join("%20");
        
        //console.log(adjustCountryName)


        $.ajax({
            type: "POST",
            url: "libs/php/getCountryInfo.php",
            dataType: 'json',
            data: {
                country: adjustCountryName
            },
            success: function(result){
                console.log(result);
                const information = result;
        
                //console.log(countryFlag)
                if(information.status === 404 || information.message) {
                   const error = 'Sorry no information at this particular time, please try again later.'
                   apiFail(error);
                } else {
                   
                for(let i = 0; i < information.length; i++){
                    //console.log(information[i]["name"]["common"])

                    const flag = document.createElement('img');
                    flag.src = information[i]["flags"]["png"];
                    flag.alt = "Flag"
                    flag.className = "flagPic";

                    const flags = document.createElement('img');
                    flags.src = information[i]["flags"]["png"];
                    flags.alt = "Flags"

                    const countryName = document.createElement('h4');
                    countryName.innerText = information[i]["name"]["common"];
                    countryName.className = 'countryInfoName';
                    
                    const capital = document.createElement('h4');
                    capital.innerText = `Capital: ${information[i]["capital"]}`;

                    const continents = document.createElement('h4');
                    continents.innerText = `Continent: ${information[i]["continents"]}`;

                    const region = document.createElement('h4');
                    region.innerText = `Region: ${information[i]["region"]}`;

                    const subregion = document.createElement('h4');
                    subregion.innerText = `Sub-Region: ${information[i]["subregion"]}`;
   
                    
                    const population = document.createElement('h4');
                    population.innerText = `Population: ${information[i]["population"]}`;
                    
                    const currencyKey = Object.keys(information[i]["currencies"]);
                    const currencyString = currencyKey.toString();
                    
                    const countryCurrency = information[i]["currencies"][currencyString];
                    //console.log(countryCurrency)
                    const {name, symbol} = countryCurrency;
                    console.log(name)
                    const currency = document.createElement('h4');
                    currency.innerText = `Currency: (${symbol}) ${name}`

                    const countryLogo = document.createElement('img');
                    countryLogo.src = information[i]["coatOfArms"]["png"];
                    countryLogo.alt = "Logo";
                    countryLogo.className = 'countryLogoPic';


                    countryInformation = document.createElement('div');
                    countryInformation.className = "countryInfoDiv"

                    
                    flagCountry = document.createElement('div');
                    flagCountry.className = "flagCountry";
                    flagCountry.append(flag);

                    
                    capitalCountry = document.createElement('div');
                    capitalCountry.className = "capitalCountry";
                    capitalCountry.append(countryName,continents, region, subregion, capital, population, currency);


                    countryInformation.append(flagCountry, capitalCountry);
                    console.log(countryInformation);

                    $('#newContent').append(countryInformation);

                    info.style.display = 'block'
                            map.dragging.disable();
                            map.removeControl(map.zoomControl);
                            selectCountries.disabled = true; 


                    const capitalLatt = information[i]["capitalInfo"]["latlng"][1];
                    const capitalLong = information[i]["capitalInfo"]["latlng"][0];
                    //console.log(capitalLatt, capitalLong)
                   
                    capitalFlag(capitalLatt, capitalLong, information[i]["capital"]);
                }
            }   

            }
        })
    }

    
    function newsInfo(){

  

    

        $.ajax({

            type: 'POST',

            url: "libs/php/news.php",

            dataType: 'json',

            data: {

            country: $('#selectCountries').val()

        }

        }).done(result=>{

            //debugger;

            console.log(result);

               

            const news = result;

            if(news["totalResults"] > 0){

                //console.log(news.articles)

             

                //$('#newContent').empty();

                //Only want 3 stories  of the news shown below

                for(let i = 0; i < news.articles.length; i++){

                    if(i >= 3){

                        break;

                    } else {

                       

                        newsDiv = document.createElement('div');

                        const  newsTitle = document.createElement('h4');

                        const newsDescription = document.createElement('p');

                        const newsUrl = document.createElement('a');

                       

                        newsTitle.innerText = news.articles[i]["title"] + ":";

                        newsDescription.innerText = news.articles[i]["description"];

                        newsUrl.href = news.articles[i]["url"];

                        newsUrl.innerHTML = 'More';

 

                        newsDiv.className = 'newsDiv';

                        newsTitle.className = 'newsTitle';

                        newsDescription.className = 'newsDescription';

                        newsUrl.className = 'newsUrl';

                       

                        $(newsDiv).append(newsTitle,newsDescription, newsUrl);

                       

                        $('#newContent').append(newsDiv);

 

                        info.style.display = 'block'

                        map.dragging.disable();

                        map.removeControl(map.zoomControl);

                        selectCountries.disabled = true;

                      

                    }

       

                }

       

 

            } else {

                const error = "Sorry no news on this country at this particular time, please try again later.";

                apiFail(error);

            }

        }).fail((xhr, status, err) =>{

            //debugger;

            console.log(err);

        })

 

 

    }

    
  
    function showWeather(latt, long){
        //console.log(latt)
     
        $.ajax({
            type: "POST",
            url: "libs/php/weather.php",
            dataType: "json",
            data: {
                latt: latt,
                long: long
            },
            success: function(result){

                console.log(result);
                if(result.message){
                    const error = "Sorry no weather on this country at this particular time, please try again later.";
                    apiFail(error);
                } else {
                const weather = result["weather"]; 

                const weatherExtract = weather.map(data => {
                    return data.description;
                });
                
                //console.log(weatherExtract)
                
                //weather dewscription comes in like clear sky below makes it Clear Sky capital letters[0] :)
                const splitArray = weatherExtract.toString().split(" ");
                let [wordOne, wordTwo] = splitArray;
                let firstWord = wordOne[0].toUpperCase();
                let secondWord = wordTwo[0].toUpperCase();

                 //console.log(wordTwo[0])
                const capWord = wordOne.replace(wordOne[0], firstWord);
                const capWordTwo = wordTwo.replace(wordTwo[0], secondWord);

                const capital = [capWord, capWordTwo];
                //console.log(capital.join(" "))
                const capitalWeatherDescription = capital.join(" ");
                

                const weatherIcon = weather.map(icon => {
                    return icon.icon;
                });

   
                const temp = result["main"]; //object temp and humidty
                const wind = result["wind"];
                const sunRise = result["sys"];
               
                weatherDiv = document.createElement('div');
                weatherDiv.className = 'weatherDiv';
                
                const countryNameWeather = document.createElement('div');
                countryNameWeather.className = 'countryNameWeather';

                const countryWeather = document.createElement('div');
                countryWeather.className = 'countryWeather';

                const countryTemp = document.createElement('div');
                countryTemp.className = 'countryTemp';

                
                const weatherPic = document.createElement('img');
                weatherPic.className = 'weatherPic';
                
                const weatherDescription = document.createElement('h4');
                weatherDescription.innerText = capitalWeatherDescription;
                  
                const degrees = document.createElement('h4');
                degrees.innerText = `Temp: ${temp.temp}\xB0`;

                const humidity = document.createElement('h4');
                humidity.innerText = `Humidity: ${temp.humidity}%`;

                const windSpeed = document.createElement('h4');
                const mph = document.createElement('span');
                mph.innerText = 'mph'
                windSpeed.innerText = `Wind(mph): ${wind.speed}`;

                const sun = document.createElement('h4');
                const unix = sunRise.sunrise;
                let date = new Date(unix * 1000);
                let dateDayHours = date.getHours();
                let dateDayMins = date.getMinutes();
                
                //console.log(getHours)
                 //add a zero to sunrise or sunset time if theres only 1 number 9:15 result  09:15 :)
                const getHours = dateDayHours < 10 ? "0" +  dateDayHours : dateDayHours;
                const getMins = dateDayMins < 10 ? "0" +  dateDayMins : dateDayMins;
                sun.innerText = `Sunrise: ${getHours}:${getMins}(UTC)`;

                const night = document.createElement('h4');
                const unixTwo = sunRise.sunset;
                const nightDate = new Date(unixTwo * 1000);
                const dateNightHours = nightDate.getHours();
                const dateNightMins = nightDate.getMinutes();

               
                const getNightHours = dateNightHours < 10 ? "0" + dateNightHours : dateNightHours;
                const getNightMins = dateNightMins < 10 ? "0" +  dateNightMins : dateNightMins;

                night.innerText = `Sunset: ${getNightHours}:${getNightMins}(UTC)`;
                
                //weather image
                // http://openweathermap.org/img/wn/10d@2x.png   weatherIcon;
                weatherPic.src = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`;
                weatherPic.alt = 'weather picture';
            
                
                $(countryNameWeather).append(selectCountries.value)

                $(countryWeather).append(weatherDescription, weatherPic);

                $(countryTemp).append(degrees, humidity, windSpeed, sun, night);
                //weatherDescription.innerText = `Current Weather: ${weatherExtact}`;
                weatherDiv.append(countryNameWeather, countryWeather, countryTemp);

                $('#newContent').append(weatherDiv);
                
                info.style.display = 'block'
                map.dragging.disable();
                map.removeControl(map.zoomControl);
                selectCountries.disabled = true; 
                            
            }
        }
        })  
  
    }

    

    function showHolidayDates(countryCode){
        //console.log(countryCode)
        $.ajax({
            type: 'POST',
            url: "libs/php/nationalHoliday.php",
            data: {
                countryCode: countryCode
            },
            dataType: 'json',
            success: function(data) {
                
                if(data.response.length === 0){
                    const message = "Sorry no holiday information on this country at this paticular time, please try again later.";
                    apiFail(message);

                } else {
                console.log(data)
             
                const holidayDates = data.response.holidays;
                  console.log(holidayDates)
                   
                //const holidayDates = data;
                //console.log(holidayDates)
                const titleWrap = document.createElement('div');
                titleWrap.className = 'titleWrap';
                
                const title = document.createElement('h4');
                title.innerText = 'National Holidays:'
                title.className = 'holTitle';
                
                const countryTitle = document.createElement('h4');
                countryTitle.innerText = selectCountries.value;
                countryTitle.className = 'countryHolTitle';
                
                titleWrap.append(title, countryTitle);
                $('#newContent').append(titleWrap);

              

                for(let i = 0; i < holidayDates.length; i++){
                    //console.log(holidayDates[i]["name"])
                    if(holidayDates[i]["type"][0].toString() === 'National holiday'){
                    console.log(holidayDates[i])

                    
                    nationalHoliday = document.createElement('div');
                    nationalHoliday.className = 'holContentDiv';
                  
                    const holNames = document.createElement('h4');
                    holNames.innerText = holidayDates[i]["name"];
                    holNames.className = 'holNames'

                    const holDates = document.createElement('h4');
                    holDates.innerText = holidayDates[i]["date"]["iso"];
                    holDates.className = 'holDates';
                   
                    
                   // titleWrap.append(title); 
                    nationalHoliday.append(holNames, holDates);
                    
                    $('#newContent').append(nationalHoliday);

                    info.style.display = 'block';
                    map.dragging.disable();
                    map.removeControl(map.zoomControl);
                    selectCountries.disabled = true; 
                    }

                }
               

                } 

                
                

            }
        })
    }
       

   

    holidayBtn.addEventListener('click', () => {
        getHoliday();
        holidayBtn.disabled = true;
        infoBtn.disabled = true;
        newsBtn.disabled = true;
        weatherBtn.disabled = true;
    });
      
    infoBtn.addEventListener('click', () => {
       countryInfo();
       holidayBtn.disabled = true;
       infoBtn.disabled = true;
       newsBtn.disabled = true;
       weatherBtn.disabled = true;
    });

    newsBtn.addEventListener('click', () => { 
        newsInfo();
        holidayBtn.disabled = true;
        infoBtn.disabled = true;
        newsBtn.disabled = true;
        weatherBtn.disabled = true;
    })

    weatherBtn.addEventListener('click', () => {
        getTheWeather();
        holidayBtn.disabled = true;
        infoBtn.disabled = true;
        newsBtn.disabled = true;
        weatherBtn.disabled = true;
    });


    closeInfoBox.addEventListener('click', () => {
       $('#newContent').empty();
       selectCountries.disabled = false;
       holidayBtn.disabled = false;
       infoBtn.disabled = false;
       newsBtn.disabled = false;
       weatherBtn.disabled = false;
       info.style.display = 'none'
       map.addControl(map.zoomControl)
       map.dragging.enable();
    })
     
})