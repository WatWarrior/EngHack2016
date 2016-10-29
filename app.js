 var restify = require('restify');
 var builder = require('botbuilder');

// //=========================================================
// // Bot Setup
// //=========================================================

// // Setup Restify Server
 var server = restify.createServer();
 server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
 });
  
// // Create chat bot
 var connector = new builder.ChatConnector({
     appId: process.env.MICROSOFT_APP_ID,
     appPassword: process.env.MICROSOFT_APP_PASSWORD
 });
// var bot = new builder.UniversalBot(connector, {
//         localizerSettings: {
//         botLocalePath: "./locale",
//         defaultLocale: "en"
//     }
// });
 server.post('/api/messages', connector.listen());

// //=========================================================
// // Bots Dialogs
// //=========================================================

// var intents = new builder.IntentDialog();
// bot.dialog('/', intents);

// intents.matches(/^change name/i, [
//     function (session) {
//         session.beginDialog('/profile');
//     },
//     function (session, results) {
//         session.send('Ok... Changed your name to %s', session.userData.name);
//     }
// ]);

// intents.onDefault([
//     function (session, args, next) {
//         if (!session.userData.name) {
//             session.beginDialog('/profile');
//         } else {
//             next();
//         }
//     },
//     function (session, results) {
//         session.send('Hello %s!', session.userData.name);
//     }
// ]);

// bot.dialog('/profile', [
//     function (session) {
//         builder.Prompts.text(session, 'Hi! What is your name?');
//     },
//     function (session, results) {
//         session.userData.name = results.response;
//         session.endDialog();
//     }
// ]);

//var builder = require('botbuilder');

// Create bot and bind to console
//var connector = new builder.ConsoleConnector().listen();
 var bot = new builder.UniversalBot(connector, {
         localizerSettings: {
         botLocalePath: "./locale",
         defaultLocale: "en"
     }
 });

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://api.projectoxford.ai/luis/v1/application?id=c413b2ef-382c-45bd-8ff0-f76d60e2a821&subscription-key=1d8c4b5de39944eea0dbef322202c269&q=';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

// Add intent handlers
dialog.matches('builtin.intent.alarm.set_alarm', builder.DialogAction.send('Creating Alarm'));
dialog.matches('builtin.intent.alarm.delete_alarm', builder.DialogAction.send('Deleting Alarm'));
dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand. I can only create & delete alarms."));