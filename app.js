// var restify = require('restify');
// var builder = require('botbuilder');

// //Setup Restify Server
// var server = restify.createServer();
// server.listen(process.env.port || process.env.PORT || 3978, function () {
//    console.log('%s listening to %s', server.name, server.url); 
// });

// // Create chat bot
// var connector = new builder.ChatConnector({
//     appId: process.env.MICROSOFT_APP_ID,
//     appPassword: process.env.MICROSOFT_APP_PASSWORD
// });


// var bot = new builder.UniversalBot(connector, {
//    localizerSettings: {
//    botLocalePath: "./locale",
//    defaultLocale: "en"
//  }
//  });

// server.post('/api/messages', connector.listen());

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


//

var builder = require('botbuilder');

// Create bot and bind to console
var connector = new builder.ConsoleConnector().listen();

var bot = new builder.UniversalBot(connector, {
   localizerSettings: {
   botLocalePath: "./locale",
   defaultLocale: "en"
 }
 });

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://api.projectoxford.ai/luis/v1/application?id=c413b2ef-382c-45bd-8ff0-f76d60e2a821&subscription-key=1d8c4b5de39944eea0dbef322202c269&q=';
var recognizer = new builder.LuisRecognizer(model);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);

//Add intent handlers
// dialog.matches('builtin.intent.alarm.set_alarm', builder.DialogAction.send('Creating Alarm'));


intents.matches('builtin.intent.alarm.delete_alarm', builder.DialogAction.send('Deleting Alarm'));
intents.onDefault(builder.DialogAction.send("I'm sorry I didn't understand. I can only create & delete alarms."));

// dialog.matches('builtin.intent.alarm.set_alarm', [
//     function (session, args, next) {
//         // Resolve and store any entities passed from LUIS.
//         var title = builder.EntityRecognizer.findEntity(args.entities, 'builtin.alarm.title');
//         var time = builder.EntityRecognizer.resolveTime(args.entities);
//         var alarm = session.dialogData.alarm = {
//           title: title ? title.entity : null,
//           timestamp: time ? time.getTime() : null  
//         };
        
//         // Prompt for title
//         if (!alarm.title) {
//             builder.Prompts.text(session, 'What would you like to call your alarm?');
//         } else {
//             next();
//         }
//     },
//     function (session, results, next) {
//         var alarm = session.dialogData.alarm;
//         if (results.response) {
//             alarm.title = results.response;
//         }

//         // Prompt for time (title will be blank if the user said cancel)
//         if (alarm.title && !alarm.timestamp) {
//             builder.Prompts.time(session, 'What time would you like to set the alarm for?');
//         } else {
//             next();
//         }
//     },

// function (session, results) {
//         var alarm = session.dialogData.alarm;
//         if (results.response) {
//             var time = builder.EntityRecognizer.resolveTime([results.response]);
//             alarm.timestamp = time ? time.getTime() : null;
//         }
        
//         // Set the alarm (if title or timestamp is blank the user said cancel)
//         if (alarm.title && alarm.timestamp) {
//             // Save address of who to notify and write to scheduler.
//             alarm.address = session.message.address;
//             alarms[alarm.title] = alarm;
            
//             // Send confirmation to user
//             var date = new Date(alarm.timestamp);
//             var isAM = date.getHours() < 12;
//             session.send('Creating alarm named "%s" for %d/%d/%d %d:%02d%s',
//                 alarm.title,
//                 date.getMonth() + 1, date.getDate(), date.getFullYear(),
//                 isAM ? date.getHours() : date.getHours() - 12, date.getMinutes(), isAM ? 'am' : 'pm');
//         } else {
//             session.send('Ok... no problem.');
//         }
//     }
// ]);

// dialog.matches('builtin.intent.alarm.delete_alarm', [
//     function (session, args, next) {
//         // Resolve entities passed from LUIS.
//         var title;
//         var entity = builder.EntityRecognizer.findEntity(args.entities, 'builtin.alarm.title');
//         if (entity) {
//             // Verify its in our set of alarms.
//             title = builder.EntityRecognizer.findBestMatch(alarms, entity.entity);
//         }
        
//         // Prompt for alarm name
//         if (!title) {
//             builder.Prompts.choice(session, 'Which alarm would you like to delete?', alarms);
//         } else {
//             next({ response: title });
//         }
//     },
//     function (session, results) {
//         // If response is null the user canceled the task
//         if (results.response) {
//             delete alarms[results.response.entity];
//             session.send("Deleted the '%s' alarm.", results.response.entity);
//         } else {
//             session.send('Ok... no problem.');
//         }
//     }
// ]);

// dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand. I can only create & delete alarms."));

// // Very simple alarm scheduler
// var alarms = {};
// setInterval(function () {
//     var now = new Date().getTime();
//     for (var key in alarms) {
//         var alarm = alarms[key];
//         if (now >= alarm.timestamp) {
//             var msg = new builder.Message()
//                 .address(alarm.address)
//                 .text("Here's your '%s' alarm.", alarm.title);
//             bot.send(msg);
//             delete alarms[key];
//         }
//     }
// }, 15000);