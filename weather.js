var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var fetch = require('node-fetch');

var weather_api_uri = 'http://api.openweathermap.org/data/2.5/weather?';
var weather_api_appid = '3bb490c38f285bc47bd2ab13d076b212';

// Credit to https://github.com/basarat for the getCardinal function
function getCardinal(angle) {
    //easy to customize by changing the number of directions you have
    var directions = 8;

    var degree = 360 / directions;
    angle = angle + degree/2;

    if (angle >= 0 * degree && angle < 1 * degree)
        return "North";
    if (angle >= 1 * degree && angle < 2 * degree)
        return "Northeast";
    if (angle >= 2 * degree && angle < 3 * degree)
        return "East";
    if (angle >= 3 * degree && angle < 4 * degree)
        return "Southeast";
    if (angle >= 4 * degree && angle < 5 * degree)
        return "South";
    if (angle >= 5 * degree && angle < 6 * degree)
        return "Southwest";
    if (angle >= 6 * degree && angle < 7 * degree)
        return "West";
    if (angle >= 7 * degree && angle < 8 * degree)
        return "Northwest";
    //Should never happen:
    return "North";
}

module.exports.current_weather= [
    function(session) {
        var userInfo = session.message.entities.find((e) => {
            return e.type === 'UserInfo';
        });

        if (userInfo) {
            var currentLocation = userInfo['current_location'];

            if (currentLocation)
            {
                var lat = currentLocation.Hub.Latitude;
                var lon = currentLocation.Hub.Longitude;
            }
        }
        var weather_call = weather_api_uri + 'lat=' + lat + '&lon=' + lon + '&units=imperial&APPID=' + weather_api_appid;
        fetch(weather_call)
        .then(res => res.json())
        .then(json => {
            var main = json['main'];
            var temp_cur = main['temp'];
            var temp_min = main['temp_min'];
            var temp_max = main['temp_max'];

            var wind_speed = json.wind.speed;
            var wind_direction = getCardinal(json.wind.deg);

            var sunrise_date = new Date(0);
            var sunset_date = new Date(0);

            sunrise_date.setUTCSeconds(json.sys.sunrise - 25200);
            sunset_date.setUTCSeconds(json.sys.sunset - 25200);

            var city_name = json.name;

            var card = new builder.Message(session)
            .addAttachment({
                contentType: "application/vnd.microsoft.card.adaptive",
                content: {
                type: "AdaptiveCard",
                "body": [
                    {
                        "type": "Container",
                        "items": [
                            {
                                "type": "Image",
                                "url": "https://i.imgur.com/CVk4Tdg.png",
                                "size": "medium",
                                "style": "person",
                                "horizontalAlignment": "center"
                            }
                        ]
                    },
                    {
                        "type":"TextBlock",
                        "horizontalAlignment":"center",
                        "size":"extraLarge",
                        "weight":"bolder",
                        "text":temp_cur + "°F in " + city_name
                    },
                    {
                        "type": "Container",
                        "items": [
                            {
                                "type": "Column",
                                "width": "auto",
                                "items": [
                                    {
                                        "type": "FactSet",
                                        "facts": [
                                            {
                                                "title": "Today's high | low:",
                                                "value": temp_max + "°F | " + temp_min + "°F"
                                            },
                                            {
                                                "title": "Wind speed | direction:",
                                                "value": wind_speed + " mph | " + wind_direction
                                            },
                                            {
                                                "title": "Sunrise | Sunset:",
                                                "value": sunrise_date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) + " | " + sunset_date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }});
            card.speak("It is currently" + temp_cur + "° fahrenheit in " + city_name);
            session.send(card);
            session.endDialog();
            });
    }
];
