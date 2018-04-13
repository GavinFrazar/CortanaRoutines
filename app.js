/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var azure = require("botbuilder-azure");

/*-----------------------
setting up table storage 
-----------------------*/
var documentDbOptions = {
    host: '',
    masterKey: '',
    database: 'botdocs',
    collection: 'botdata'
};

var docDbClient = new azure.DocumentDbClient(documentDbOptions);
var cosmosStorage = new azure.AzureBotStorage({gzipData:false}, docDbClient);


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
var bot = new builder.UniversalBot(connector).set('storage', cosmosStorage);

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

var routine_builder = require('./routine-builder');
bot.dialog('/', [
    function (session) {
        session.conversationData.Skills = Skills;
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