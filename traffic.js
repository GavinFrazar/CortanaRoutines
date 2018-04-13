var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var fetch = require('node-fetch');

var key = '&key=AmF2CR8yrUHEgtGaaI-DW8KAxv_iJztvBMtjFNRl5i1qIy8UkEERpmq7xLerPPhc';
var base_url = 'http://dev.virtualearth.net/REST/v1/Routes?optmz=timeWithTraffic&';

var time = 480;
var to = "5141 Carpinteria Ave, Carpinteria, CA 93013";

module.exports.traffic = [
    function (session) {
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

        getRouteDuration(lat + "," + lon , to).then(res => {
            var mins = res;
            var leave_time = time - mins;

            var leave_hours = Math.floor(leave_time/60);
            var leave_mins = leave_time % 60;
            if (leave_mins < 10){
                leave_mins = "0" + leave_mins;
            }

            var card = new builder.Message(session)
            .addAttachment({
                contentType: "application/vnd.microsoft.card.adaptive",
                content: {
                type: "AdaptiveCard",
                "body": [
                    {
                        "type":"TextBlock",
                        "horizontalAlignment":"center",
                        "size":"extraLarge",
                        "weight":"bolder",
                        "text":"You must leave by"
                    },
                    {
                        "type":"TextBlock",
                        "horizontalAlignment":"center",
                        "size":"extraLarge",
                        "weight":"bolder",
                        "text": leave_hours + ":" + leave_mins + " AM"
                    }
                ]
            }});
            card.speak("To arrive at your destination on time, you must leave by " + leave_hours + ":" + leave_mins + " AM");
            session.send(card);
            session.endDialog();
        });

    }
]

var getRouteDuration = function (from, to) {
    route = 'wp.0=' + from + '&wp.1=' + to;
    url = base_url + route + key;
    return fetch(url).then(res => res.json()).then(json => Math.round(json.resourceSets[0]['resources'][0]['travelDurationTraffic'] / 60));
}
