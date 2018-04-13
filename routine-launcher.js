import { cleanInput } from './routine-builder';

var builder = require('botbuilder');

module.exports.launch = [
    function(session){
        var userInfo = session.message.entities.find((e) => {
            return e.type === 'UserInfo'
        });

        if (userInfo){
            session.conversationData.email = userInfo('email');
            if (session.conversationData.msg){
                routine = session.conversationData.msg;
            }else{
                routine = builder.PromptText('Enter the routine you want to launch.')
            }
        }
    },
    function(session, results, next){
        var res = cleanInput(results.response);
        session.conversationData.routine = res;
        next()
    },
    function(session){
        console.log('email = ' + session.conversationData.email);
        console.log(session.conversationData.Routines);
    }
];