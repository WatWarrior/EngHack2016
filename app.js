  var restify = require('restify');
 var builder = require('botbuilder');
 var uwaterlooApi = require('uwaterloo-api'); 
 // var http = require('http');

 var uwclient = new uwaterlooApi({
  API_KEY : '6deaa85efc3f6d96a02db0acf451f82f'
});

 // Setup Restify Server
  var server = restify.createServer();
  server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
  });
  
// Create chat bot
//var connector = new builder.ConsoleConnector().listen();
 var connector = new builder.ChatConnector({
     appId: process.env.MICROSOFT_APP_ID,
     appPassword: process.env.MICROSOFT_APP_PASSWORD
 });

 server.post('/api/messages', connector.listen());


// Create bot and bind to console

var bot = new builder.UniversalBot(connector, {
         localizerSettings: {
         botLocalePath: "./locale",
         defaultLocale: "en"
     }
 });

var model = 'https://api.projectoxford.ai/luis/v1/application?id=c413b2ef-382c-45bd-8ff0-f76d60e2a821&subscription-key=1d8c4b5de39944eea0dbef322202c269&q=';
var model_trained = 'https://api.projectoxford.ai/luis/v1/application?id=33148aa9-5199-4704-89f3-a91e68bff944&subscription-key=8dd0978101ba45b496273fdf065f91d3&q=';
var recognizer = new builder.LuisRecognizer(model);
var recognizer_trained = new builder.LuisRecognizer(model_trained)

var dialog = new builder.IntentDialog({ recognizers: [recognizer,recognizer_trained] });
bot.dialog('/', dialog);

// Add intent handlers

dialog.matches('FindPerson', [
   function (session, args, next){
   var person = builder.EntityRecognizer.findEntity(args.entities, 'person');

       uwclient.get('/directory/'+ person.entity ,function(err, res){

        if(!res.data){
            session.send('Cannot find any information about this person, Sorry!' );
        }
        
        else{
           var name = res.data.full_name;
         var department = res.data.department;
         
         session.send('The person\'s name is ' + name + ' ,in ' + department );

        }
       });    
   }]);


dialog.matches('ParkingLot', [
    function (session,  next){
        // uwclient.get('/weather/current',function(err, res){
        //     console.log(res);
        // })
    session.send('UW has four parking lots, which are C, N, W, X');
    
    }]);



// dialog.matches('weather', [
//     function (session, next){
//         uwclient.get('/weather/current',function(err, res){
//             console.log(res);
//         });    
//     }]);

dialog.matches('CourseInfo', [
	function (session, args, next){
     var course_subject = builder.EntityRecognizer.findEntity(args.entities, 'course_subject');
     var course_number = builder.EntityRecognizer.findEntity(args.entities, 'course_number');
     
       uwclient.get('/courses/'+ course_subject.entity + '/' + course_number.entity + '/schedule', {}, function(err, res){

       if(!res.data[0]){
        session.send('Cannot find any information about this course, Sorry!');
       }
       else{
        var title_info = res.data[0].title;
        var unit_info = res.data[0].units;
        var term_info = res.data[0].term;
        var academic_info = res.data[0].academic_level;

        session.send('course title is ' + title_info + ', course unit is ' + unit_info + ', in term #' + term_info
                    + ', for ' +  academic_info + '.'); 
       }
       
    });
     
	}])

dialog.matches('AboutUs', builder.DialogAction.send('WatWarriors!'));

dialog.matches('LocationOfUw', builder.DialogAction.send('200 University Ave W, Waterloo, ON N2L 3G1'));

// dialog.matches('builtin.intent.places.find_place', [
//      function (session, args, next) {

//         var title = builder.EntityRecognizer.findEntity(args.entities, 'builtin.places.absolute_location');
        
//         var place_info = session.dialogData.place = {
//           title: title ? title.entity : null,
  
//         };
        
//         // console.log(place_info.title);
//         if (!place_info.title) {
//             builder.Prompts.text(session, 'Where do you want to go?');
//         } else {
//             next();
//         }
//     },
    
//      function (session, results, next) {
//      	var place = session.dialogData.place;

//      	if (results.response) {
//             place.title = results.response;
//             next();
//         }

//     },

//      function (session, results){
//      	var place_info = session.dialogData.place;
//      	if(place_info.title == "RCH" || place_info.title == "rch"){
//      		session.send('Found place. You are in RCH');
//      	}
//         else{
//         	session.send('Sorry, I do not have any information about this building');
//         }
        
//      } 
// ]);

dialog.matches('WaterlooIntroduction', builder.DialogAction.send('The University of Waterloo (commonly referred to as Waterloo, UW or UWaterloo) \
is a public research university with a main campus located in Waterloo, Ontario.'));

dialog.onDefault(builder.DialogAction.send("Sorry I dont't understand."));