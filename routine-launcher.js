var cleanInput = require('./routine-builder').cleanInput;
var builder = require('botbuilder');

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

module.exports.launch = [
    function(session){
        session.conversationData.Routines = Routines;
        session.conversationData.Skills = Skills;
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
    //get the routine from known Routines
    function(session){
        for (var key in session.conversationData.Routines){
            if (session.conversationData.routine.includes(key)){
                session.conversationData.routine = key;
                break;
            }
        }
        console.log(session.conversationData.Routines);
        var routine = session.conversationData.Routines['morning'];
        console.log('routine = ' + routine);
        session.conversationData.routine = routine;
        //execute routine
        session.replaceDialog('skillExecutor');
    }
];

module.exports.skillExecutor = [
  function(session){
    console.log('here');
    var skill = session.conversationData.routine.shift();
    if (skill){
        console.log(skill);
        session.beginDialog(skill);
    }else{
        session.endConversation('Bye!');
    }
  } 
];