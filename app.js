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

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);
bot.set('storage', tableStorage);

bot.dialog('/', function (session) {
    session.say('test', 'oh my god you are totally going to, like, win this competition I think!');
});

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