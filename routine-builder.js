var builder = require('botbuilder');

module.exports = [
    function (session){
        builder.Prompts.say(session, 'What do you want to call this routine?');
    },
    function (session, results, next){
        session.say('test1', 'here one');
        session.dialogData.routineName = results.response;
        session.say('test', 'here');
    }
];