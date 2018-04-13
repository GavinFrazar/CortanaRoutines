var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var fetch = require('node-fetch');

var api_url = 'https://api.cognitive.microsoft.com/bing/v7.0/news/search?q=top+stories&10';
var api_headers = {'Ocp-Apim-Subscription-Key': '1a995144d1c941fb84a4dd160c40c93a'};

module.exports.news = [
    function (session) {
        fetch(api_url, {headers : {'Ocp-Apim-Subscription-Key': '1a995144d1c941fb84a4dd160c40c93a'}})
        .then(res => res.json())
        .then(json => {
            var articles = json.value;
            var article_names = [];
            var article_descriptions = [];
            var article_links = [];
            var article_pictures = [];
            for (var i = 0; i < 10; i++) {
                article_names.push(articles[i].name);
                article_descriptions.push(articles[i].description);
                article_links.push(articles[i].url);
                article_pictures.push(articles[i].image.thumbnail.contentUrl);
            }

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
            					"type": "ColumnSet",
            					"columns": [
            						{
            							"type": "Column",
            							"width": "auto",
            							"items": [
            								{
            									"type": "Image",
            									"url": article_pictures[0],
            									"size": "medium",
            									"style": "default"
            								}
            							]
            						},
            						{
            							"type": "Column",
            							"width": "stretch",
            							"items": [
            								{
            									"type": "TextBlock",
            									"text": "[" + article_names[0] + "](" + article_links[0] + ")",
            									"weight": "bolder",
            									"wrap": true
            								},
            								{
            									"type": "TextBlock",
            									"spacing": "none",
            									"text": article_descriptions[0],
            									"isSubtle": true,
            									"wrap": true
            								}
            							]
            						}
            					]
            				},
                            {
            					"type": "ColumnSet",
            					"columns": [
            						{
            							"type": "Column",
            							"width": "auto",
            							"items": [
            								{
            									"type": "Image",
            									"url": article_pictures[1],
            									"size": "medium",
            									"style": "default"
            								}
            							]
            						},
            						{
            							"type": "Column",
            							"width": "stretch",
            							"items": [
            								{
            									"type": "TextBlock",
            									"text": "[" + article_names[1] + "](" + article_links[1] + ")",
            									"weight": "bolder",
            									"wrap": true
            								},
            								{
            									"type": "TextBlock",
            									"spacing": "none",
            									"text": article_descriptions[1],
            									"isSubtle": true,
            									"wrap": true
            								}
            							]
            						}
            					]
            				},
                            {
            					"type": "ColumnSet",
            					"columns": [
            						{
            							"type": "Column",
            							"width": "auto",
            							"items": [
            								{
            									"type": "Image",
            									"url": article_pictures[2],
            									"size": "medium",
            									"style": "default"
            								}
            							]
            						},
            						{
            							"type": "Column",
            							"width": "stretch",
            							"items": [
            								{
            									"type": "TextBlock",
            									"text": "[" + article_names[2] + "](" + article_links[2] + ")",
            									"weight": "bolder",
            									"wrap": true
            								},
            								{
            									"type": "TextBlock",
            									"spacing": "none",
            									"text": article_descriptions[2],
            									"isSubtle": true,
            									"wrap": true
            								}
            							]
            						}
            					]
            				},
                            {
            					"type": "ColumnSet",
            					"columns": [
            						{
            							"type": "Column",
            							"width": "auto",
            							"items": [
            								{
            									"type": "Image",
            									"url": article_pictures[3],
            									"size": "medium",
            									"style": "default"
            								}
            							]
            						},
            						{
            							"type": "Column",
            							"width": "stretch",
            							"items": [
            								{
            									"type": "TextBlock",
            									"text": "[" + article_names[3] + "](" + article_links[3] + ")",
            									"weight": "bolder",
            									"wrap": true
            								},
            								{
            									"type": "TextBlock",
            									"spacing": "none",
            									"text": article_descriptions[3],
            									"isSubtle": true,
            									"wrap": true
            								}
            							]
            						}
            					]
            				},
                            {
            					"type": "ColumnSet",
            					"columns": [
            						{
            							"type": "Column",
            							"width": "auto",
            							"items": [
            								{
            									"type": "Image",
            									"url": article_pictures[4],
            									"size": "medium",
            									"style": "default"
            								}
            							]
            						},
            						{
            							"type": "Column",
            							"width": "stretch",
            							"items": [
            								{
            									"type": "TextBlock",
            									"text": "[" + article_names[4] + "](" + article_links[4] + ")",
            									"weight": "bolder",
            									"wrap": true
            								},
            								{
            									"type": "TextBlock",
            									"spacing": "none",
            									"text": article_descriptions[4],
            									"isSubtle": true,
            									"wrap": true
            								}
            							]
            						}
            					]
            				},
                            {
            					"type": "ColumnSet",
            					"columns": [
            						{
            							"type": "Column",
            							"width": "auto",
            							"items": [
            								{
            									"type": "Image",
            									"url": article_pictures[5],
            									"size": "medium",
            									"style": "default"
            								}
            							]
            						},
            						{
            							"type": "Column",
            							"width": "stretch",
            							"items": [
            								{
            									"type": "TextBlock",
            									"text": "[" + article_names[5] + "](" + article_links[5] + ")",
            									"weight": "bolder",
            									"wrap": true
            								},
            								{
            									"type": "TextBlock",
            									"spacing": "none",
            									"text": article_descriptions[5],
            									"isSubtle": true,
            									"wrap": true
            								}
            							]
            						}
            					]
            				},
                            {
            					"type": "ColumnSet",
            					"columns": [
            						{
            							"type": "Column",
            							"width": "auto",
            							"items": [
            								{
            									"type": "Image",
            									"url": article_pictures[6],
            									"size": "medium",
            									"style": "default"
            								}
            							]
            						},
            						{
            							"type": "Column",
            							"width": "stretch",
            							"items": [
            								{
            									"type": "TextBlock",
            									"text": "[" + article_names[6] + "](" + article_links[6] + ")",
            									"weight": "bolder",
            									"wrap": true
            								},
            								{
            									"type": "TextBlock",
            									"spacing": "none",
            									"text": article_descriptions[6],
            									"isSubtle": true,
            									"wrap": true
            								}
            							]
            						}
            					]
            				},
                            {
            					"type": "ColumnSet",
            					"columns": [
            						{
            							"type": "Column",
            							"width": "auto",
            							"items": [
            								{
            									"type": "Image",
            									"url": article_pictures[7],
            									"size": "medium",
            									"style": "default"
            								}
            							]
            						},
            						{
            							"type": "Column",
            							"width": "stretch",
            							"items": [
            								{
            									"type": "TextBlock",
            									"text": "[" + article_names[7] + "](" + article_links[7] + ")",
            									"weight": "bolder",
            									"wrap": true
            								},
            								{
            									"type": "TextBlock",
            									"spacing": "none",
            									"text": article_descriptions[7],
            									"isSubtle": true,
            									"wrap": true
            								}
            							]
            						}
            					]
            				},
                            {
            					"type": "ColumnSet",
            					"columns": [
            						{
            							"type": "Column",
            							"width": "auto",
            							"items": [
            								{
            									"type": "Image",
            									"url": article_pictures[8],
            									"size": "medium",
            									"style": "default"
            								}
            							]
            						},
            						{
            							"type": "Column",
            							"width": "stretch",
            							"items": [
            								{
            									"type": "TextBlock",
            									"text": "[" + article_names[8] + "](" + article_links[8] + ")",
            									"weight": "bolder",
            									"wrap": true
            								},
            								{
            									"type": "TextBlock",
            									"spacing": "none",
            									"text": article_descriptions[8],
            									"isSubtle": true,
            									"wrap": true
            								}
            							]
            						}
            					]
            				},
                            {
            					"type": "ColumnSet",
            					"columns": [
            						{
            							"type": "Column",
            							"width": "auto",
            							"items": [
            								{
            									"type": "Image",
            									"url": article_pictures[9],
            									"size": "medium",
            									"style": "default"
            								}
            							]
            						},
            						{
            							"type": "Column",
            							"width": "stretch",
            							"items": [
            								{
            									"type": "TextBlock",
            									"text": "[" + article_names[9] + "](" + article_links[9] + ")",
            									"weight": "bolder",
            									"wrap": true
            								},
            								{
            									"type": "TextBlock",
            									"spacing": "none",
            									"text": article_descriptions[9],
            									"isSubtle": true,
            									"wrap": true
            								}
            							]
            						}
            					]
            				}
            			]
            		}
            	]
            }});
            card.speak('Here are today\'s top stories.');
            session.send(card);
            session.endDialog();
        });
    }
];
