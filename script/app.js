import key from "./key.js"
import ipkey from "./ipkey.js"
import weatherkey from "./weatherkey.js"
let dataArr = []
let weatherArr = []
let listWeatherArr = []
const json = (url) => {
    return fetch(url).then(res => res.json())
}

json(`https://api.ipdata.co?api-key=${ipkey}`)
.then(ipdata => {
    console.log(ipdata)
        let ipconvert = {
            "ip":  ipdata.ip,
            'long': ipdata.longitude,
            'lat': ipdata.latitude,
            'countrycode': ipdata.country_code,
            'countryname': ipdata.country_name,
            'flag' : ipdata.flag,
            'regionlsz': ipdata.postal,
            'regioncode': ipdata.region_code,
            'regionname':ipdata.region,
            'timezone': ipdata.time_zone.offset,
            "time": ipdata.time_zone.current_time
        }
        dataArr.push(ipconvert)
})
.then(() => {
    let myIcon = L.icon({
        iconUrl: '../media/icons/marker.svg',
        iconSize: [40, 40],
        iconAnchor: [40, 50],
        // popupAnchor: [-3, -76],
    })
    let map = L.map('map').setView([dataArr[0].lat, dataArr[0].long], 8);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
   
}).addTo(map);    
    // let marker = L.marker([dataArr[0].lat, dataArr[0].long], {icon: myIcon}).addTo(map)
})
.then(
    () => {
        const ipContainer = document.querySelector(".ip p")
        const ipAddress = document.querySelector("article .ip-address")
        const cityData = document.querySelector(".city-data .data")
        const timeZone = document.querySelector(".city-timezone .data")
        const cityCode = document.querySelector(".city-code .data")
        const cityRegion = document.querySelector(".city-region .data")
        const weatherDate = document.querySelector(".weather-date .data")

        ipContainer.innerHTML = dataArr[0].ip
        ipAddress.innerHTML = dataArr[0].ip
        cityData.innerHTML = dataArr[0].countryname
        timeZone.innerHTML = dataArr[0].timezone
        cityCode.innerHTML = dataArr[0].countrycode
        cityRegion.innerHTML = dataArr[0].regionname

        weatherDate.innerHTML = new Date(dataArr[0].time).toLocaleDateString("de-DE", {weekday:'short', day:'2-digit', month:"2-digit", year:"numeric", hour:'numeric', minute:'numeric'}).replace(/,;./g,"")
    }
)
.then(
    () => {
        json(`https://api.openweathermap.org/data/2.5/weather?lat=${dataArr[0].lat}&lon=${dataArr[0].long}&appid=${weatherkey}&units=metric`)
        .then(
            (data) => {
                let wdata = {
                    "temp": data.main.temp,
                    "tempmax": data.main.temp_max,
                    "tempmin": data.main.temp_min,
                    "hum": data.main.humidity,
                    "feelslike": data.main.feels_like,
                    "pressure": data.main.pressure,
                    "sunrise": data.sys.sunrise,
                    "sunset": data.sys.sunset,
                    "description": data.weather[0].description,
                    "icon": "https://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png",
                    "windeg": data.wind.deg,
                    "windgust": data.wind.gust,
                    "windspeed": data.wind.speed,
                    // "time": data.time_zone.current_time
                }
                weatherArr.push(wdata)
            }
        )
        .then(
            () => {
    

                json(`https://api.openweathermap.org/data/2.5/forecast?lat=${dataArr[0].lat}&lon=${dataArr[0].long}&appid=${weatherkey}&units=metric`)
                .then((data)=>{
                    let list = [...data.list]
                    let options = {
                        day: '2-digit',
                        month: '2-digit',
                        hour: 'numeric',
                        minutes: 'numeric'
                    }
                    listWeatherArr =  []
                    list.forEach(data => {
                        let listDate= new Date(data.dt * 1000).toLocaleDateString("de-DE", options)
                        listWeatherArr.push({
                            "day": listDate,
                            "temp": data.main.temp,
                            "tempmax": data.main.temp_max,
                            "tempmin": data.main.temp_min,
                            "hum": data.main.humidity,
                            "feelslike": data.main.feels_like,
                            "pressure": data.main.pressure,
                            "description": data.weather[0].description,
                            "icon": "https://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png",
                            "windeg": data.wind.deg,
                            "windgust": data.wind.gust,
                            "windspeed": data.wind.speed
                        })
                    })
                   
                })
                .then(() => {


                   

                    const ctx = document.querySelector('#myChart');
                
                    new Chart(ctx, {
                      type: 'bar',
                       data: {
                            labels: listWeatherArr.map(row => row.day),
                        datasets: [
                            {
                            label: 'Acquisitions by year',
                            data: listWeatherArr.map(row => row.temp)
                            }
                        ]
                       }
                    });
                })
            }
        )
        .then(
            () => {

            }
        )
    }
)
.catch(err => console.log(err))


