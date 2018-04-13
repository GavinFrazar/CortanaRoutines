var cleanInput = require('./routine-builder').cleanInput;
var builder = require('botbuilder');

module.exports.launch = [
    function(session){
        var userInfo = session.message.entities.find((e) => {
            return e.type === 'UserInfo';
        });

        if (userInfo){
            session.conversationData.email = userInfo['email'];
            if (session.conversationData.routine){                
                var res = session.conversationData.routine;
                res = cleanInput(res);
                session.conversationData.routine = res;
            }else{
                var msg = "What routine should I launch?";
                session.say(msg,msg);
                builder.Prompts.text(session,'Enter the routine you want to launch.');
            }
        }
    },
    function(session, results, next){
        var res = results.response;
        console.log(res);
        res = cleanInput(res);
        session.conversationData.routine = res;
        next();
    },
    function(session){
        console.log('email = ' + session.conversationData.email);
        console.log(session.conversationData.Routines);
    }
];