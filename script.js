$(document).ready(function (){
    //global distance variable, might just pass this in as an argument to the apis
    var dist = 10
    //will hold the favorite cards the user clicks on Or maybe just ONE????
    var favorites = { hikes:[], grub:[] }
    //used to toggle cards on and off
    var cardStatus = {hike: 1, beer: 0}
    //sets term ot the search criteria
    var term = $("#location-input").val();
        //on click of search button
   
    var lat
    var long
    $("#search-btn").on("click", function (){
        $(".beer-results").empty()
        $(".hiking-results").empty()
        //get the term the user has searched by
        term = $("#location-input").val();
        //seting the global variable for api calls of radius
       
        dist = $("#myRange").val();
       // added conditional for grabbing users coordinates
        if(lat){
            hikingData(lat, long, dist)
            yelpData(lat, long, dist)
            weatherData(lat, long)
        }
        else {
        geoData(term);
        }
    })

    //listener that updates the search label on slider change
    $("#myRange").on("change", function(){
        $("#range-label").text($(this).val());
    })
    
    //listener on current location button and prompts user to allow or deny
        $("#currentLocation").on('click', function (){
     var userLocation = navigator.geolocation.getCurrentPosition(showPosition);
        
    // when user accepts for geoloaction, function grabs their lat and long
        function showPosition(position) {
            // Grab coordinates from the given object
            lat = position.coords.latitude;
            long = position.coords.longitude;

            
           
          }

        })


    //adding listener onto the hike / beer button
    $(".tab-btn").on("click", function(){
        //id of the clicked button
        var id = ($(this).attr("id"))
        //check if the click is hike button, and if it's inactive
        if(id === "hikeBtn" && cardStatus.hike === 0 ){
            //switch the status object
            cardStatus.hike = 1
            cardStatus.beer = 0
            //switch the card hidden class on the card divs
            $("#beer-cards").addClass('cardHidden').siblings().removeClass('cardHidden')
        }
        //otherwise check to see if the click was on beer button, and if that one is 
        else if (id === "beerBtn" && cardStatus.beer === 0){
            cardStatus.beer = 1
            cardStatus.hike = 0
            $("#hike-cards").addClass('cardHidden').siblings().removeClass('cardHidden')
        }
       
    })

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
        //api key for hiking project
        var hikingAPI = '200921607-a699ee88fe046c36c0221ff849e49662'
        // HIKING API KEY = '200922231-f42dcac72820a60fd70fc2690b0d09ea' //
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
        //converting distance into meters for use in the api call
        var meters = Math.floor(dist *1609.344)
        //maxes out at 40000meters so if it's greater than that just set to max
        if(meters > 40000 ){
            meters = 40000
        }
        var yelpAPI = 'qKOC1kAZU2-2x7naO5Epsn00-qErSCTjFvWpQ5ShX-JZ_iyUxKhsS7uGB7A7Tj2dws4OzHLGIJcc8xOScqtHQBVV_5-wtpbgshzys3tHfqKMfXawn014lTTg-9ehXnYx'
        // YELP API KEY 'ckxrfqlwmXAxoITQyE0VFgrAVTojMarO9jkT-buj7Kufq3kATlZ-cd18uBYQ7AtM8HNqwLLxPs-iSo79Oaj5kZttTSu0YTCllDHsmCzI-ODlaAMwIfSE5ohCBypuX3Yx' //
        //using the cors anywhere hack to get around cros, searching using lat long
        var urlQuery = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=brewery&latitude=${lat}&longitude=${long}&radius=${meters}&sort_by=rating`
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
            buildYelp (response.businesses);
            console.log("---------------------END Yelp API---------------------")
        })
        //fire yelpBuild function passing in the array of objects as the argument
    }

    //function for getting weather data
    function weatherData(lat, long){  
        var weatherAPI = 'c56b8c5094d7dabc849248635865a867'
        // WEATHER API KEY = '17a9e463090b33048b8d0e143b013660' //
        var urlQuery = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=imperial&appid=${weatherAPI}`
        $.ajax({
            method:"GET",
            url:urlQuery
        }).then(function (response){
            console.log("---------------------Weather API---------------------")
            console.log(response);
            
            // Weather object to be dynamically generated
            var weatherDetails = {
                  
                    // Grabs max high temp for the day
                    temperature: response.daily[0].temp.max,
                    // Grabs current weather conditons as a text string
                    conditions: response.daily[0].weather[0].description,
                    // Grabs current weather conditions as an icon
                    currentConditionIcon: `https://openweathermap.org/img/wn/${response.daily[0].weather[0].icon}@2x.png`

            }
            // If statement for alert. Will alert user if there is an alert, if not no alert will not populate

            if (response.alerts) {
               weatherDetails.weatherAlert = response.alerts[0].event
               console.log(response.alerts[0].event);
                
              
            }
            
            console.log("---------------------END Weather API---------------------")
         
                function weatherAdvisories(){
                    $('.modal').modal();
                    $("#modalHeader").text("Weather Advisories - " + term);
                    var temp = $("#temperature");
                    var wxCondition = $("#conditions");
                    var wxIcon = $("#currentConditionIcon");
                    temp.text("TEMPERATURE: " + response.daily[0].temp.max.toFixed(0) + " F");
                    wxCondition.text(response.daily[0].weather[0].description.toUpperCase());
                    wxIcon.attr("src", `https://openweathermap.org/img/wn/${response.daily[0].weather[0].icon}@2x.png`);

                    if (response.alerts) {
                        console.log("hello");
                        var p = response.alerts[0].event
                        console.log(p);
                        $("#current-alert").text(p)
                        
                        
                    }
                };

            weatherAdvisories();

        })

    }

    //Yelp cards
    function buildYelp (yelp) {
        
        console.log("Building yelp cards") 
        // For loop for yelp data
        yelp.forEach(item => {
            console.log(item)
            //Adds data for yelp locations.
            var pContentArray =[
                `Price: ${item.price}`,
                `Rating: ${item.rating}/5`,
                `Reviewers: ${item.review_count}`,
                `Adress: ${item.location.address1} ${item.location.city} ${item.location.state} ${item.location.zip_code}`,
                `Phone number: ${item.phone}`,
                `More info: <a href='${item.url}' target="_blank">Yelp Page</a>`
            ]
            var cardDiv = $("<div class='card'>")
            //create the image div
            var cardImgDiv = $("<div class='card-image'>")
                //create the img element
                var img = $("<img>")
                //add the src from our hike loop
                //if image doesn't exist use the hard coded generic
                if(item.image_url){
                    img.attr("src", item.image_url)
                }else{
                    img.attr("src", "https://api.time.com/wp-content/uploads/2018/04/national-beer-day-ipa.jpg?w=800&quality=85")
                }
                //create a div for the title of the hike/card
                var titleSpan = $("<span class='card-title'>")
                //set the text of the title
                titleSpan.text(item.name)
            //append the image and the title to the card image div
            cardImgDiv.append(img, titleSpan)
            //create the div for the content
            var contentDiv = $("<div class='card-content'>")
               // loop through our p content array to fill 'er up.
                pContentArray.forEach(info => {
                    //acutally create the p for content
                    var contentP = $("<p>");
                    //put in the content
                    contentP.html(info)
                    //append the p to the contentDiv
                    contentDiv.append(contentP)
                })
                
            // create a div to hold hte action button
            var actionDiv = $("<div class='card-action'>")
                
                var a = $("<a>")
                
                a.attr("href", "https://www.hikingproject.com/trail/7089027/pioneer-park")
            //add the actions to the actionDiv
            actionDiv.append(a)
        //append all card content div containers to the card container
        cardDiv.append(cardImgDiv, contentDiv, actionDiv )
        //append the card into the html section in index for result-container
        $(".beer-results").append(cardDiv)
        })
    }

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
                `<span id="hike-summary">${hike.summary}</span>`,
                `Total Elevation: ${hike.ascent} ft`,
                `Conditions: ${hike.conditionDetails}`,
                `Date of condtion: ${hike.conditionDate.slice(0,10)}`,
                `Difficulty: ${finalResult}`,
                `Length: ${hike.length}mi`,
                `Rating: ${hike.stars}`,
                `More info: <a href='${hike.url}' target="_blank">Hiking Project</a>`
            ]
            //create the card dive to hold everything
            //row
            //col class s-6
            var cardDiv = $("<div class='card'>")
                //create the image div
                var cardImgDiv = $("<div class='card-image'>")
                    //create the img element
                    var img = $("<img>")
                    //add the src from our hike loop
                    //if image doesn't exist use the hard coded generic
                if(hike.imgMedium){
                    img.attr("src", hike.imgMedium)
                }else{
                    img.attr("src", "https://www.tnvacation.com/sites/default/files/styles/hero/public/article/_HEADER_PC_jmgriese.jpg")
                }
                    //create a div for the title of the hike/card
                    var titleSpan = $("<span class='card-title'>")
                    //set the text of the title
                    titleSpan.text(hike.name)
                //append the image and the title to the card image div
                cardImgDiv.append(img, titleSpan)
                //create the div for the content
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
                //create a div to hold hte action button
                var actionDiv = $("<div class='card-action'>")
                    
                    var a = $("<a>")
                    
                    a.attr("href", "https://www.hikingproject.com/trail/7089027/pioneer-park")
                //add the actions to the actionDiv
                actionDiv.append(a)
            //append all card content div containers to the card container
            cardDiv.append(cardImgDiv, contentDiv, actionDiv )
            //append the card into the html section in index for result-container
            $(".hiking-results").append(cardDiv)
            
            
        });   
    }
})
