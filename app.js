/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

/*-----------------------
setting up table storage 
-----------------------*/
var storage = require('azure-storage');
var connectionString = "DefaultEndpointsProtocol=https;AccountName=apollostorage2;AccountKey=35ZE7pRvyiDOv5mPNoUcIXQxfpocc4fDLASOe1p1mPIHv1fR2Y6yA7bnhiaoEpRozHphcFiKMR6wZrFFdsAlkQ==;TableEndpoint=https://apollostorage2.table.cosmosdb.azure.com:443/;";
var storageClient = storage.createTableService(connectionString);

storageClient.createTableIfNotExists('mytesttable', function (error, result, response) {
    if (!error) {
        // Table exists or created
    }
    if (result.created) {
        console.log('created new table');
    }
    else {
        console.log('table exists');
    }
});


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

var userInput;
var numOrString;


var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.say('', "Welcome to Apollo routines!");
        session.say('', "Would you like to create, or use a existing routine?");
        builder.Prompts.text(session, "Would you like to create, or use a existing routine?");
    },
    function (session, results) {
        userInput = results.response;
        // if(userInput == "create a routine" || "Create a routine."){
        if (userInput.includes("reate")) {
            session.say('', "How many tasks would you like?");
            builder.Prompts.number(session, "How many tasks would you like?");
        } else if (userInput.includes("routin")) {
            session.say('', "What routine would you like to use?");
            builder.Prompts.text(session, "What routine would you like to use?");
        }
        else
            console.log(userInput);
    },
    function (session, results) {
        numOrString = results.response;
        if (typeof numOrString == "string")
            builder.Prompts.number(session, "Invocing task from here");
        else {
            session.say('', "What would you like to name the routine?");
            builder.Prompts.text(session, "What would you like to name the routine?");
        }
    }
]);

/*----------------
Entering multiple tasks
----------------*/
var task1 = {
    PartitionKey: { '_': 'morning' },
    RowKey: { '_': '1' },
    description: { '_': 'weather' }
};

var task2 = {
    PartitionKey: { '_': 'morning' },
    RowKey: { '_': '2' },
    description: { '_': 'traffic' },
};

var batch = new storage.TableBatch();

batch.insertOrReplaceEntity(task1, { echoContent: true });
batch.insertOrReplaceEntity(task2, { echoContent: true });

storageClient.executeBatch('mytesttable', batch, function (error, result, response) {
    if (!error) {
        console.log('Batch completed');
    }
});

/*----------------
Gets Pacific Stadard Time
----------------*/
var getUserDateAndTime = new Date();

var timeZoneFromDB = -7.00; //time zone value from database
//get the timezone offset from local time in minutes
var tzDifference = timeZoneFromDB * 60 + getUserDateAndTime.getTimezoneOffset();
//convert the offset to milliseconds, add to targetTime, and make a new Date
var offsetTime = new Date(getUserDateAndTime.getTime() + tzDifference * 60 * 1000);

console.log(offsetTime.getHours() + ":" + offsetTime.getMinutes() + " " + offsetTime.getSeconds() + "s");

/*----------------
Adding seconds to the time
----------------*/
offsetTime.setSeconds(offsetTime.getSeconds() + 4444);
console.log(offsetTime.getHours() + ":" + offsetTime.getMinutes() + " " + offsetTime.getSeconds() + "s");
