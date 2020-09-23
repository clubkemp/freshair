$(document).ready(function (){
    //global distance variable, might just pass this in as an argument to the apis
    var dist = 10
    
    //on click of search button
    $("#search-btn").on("click", function (){
        //get the term the user has searched by
        var term = $("#location-input").val();
        //seting the global variable for api calls of radius
        dist = $("#radius-input").val();
        //fire first function in the link
        geoData(term);
    })
    //TODO: add jquery click listener to #currentLocation
        //this listener skips the geodata() function
        //navigator.geolocation
        //GeoLocation.getCurrentPostion
        //parse geolcation return into lat and long variables
        //fire hikingData
    
    // TODO: Let's use the above buttons as the starting point for our entire function It'll be the sauce that gets the whole thing going




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
            console.log(response)
            console.log("--------------End hiking API --------------")
    })
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
            console.log("---------------------END Yelp API---------------------")
        })
            
            

    }

 //function for getting weather data
 function weatherData(lat, long){  
    // var alertWeatherAPI = 'c56b8c5094d7dabc849248635865a867'
    var urlQuery = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=c56b8c5094d7dabc849248635865a867`
   //TODO: figure out alert OR just use the current weather...
    $.ajax({
        method:"GET",
        url:urlQuery
    }).then(function (response){
        console.log("---------------------Weather API---------------------")
        console.log(response);
        console.log("---------------------END Weather API---------------------")
    })
}
    
})
