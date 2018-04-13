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

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);
bot.set('storage', tableStorage);

bot.dialog('/', function (session) {
    if (session.message.text.toLowerCase().includes('weather')) {
        session.beginDialog('/weather');
    } else if (session.message.text.toLowerCase().includes('news')) {
        session.beginDialog('/news');
    } else if (session.message.text.toLowerCase().includes('traffic')) {
        session.beginDialog('/traffic');
    }else if (session.message.text.toLowerCase().includes('done')) {
        session.endConversation("Goodbye");
    } else {
        session.send('You said ' + session.message.text);
    }
});

var current_weather = require('./weather.js').current_weather;
bot.dialog('/weather', current_weather);

var news = require('./news.js').news;
bot.dialog('/news', news);

var traffic = require('./traffic.js').traffic;
bot.dialog('/traffic', traffic);

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
