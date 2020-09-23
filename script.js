$(document).ready(function (){
    //global distance variable, might just pass this in as an argument to the apis
    var dist = 10
    //will hold the favoite cards the user clicks on Or maybe just ONE????
    var favorites = { hikes:[], grub:[] }
    
        //on click of search button
    $("#search-btn").on("click", function (){
        //get the term the user has searched by
        var term = $("#location-input").val();
        //seting the global variable for api calls of radius
        //TODO: Need to put in an if statement to only update if the user doesn't enter a search, then we can default to the hard coded 10
        dist = $("#radius-input").val();
        //fire first function in the link
        geoData(term);
    })
    
    //Dropdown button initializer
      $('.dropdown-trigger').dropdown();
    
    //TODO: add jquery click listener to #currentLocation
        //this listener skips the geodata() function
        //navigator.geolocation
        //GeoLocation.getCurrentPostion
        //parse geolcation return into lat and long variables
        //set dist equal to the search value, with if check outlined in our button onclick
        //fire hikingData, yelpData, weatherData pasing the lat/long/dist arguments


    //TODO: add listener onto the hike / beer button
        //hides and unhides the different card buckets
        //checks to see which one is active
        //on change switch which result-container is hidden

    //TODO: add listener on card to check if it's checked
        //if clicked change the class form unchecked to checked
        //pushes that item to array of favorited items in global variables

    //function for calling nomination geocoding service
    function geoData (searchTerm) {
        //https://nominatim.org/release-docs/develop/api/Search/
        //calling the geocode a term, so we can get a lat/long
        //get the gecode using the term\
        console.log(`"***************You are looking within ${dist} of: ${searchTerm}*****************`)
        $.get(`https://nominatim.openstreetmap.org/?q=${searchTerm}&addressdetails=1&countrycodes=US&format=json&limit=1`, function(response){
            console.log("------------Geolocation api--------------")  
            //log the hiking object
            console.log(response)
            //latitude
            var lat = response[0].lat
            //longitude
            var long = response[0].lon
            //fire all the api request using lat long and global dist variable
            hikingData(lat, long, dist)
            yelpData(lat, long, dist)
            weatherData(lat, long)
            console.log("--------------End Geolocation api ---------------")

            })
    }
    
    //function to hit hiking data take in args from geoData
    function hikingData (lat, long, dist){
        //https://www.hikingproject.com/data
        //api key for hking projet
        var hikingAPI = '200921607-a699ee88fe046c36c0221ff849e49662'
        //search by lat/long using a max distance global var
        var urlQuery = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=${dist}&key=${hikingAPI}`
        //get urlQuery
        $.get(urlQuery, function (response) {
            console.log("----------hiking api-------------")
            //response hiking object
            var hikes = response.trails
            console.log(`hikes returned firing buildHike`, hikes)
            console.log("--------------End hiking API --------------")
            buildHike(hikes);
        })
        //fire hikeBUild function passing in the array of objects as an argument
    }
    
    //function for getting yelp data
    function yelpData(lat, long, dist){
        //https://www.yelp.com/developers/documentation/v3/business_search
        //api key
        var yelpAPI = 'qKOC1kAZU2-2x7naO5Epsn00-qErSCTjFvWpQ5ShX-JZ_iyUxKhsS7uGB7A7Tj2dws4OzHLGIJcc8xOScqtHQBVV_5-wtpbgshzys3tHfqKMfXawn014lTTg-9ehXnYx'
        //using the cors anywhere hack to get around cros, searching using lat long
        //TODO: need to dial in the radius query
        var urlQuery = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=beer&latitude=${lat}&longitude=${long}`
        //calling this is a little different since it needs an authorization header
        $.ajax({
            method:"GET",
            headers:{
                Authorization:`Bearer ${yelpAPI}`
            },
            url:urlQuery
        }).then(function (response){
            console.log("---------------------Yelp API---------------------")
            console.log(response);
            //TODO: build and array of yelp objects to pass to the build function
            console.log("---------------------END Yelp API---------------------")
        })
        //fire yelpBuild function passing in the array of objects as the argument
    }

    //function for getting weather data
    function weatherData(lat, long){  
        // var alertWeatherAPI = 'c56b8c5094d7dabc849248635865a867'
        var urlQuery = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=imperial&appid=c56b8c5094d7dabc849248635865a867`
        //TODO: figure out alert OR just use the current weather...
        $.ajax({
            method:"GET",
            url:urlQuery
        }).then(function (response){
            console.log("---------------------Weather API---------------------")
            console.log(response);
            //TODO: build the weather object response
            // making this just and object instead of array
            var weatherDetails = {
                    //TODO: Need to add if statement if there is no alert
                    // 
                    // Grabs max high temp for the day
                    temperature: response.daily[0].temp.max,
                    // Grabs current weather conditons as a text string
                    conditions: response.daily[0].weather[0].description,
                    // Grabs current weather conditions as an icon
                    currentConditonIcon: `https://openweathermap.org/img/wn/${response.daily[0].weather[0].icon}@2x.png`

            }
            console.log(weatherDetails)
            console.log("---------------------END Weather API---------------------")
            
        })
        //TODO: Fire the function to build fill in our weather info with weather object as argument keys to match ids of DOM elements
    }


    //TODO: buildYelp function
        //Jquery.each (or standard for, forEach) function passing in array of objects
            //create div class = card unchecked
            //create h, p, imgs
            //set text, src, alt etc.
            //div.append(h, p, imgs, etc)
            //result-container-hike.append(div)

    function buildHike (hikes) {
        console.log(hikes)
        //for each element(hike) in array hikes
        hikes.forEach(hike => {
            //These three vars convert the camel case difficulty to real words
            var text = hike.difficulty;
            var result = text.replace( /([A-Z])/g, " $1" );
            var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
            //Array of our content to loop through to build contentDiv
            var pContentArray =[
                `Total Elevation: ${hike.ascent} ft`,
                `Conditions: ${hike.conditionDetails}`,
                `Date of condtion: ${hike.conditionDate.slice(0,10)}`,
                `Difficulty: ${finalResult}`,
                `Length: ${hike.length}mi`,
                `Rating: ${hike.stars}`,
                `More info: <a href='${hike.url}'>hiking Project</a>`
            ]
            //create the card dive to hold everything
            var cardDiv = $("<div class='card'>")
                //create the image div
                var cardImgDiv = $("<div class='card-image'>")
                    //create the img element
                    var img = $("<img>")
                    //add the src from our hike loop
                    img.attr("src", hike.imgMedium)
                    //TODO: setting the width/height, remove once css in style fixes
                    img.css({'width' : '300px' , 'height' : '300px'})
                    //create a div for the title of the hike/card
                    var titleSpan = $("<span class='card-title'>")
                    //set the text of the title
                    titleSpan.text(hike.name)
                //append the image and the title to the card image div
                cardImgDiv.append(img, titleSpan)
                //create the div for the content
                //TODO: THis is where we build out maybe a li or more ps for the various items of info
                var contentDiv = $("<div class='card-content'>")
                    //loop through our p content array to fill 'er up.
                    pContentArray.forEach(info => {
                        //acutally create the p for content
                        var contentP = $("<p>");
                        //put in the content
                        contentP.html(info)
                        //append the p to the contentDiv
                        contentDiv.append(contentP)
                    })
                    
                    //fill the p with the hike content summary
                    // contentP.text(hike.summary)
                //add the p contents to the contend div container
                // contentDiv.append(contentP)
                //create a div to hold hte action button
                var actionDiv = $("<div class='card-action'>")
                    //TODO this will be where we have a save button
                    var a = $("<a>")
                    //TODO Filler content, needs to be hooked up to save
                    a.attr("href", "https://www.hikingproject.com/trail/7089027/pioneer-park")
                //add the actions to the actionDiv
                actionDiv.append(a)
            //append all card content div containers to the card container
            cardDiv.append(cardImgDiv, contentDiv, actionDiv )
            //append the card into the html section in index for result-container
            $(".hiking-results").append(cardDiv)
            
            
        });
        
    }
            //TODO: buildYhike function
        //Jquery.each (or standard for, forEach) function passing in array of objects
            //create div class = card unchecked hike
            //create h, p, imgs
            //set text, src, alt etc.
            //div.append(h, p, imgs, etc)
            //result-container-grub.append(div)
    

    //TODO: updateWather function
        //takes the weather object and systmatically updates the DOM elements that needs updating
        //temp, conditions, icon, alerts

    
})
