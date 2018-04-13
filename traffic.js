var fetch = require('node-fetch')

key = '&key=AmF2CR8yrUHEgtGaaI-DW8KAxv_iJztvBMtjFNRl5i1qIy8UkEERpmq7xLerPPhc';
base_url = 'http://dev.virtualearth.net/REST/v1/Routes?optmz=timeWithTraffic&';

exports.getRouteDuration = function (from, to){
    route = 'wp.0=' + from + '&wp.1=' + to;
    url = base_url + route + key;
    return fetch(url).then(res => res.json()).then(json => Math.round(json.resourceSets[0]['resources'][0]['travelDurationTraffic'] / 60));
}