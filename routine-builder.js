var builder = require('botbuilder');

module.exports.make = [
    function (session){
        var msg = 'What should we call this routine?';
        session.say(msg,msg);
        builder.Prompts.text(session, 'Give a name for the routine you want to make');
    },
    function (session, results, next){
        var res = results.response;
        res = cleanInput(res);     
        session.conversationData.routineName = res;
        session.replaceDialog('nextSkill');
    }
];

module.exports.nextSkill = [
    function(session){
        var msg = "What's the next routine step?";
        session.say(msg, msg);
        builder.Prompts.text(session, 'Enter the next skill in this routine, or say "I\'m done"');
    },
    function(session, results, next){
        var res = results.response;
        res = cleanInput(res);
        session.res = res;
        console.log(session.res);
        if (!session.res.includes("done")){
            session.replaceDialog('nextSkill');
        }else{
            var msg = "Okay, I'll remember your " +
            session.conversationData.routineName;
            if (!session.conversationData.routineName.includes('routine'))
                msg += " routine";
            msg += '.';
            session.say(msg, msg);
            next();
        }
    },
    function(session){
        var msg = "Do you want to make another routine?";
        session.say(msg,msg);
        builder.Prompts.text(session, 'Answer yes or no');
    },
    function(session, results, next){
        var res = results.response;
        res = cleanInput(res);
        if (res.includes('yes') || res.includes('yeah')){
            session.replaceDialog('make');
        }else{
            session.say('Goodbye.', 'Goodbye.');
            next();
        }
    },
    function(session){
        session.endConversation('Goodbye.');
    }
];

//helper
function cleanInput(str){
    return str.toLowerCase().replace(/[^A-Za-z ]/g,'');
}

module.exports.cleanInput = cleanInput;