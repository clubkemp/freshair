$(document).ready(function (){
    //setting search params that would be pulled in from the user
    //setting a latitude equal to discovery park
    var lat = 47.660878
    //setting longitude equal to discovery park
    var long = -122.416449
    //setting a radius search parameter
    var dist = 1
    //function to call for hiking data
    
    //TODO: Need to replace this with the value out of our event listener below
    // var searchBtn = "#search-btn"
    //$("#IDOFINPUT")

    $("#search-btn").on("click", function (){
        var term = $("#location-input").val()
        dist = $("#radius-input").val()
        geoData(term)
    })
    function hikingData (lat, long, dist){
        //https://www.hikingproject.com/data
        //api key for hking projet
        var hikingAPI = '200921607-a699ee88fe046c36c0221ff849e49662'
        //search by lat/long using a max distance
        var urlQuery = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=${dist}&key=${hikingAPI}`
        //get urlQuery
        $.get(urlQuery, function (response) {
            console.log("----------hiking api-------------")
            console.log(response)
            console.log("--------------End hiking API --------------")
    })
    }
    //function for calling nomination geocoding service
    function geoData (searchTerm) {
        //https://nominatim.org/release-docs/develop/api/Search/
        //calling the geocode a term, so we can get a lat/long
        //var term = "Discovery park"
        //get the gecode using the term\
        console.log(`"***************You are looking within ${dist} of: ${searchTerm}*****************`)
        $.get(`https://nominatim.openstreetmap.org/?q=${searchTerm}&addressdetails=1&countrycodes=US&format=json&limit=1`, function(response){
            console.log("------------Geolocation api--------------")  
            console.log(response)
            var lat = response[0].lat
            var long = response[0].lon
            hikingData(lat, long, dist)
            yelpData(lat, long, dist)
            console.log("--------------End Geolocation api ---------------")

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
    
})


//latitude=${lat}&longitude=${long}&