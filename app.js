/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework.
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");
var fetch = require('node-fetch');

/*-----------------------
setting up table storage
-----------------------*/
var storage = require('azure-storage');
var connectionString = "DefaultEndpointsProtocol=https;AccountName=apollostorage2;AccountKey=35ZE7pRvyiDOv5mPNoUcIXQxfpocc4fDLASOe1p1mPIHv1fR2Y6yA7bnhiaoEpRozHphcFiKMR6wZrFFdsAlkQ==;TableEndpoint=https://apollostorage2.table.cosmosdb.azure.com:443/;";
var storageClient = storage.createTableService(connectionString);


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot.
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

var bot = new builder.UniversalBot(connector);
// Listen for messages from users 
server.post('/api/messages', connector.listen());

var DialogLabels = {
    make : 'make',
    launch : 'launch',
};

//TODO -- loadroutines from table
var Skills = [
    'weather',
    'traffic',
    'news'
];

//STUB
var Routines = {
    morning: ['make', 'make', 'make', 'make']
};

bot.set('storage', tableStorage);

var routine_builder = require('./routine-builder');
bot.dialog('/', [
    function (session) {
        session.conversationData.Skills = Skills;
        session.conversationData.Routines = Routines;
        var msg = session.message.text;
        //no args with invocation phrase
        msg = "Welcome to routines. ";
        session.say(msg, msg);
        builder.Prompts.choice(session, 
            "Do you want to launch an existing routine, or make one?",
            [DialogLabels.make, DialogLabels.launch],
            {
                maxRetries : 3,
                retryPrompt : "Invalid option" 
            }
        );
    },
    function(session, results, next){
        console.log(results);
        if (!results.response){
            console.log('no choice made');
            //TODO -- handle no response nicely
        }else{
            var choice = results.response.entity;
            switch (choice){
                case DialogLabels.make:
                    session.replaceDialog('make');
                    break;
                case DialogLabels.launch:
                    session.replaceDialog('launch');
                    break;
            }
        }
    },
    function(session){
        session.endConversation("Goodbye");
    }
]);

bot.set('storage', tableStorage);
bot.dialog('nextSkill', routine_builder.nextSkill);
var current_weather = require('./weather.js').current_weather;
bot.dialog('weather', current_weather);

var news = require('./news.js').news;
bot.dialog('news', news);

var traffic = require('./traffic.js').traffic;
bot.dialog('traffic', traffic);
var routine_launcher = require('./routine-launcher');

bot.dialog('skillExecutor', routine_launcher.skillExecutor).triggerAction({matches: [
    /(next|continue)/i
]})

bot.dialog('launch', routine_launcher.launch).triggerAction({ matches: [
    /(launch|run)/i
 ]});
 
bot.dialog('make', routine_builder.make).triggerAction({ matches: [
    /(create|make)/i
 ]});
