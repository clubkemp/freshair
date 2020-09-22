$(document).ready(function (){

    function hikingData (){
        //https://www.hikingproject.com/data
        console.log("----------hiking api-------------")
        var hikingAPI = '200921607-a699ee88fe046c36c0221ff849e49662'
        var lat = 47.660878
        var long = -122.416449
        var dist = 40
        var urlQuery = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${long}&maxDistance=${dist}&key=${hikingAPI}`

        $.get(urlQuery, function (response) {
            console.log(response)
            console.log("--------------End hiking API --------------")
    })
    }
    
    function geoData () {
        //nomination
        console.log("------------Geolocation api--------------")
        $.get(`https://nominatim.openstreetmap.org/?q=${cityName}&addressdetails=1&countrycodes=US&format=json&limit=1`, function(response){
                console.log(response)
                //seting the latitude of the city
                lat = response[0].lat;
                //setting the laongitute of the city
                long = response[0].lon;
                //clean up the city name
                cityName = `${cityName}, ${response[0].address.state}`
            })
    }
    hikingData();
    
})


