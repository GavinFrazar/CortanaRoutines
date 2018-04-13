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

// Create your bot with a function to receive messages from the user

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

var Routines = {
    morning: ['weather', 'traffic', 'news']
};

bot.set('storage', tableStorage);

var routine_builder = require('./routine-builder');
bot.dialog('/', [
    function (session) {
        session.conversationData.Skills = Skills;
        session.conversationData.Routines = Routines;
        var msg = session.message.text;
        if (msg){
            msg = routine_builder.cleanInput(msg);
            console.log('message = ' + msg);
            if (msg.includes('make')){
                session.replaceDialog('make');
            }else{
                session.conversationData.routine = msg;
                session.replaceDialog('launch');                
            }
        }
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

var routine_launcher = require('./routine-launcher');

bot.dialog('launch', routine_launcher.launch);
bot.dialog('make', routine_builder.make);
bot.dialog('nextSkill', routine_builder.nextSkill);