var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var MetaWeather = require('metaweather');
var https = require("https");
var hsDeck = require("deckstrings");
var fs = require("fs");
var jsToken = "";
var channelPath = __dirname + "/.channels";
var msg_id = [];
var servers = [];
var twitchOutput = [];

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

function print(msg, err){
    var date = new Date();
    var h = leadingZero(date.getHours());
    var m = leadingZero(date.getMinutes());
    var s = leadingZero(date.getSeconds());

    console.log("[" + h + ":" + m + ":" + s + "]", msg);
    if(err){
        console.log(err);
    }
}

function leadingZero(d){
    if(d < 10){
        return "0" + d;
    }else{
        return d;
    }
}

bot.on('disconnect', function(erMsg, code) {
    print('----- Bot disconnected from Discord with code', code, 'for reason:', erMsg, '-----');
    bot.connect();
});

function resetBot(channel) {
    bot.disconnect();
}

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, event) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
	   
        args = args.splice(1);
        switch(cmd.toLowerCase()) {
            // !ping
			case '8ball':
				bot.sendMessage({
					to: channelID,
					message: eightBall()
				});
            break;
			case 'waifu':
				bot.sendMessage({
					to: channelID,
					message: getWaifu(user, userID)
				});
           break;
			case 'help':
				getHelp(channelID);
           break;
			case 'hs':
				var fullString = '';
				for(var i = 0; i < args.length; i++){
					fullString += args[i] + ' ';
				}
			if (fullString != ''){
				getCard(fullString,channelID);
			} break;
			case 'myth':
				var fullString = '';
				for(var i = 0; i < args.length; i++){
					fullString += args[i] + ' ';
				}
			if (fullString != ''){
				getMyth(fullString,channelID);
			}
           break;
			case 'mtg':
				var fullString = '';
				for(var i = 0; i < args.length; i++){
					fullString += args[i] + ' ';
				}
			if (fullString != ''){
				getMagicCard(fullString,channelID);
			}
			break;
			case 'deck':
				var fullString = '';
				for(var i = 0; i < args.length; i++){
					fullString += args[i] + ' ';
				}
			if (fullString != ''){
				getDeck(fullString,channelID);
			}
           break;
			case 'funny':
				feelsFunny(channelID);
           break;
			case 'ayaya':
				getAyachan(channelID);
			break;
			case 'dog':
				getDogPicture(channelID);
           break;
			case 'cat':
				getCatPicture(channelID);
           break;
			case 'meme':
				getMeme(channelID);
           break;
			case 'thisisfine':
				fineThis(channelID);
          break;
			case 'weather':
				var fullString = '';
				for(var i = 0; i < args.length; i++){
					fullString += args[i] + ' ';
				}
				if (fullString != ''){
					getWeather(fullString,channelID);
				}
           break;
		   case 'purge':
				deleteMessage(channelID,userID);
           break;
         }
     }
});

//---------------------------Mod Commands-----------------------------------------------------------------------------
function deleteMessage (channel,usID){
	bot.getMessages({
		channelID: channel
	}, function (err,res){
		var objSer = JSON.stringify(res[0].timestamp);
		var objDeser = JSON.parse(objSer);
		var objDeserDates = jsonDates.parse(objSer);
		print(objDeserDates);
		var messageArray = [];
		//for(var i = 0; i < res.length; i++){
		//	if (res[i].timestamp )
		//	messageArray.push(res[i].id);
		//}
		//bot.deleteMessages({
		//	channelID: channel,
		//	messageIDs: messageArray
		//}, function (err2,res2){
		//	print(err2);
		//	print(res2);
		//});
	});
}

var jsonDates = {
  dtrx2: /\d{4}-\d{2}-\d{2}/,
  parse: function(obj){
      var parsedObj = JSON.parse(obj);
      return this.parseDates(parsedObj);
  },
  parseDates: function(obj){
    // iterate properties
    for(pName in obj){

      // make sure the property is 'truthy'
      if (obj[pName]){
        var value = obj[pName];
        // determine if the property is an array
        if (Array.isArray(value)){
          for(var ii = 0; ii < value.length; ii++){
            this.parseDates(value[ii]);
          }
        }
        // determine if the property is an object
        else if (typeof(value) == "object"){
          this.parseDates(value);
        }
        // determine if the property is a string containing a date
        else if (typeof(value) == "string" && this.dtrx2.test(value)){
          // parse and replace
          obj[pName] = new Date(obj[pName]);
        }
      }
    }

    return obj;
  }
};

//---------------------------Silly Commands-----------------------------------------------------------------------------

function eightBall() {
	var randomNum = Math.floor(Math.random() * Math.floor(20));
	switch(randomNum){
		case 1:
			return 'It is certain.';
			break;
		case 2:
			return 'It is decidedly so.';
			break;
		case 3:
			return 'Without a doubt.';
			break;
		case 4:
			return 'Yes - definitely.';
			break;
		case 5:
			return 'You may rely on it.';
			break;
		case 6:
			return 'As I see it, yes.';
			break;
		case 7:
			return 'Most Likely.';
			break;
		case 8:
			return 'Outlook good.';
			break;
		case 9:
			return 'Yes.';
			break;
		case 10:
			return 'Signs point to yes.';
			break;
		case 11:
			return 'Reply hazy, try again.';
			break;
		case 12:
			return 'Ask again later.';
			break;
		case 13:
			return 'Better not tell you now.';
			break;
		case 14:
			return 'Cannot predict now.';
			break;
		case 15:
			return 'Concentrate and ask again.';
			break;
		case 16:
			return 'Doun\'t count on it.';
			break;
		case 17:
			return 'My reply is no.';
			break;
		case 18:
			return 'My sources say no.';
			break;
		case 19:
			return 'Outlook not so good.';
			break;
		case 20:
			return 'Very doubtful.';
			break;
		default:
			return 'Not at all.';
			break;
		
	}
}

function feelsFunny(chanID){
	var funnyMan = '⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠛⠻⠿⣿⣿⣿⣿⣿⠿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⣿⣿⠟⠉⠄⠄⠄⠄⠄⠄⠄⠉⢟⠉⠄⠄⠄⠄⠄⠈⢻⣿⣿⣿⣿⣿\n⣿⣿⣿⣿⡿⠃⠄⠄⠤⠐⠉⠉⠉⠉⠉⠒⠬⡣⠤⠤⠄⠄⠄⠤⠤⠿⣿⣿⣿⣿\n⣿⣿⣿⣿⠁⠄⠄⠄⠄⠄⠄⠠⢀⡒⠤⠭⠅⠚⣓⡆⡆⣔⡙⠓⠚⠛⠄⣹⠿⣿\n⣿⠟⠁⡌⠄⠄⠄⢀⠤⠬⠐⣈⠠⡤⠤⠤⣤⠤⢄⡉⢁⣀⣠⣤⣤⣀⣐⡖⢦⣽\n⠏⠄⠄⠄⠄⠄⠄⠄⠐⠄⡿⠛⠯⠍⠭⣉⣉⠉⠍⢀⢀⡀⠉⠉⠉⠒⠒⠂⠄⣻\n⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠩⠵⠒⠒⠲⢒⡢⡉⠁⢐⡀⠬⠍⠁⢉⣉⣴⣿⣿\n⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠉⢉⣒⡉⠁⠁⠄⠄⠉⠂⠙⣉⣁⣀⣙⡿⣿⣿\n⠄⠄⠄⠄⠄⠄⠄⠄⢠⠄⡖⢉⠥⢤⠐⢲⠒⢲⠒⢲⠒⠲⡒⠒⡖⢲⠂⠄⢀⣿\n⠄⠄⠄⠄⠄⠄⠄⠄⠈⢆⡑⢄⠳⢾⠒⢺⠒⢺⠒⠚⡖⠄⡏⠉⣞⠞⠁⣠⣾⣿\n⠄⠄⠄⠄⠄⠄⢆⠄⠄⠄⠈⠢⠉⠢⠍⣘⣒⣚⣒⣚⣒⣒⣉⠡⠤⣔⣾⣿⣿⣿\n⠷⣤⠄⣀⠄⠄⠄⠈⠁⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⢀⣤⣾⣿⣿⣿⣿⣿\n⠄⠄⠉⠐⠢⠭⠄⢀⣒⣒⡒⠄⠄⠄⠄⠄⠄⣀⡠⠶⢶⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠈⠁⠈⠄⠄⠄⠄⠄⠄⠈⠻⣿⣿⣿⣿⣿⣿⣿'
		bot.sendMessage({
			to: chanID,
			message: funnyMan
		});
}

function getAyachan(chanID){
		var AYAYA = '⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣬⡛⣿⣿⣿⣯⢻\n⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⢻⣿⣿⢟⣻⣿⣿⣿⣿⣿⣿⣮⡻⣿⣿⣧\n⣿⣿⣿⣿⣿⢻⣿⣿⣿⣿⣿⣿⣆⠻⡫⣢⠿⣿⣿⣿⣿⣿⣿⣿⣷⣜⢻⣿\n⣿⣿⡏⣿⣿⣨⣝⠿⣿⣿⣿⣿⣿⢕⠸⣛⣩⣥⣄⣩⢝⣛⡿⠿⣿⣿⣆⢝\n⣿⣿⢡⣸⣿⣏⣿⣿⣶⣯⣙⠫⢺⣿⣷⡈⣿⣿⣿⣿⡿⠿⢿⣟⣒⣋⣙⠊\n⣿⡏⡿⣛⣍⢿⣮⣿⣿⣿⣿⣿⣿⣿⣶⣶⣶⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿\n⣿⢱⣾⣿⣿⣿⣝⡮⡻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⣋⣻⣿⣿⣿⣿\n⢿⢸⣿⣿⣿⣿⣿⣿⣷⣽⣿⣿⣿⣿⣿⣿⣿⡕⣡⣴⣶⣿⣿⣿⡟⣿⣿⣿\n⣦⡸⣿⣿⣿⣿⣿⣿⡛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⣿⣿⣿\n⢛⠷⡹⣿⠋⣉⣠⣤⣶⣶⣿⣿⣿⣿⣿⣿⡿⠿⢿⣿⣿⣿⣿⣿⣷⢹⣿⣿\n⣷⡝⣿⡞⣿⣿⣿⣿⣿⣿⣿⣿⡟⠋⠁⣠⣤⣤⣦⣽⣿⣿⣿⡿⠋⠘⣿⣿\n⣿⣿⡹⣿⡼⣿⣿⣿⣿⣿⣿⣿⣧⡰⣿⣿⣿⣿⣿⣹⡿⠟⠉⡀⠄⠄⢿⣿\n⣿⣿⣿⣽⣿⣼⣛⠿⠿⣿⣿⣿⣿⣿⣯⣿⠿⢟⣻⡽⢚⣤⡞⠄⠄⠄⢸⣿\n'
		bot.sendMessage({
			to: chanID,
			message: AYAYA
		});
}


function getWaifu(user, usID){
	var randomNum = Math.floor(Math.random() * Math.floor(100));
	
	if(usID == '265324731467563018'){
		randomNum = 100;
	}
	
	if (randomNum < 25) {
		return 'Baka! ' + '😠 \nWaifu Status: ' + randomNum + '/100';
	} else if (randomNum >= 25 && randomNum < 50) {
		return user + ' is more overrated than SAO! ' + '😤 \nWaifu Status: ' + randomNum + '/100';
	} else if (randomNum >= 50 && randomNum < 75) {
		return 'Senpai is looking pretty good today! ' + '😏 \nWaifu Status: ' + randomNum + '/100';
	} else if (randomNum >= 75 && randomNum < 100) {
		return user + ' would totes be my next body pillow!! ' + '😍 \nWaifu Status: ' + randomNum + '/100';
	} else if (randomNum == 100) {
		return 'ZOMG ' + user + '-chan is so kawaii!!!11!!1 OwO \nWaifu Status: ' + randomNum + '/100';
	} else {
		print('Uhhh.. waifu broke munkaS');
	}
}
function getDogPicture(chanID){
	var opt;
	var cardText = '';
    try {
        var apiPath;
            apiPath = "/api/breeds/image/random";
        opt = {
            host: "dog.ceo",
            path: apiPath,
        };
    }
    catch(err){
		print(err);
        return;
    }
	
	https.get(opt, (res)=>{
		
        var body = "";

        res.on("data", (chunk)=>{
            body += chunk;
        });

        res.on("end", ()=>{
            var json;
            try {
                json = JSON.parse(body);
            }
            catch(err){
                print(err);
                return;
            }
            if(json.status == 404){
                
            }else{
				bot.sendMessage({
								to: chanID,
								message: '',
								embed: {
									color: Math.floor(Math.random() * 16777214) + 1,
									title: 'Dogs!',
									url: '',
									image: {
										url: json.message
									}
								}
							});
			}
		});

    }).on("error", (err)=>{
        print(err);
    });
}

function getCatPicture(chanID){
	var opt;
	var cardText = '';
    try {
        var apiPath;
            apiPath = "/meow";
        opt = {
            host: "aws.random.cat",
            path: apiPath,
        };
    }
    catch(err){
		print(err);
        return;
    }
	
	https.get(opt, (res)=>{
		
        var body = "";

        res.on("data", (chunk)=>{
            body += chunk;
        });

        res.on("end", ()=>{
            var json;
            try {
                json = JSON.parse(body);
            }
            catch(err){
                print(err);
                return;
            }
            if(json.status == 404){
                
            }else{
				bot.sendMessage({
								to: chanID,
								message: '',
								embed: {
									color: Math.floor(Math.random() * 16777214) + 1,
									title: 'Cats!',
									url: '',
									image: {
										url: json.file
									}
								}
							});
			}
		});

    }).on("error", (err)=>{
        print(err);
    });
}

function getMeme(chanID){
	var opt;
    try {
        var apiPath;
            apiPath = "/gimme";
        opt = {
            host: "meme-api.herokuapp.com",
            path: apiPath,
        };
    }
    catch(err){
		print(err);
        return;
    }
	
	https.get(opt, (res)=>{
		
        var body = "";

        res.on("data", (chunk)=>{
            body += chunk;
        });

        res.on("end", ()=>{
            var json;
            try {
                json = JSON.parse(body);
            }
            catch(err){
                print(err);
                return;
            }
           if(json.status == 404){
               
           }else{
				bot.sendMessage({
								to: chanID,
								message: '',
								embed: {
									color: Math.floor(Math.random() * 16777214) + 1,
									title: json.title,
									footer: {
										text: json.subreddit
									},
									url: '',
									image: {
										url: json.url
									}
								}
							});
			}
		});

    }).on("error", (err)=>{
        print(err);
    });
}

//--------------------------------Hearthstone Commands-----------------------------------------------------------------------------


function getCard(card,channelID){
	var opt;
	var cardText = '';
	
    try {
        var apiPath;
            apiPath = "/v1/83143/enUS/cards.collectible.json";
        opt = {
            host: "api.hearthstonejson.com",
            path: apiPath,
        };
    }
    catch(err){
		print(err);
        return;
    }
	
	https.get(opt, (res)=>{
		
        var body = "";

        res.on("data", (chunk)=>{
            body += chunk;
        });

        res.on("end", ()=>{
            var json;
            try {
                json = JSON.parse(body);
            }
            catch(err){
                print(err);
                return;
            }
            if(json.status == 404){
                
            }else{
				for(var c = 0; c < json.length; c++){
					if (!(typeof json[c].name === 'undefined')){
						var compStr = ".*" + card.trim().toLowerCase() + ".*";
						var regex = new RegExp(compStr,'g');
						if(json[c].name.toLowerCase() == card.trim().toLowerCase()){
							if (!(typeof json[c].text === 'undefined')){
								cardText = json[c].text;
							}
							bot.sendMessage({
								to: channelID,
								message: '',
								embed: {
									color: classColor(json[c].cardClass),
									footer: {
										text: fixCardText(json[c].flavor)
									},
									thumbnail: {
										url: 'https://art.hearthstonejson.com/v1/render/latest/enUS/512x/' + json[c].id + '.png'
									},
									title: json[c].name,
									url: '',
									fields: [{
											name: 'Type',
											value: json[c].type.toLowerCase(),
											inline:true
									},
									{
										name: 'Class',
										value: fixClass(json[c].cardClass),
										inline:true
									},
									{
										name: 'Rarity',
										value: fixRarity(json[c]),
										inline:true
									},
									{
										name: 'Set',
										value: fixHSSet(json[c].set),
										inline:true
									},
									{
										name: 'Card Text',
										value: fixCardText(cardText)
									}
									]
								}
							});
							return;
						}
					}
				}
				for(var c = 0; c < json.length; c++){
					if (!(typeof json[c].name === 'undefined')){
						var compStr = ".*" + card.trim().toLowerCase() + ".*";
						var regex = new RegExp(compStr,'g');
						if (json[c].name.toLowerCase().match(regex)){
							if (!(typeof json[c].text === 'undefined')){
								cardText = json[c].text;
							}
							bot.sendMessage({
								to: channelID,
								message: '',
								embed: {
									color: classColor(json[c].cardClass),
									footer: {
										text: fixCardText(json[c].flavor)
									},
									thumbnail: {
										url: 'https://art.hearthstonejson.com/v1/render/latest/enUS/512x/' + json[c].id + '.png'
									},
									title: json[c].name,
									url: '',
									fields: [{
											name: 'Type',
											value: json[c].type.toLowerCase(),
											inline:true
									},
									{
										name: 'Class',
										value: fixClass(json[c].cardClass),
										inline:true
									},
									{
										name: 'Rarity',
										value: fixRarity(json[c]),
										inline:true
									},
									{
										name: 'Set',
										value: fixHSSet(json[c].set),
										inline:true
									},
									{
										name: 'Card Text',
										value: fixCardText(cardText)
									}
									]
								}
							});
							return;
						}
					}
				}
				
				bot.sendMessage({
					to: channelID,
					message: 'Could not find that card. Please try again.'
				});
				return;
            }
        });

    }).on("error", (err)=>{
        print(err);
    });
}

function fixHSSet(set){
	switch (set){
		case 'BOOMSDAY':
			return 'The Boomsday Project';
			break;
		case 'BRM':
			return 'Blackrock Mountain';
			break;
		case 'CORE':
			return 'Basic';
			break;
		case 'DALARAN':
			return 'Rise of Shadows';
			break;
		case 'EXPERT1':
			return 'Classic';
			break;
		case 'GANGS':
			return 'Mean Streets of Gadgetzan';
			break;
		case 'GVG':
			return 'Goblins vs Gnomes';
			break;
		case 'HERO_SKINS':
			return 'Hero Skin';
			break;
		case 'HOF':
			return 'Hall of Fame';
			break;
		case 'ICECROWN':
			return 'Knights of the Frozen Throne';
			break;
		case 'KARA':
			return 'One Night in Karazhan';
			break;
		case 'LOE':
			return 'The League of Explorers';
			break;
		case 'LOOTAPALOOZA':
			return 'Kobolds & Catacombs';
			break;
		case 'NAXX':
			return 'Naxxramas';
			break;
		case 'OG':
			return 'Whispers of the Old Gods';
			break;
		case 'TGT':
			return 'The Grand Tournament';
			break;
		case 'TROLL':
			return 'Rastakhan\'s Rumble';
		break;
		case 'UNGORO':
			return 'Journey to Un\'Goro';
			break;
		case 'GILNEAS':
			return 'The Witchwood';
			break;
		case 'ULDUM':
			return 'Saviors of Uldum';
			break;
		case 'YEAR_OF_THE_DRAGON':
			return 'Galakrond\'s Awakening';
			break;
		case 'BLACK_TEMPLE':
			return 'Ashes of Outland';
			break;
		case 'SCHOLOMANCE':
			return 'Scholomance Academy';
			break;
		default:
			return set;
		
	}
}

function fixCardText(text){
	
	var fixText = 'None'
	
	if (text != '' && !(typeof text === 'undefined')){
	
		fixText = text.replace(/<b><b>/gi,'<b>');
		
		fixText = fixText.replace(/Lifesteal,/gi,'<b>Lifesteal</b>,');
		
		fixText = fixText.replace(/ Rush<\/b>/gi,' <b>Rush</b>,');
		
		fixText = fixText.replace(/<b>/gi,'**');
		
		fixText = fixText.replace(/<\/b>/gi,'**');
		
		fixText = fixText.replace(/<i>/gi,'*');
		
		fixText = fixText.replace(/<\/i>/gi,'*');
	}
	
	return fixText;
}

function fixRarity(rare){
	
	if(!(typeof rare.rarity === 'undefined')){
	
		switch(rare.rarity){
			case 'COMMON':
				return 'Common';
				break;
			case 'RARE':
				return 'Rare';
				break;
			case 'EPIC':
				return 'Epic';
				break;
			case 'LEGENDARY':
				return 'Legendary';
				break;
			case 'FREE':
				return 'Free';
				break;
			default:
				return rare.rarity;
		}
	} else {
		return 'Not Collectable';
	}
}

function fixClass(hsClass){
	switch(hsClass){
		case 'DRUID':
			return 'Druid';
			break;
		case 'HUNTER':
			return 'Hunter';
			break;
		case 'MAGE': 
			return 'Mage';
			break;
		case 'PALADIN': 
			return 'Paladin';
			break;
		case 'PRIEST': 
			return 'Priest';
			break;
		case 'ROGUE': 
			return 'Rogue';
			break;
		case 'SHAMAN': 
			return 'Shaman';
			break;
		case 'WARLOCK': 
			return 'Warlock';
			break;
		case 'WARRIOR': 
			return 'Warrior';
			break;
		case 'DEATHKNIGHT':
			return 'Deathknight';
			break;
		case 'DEMONHUNTER':
			return 'Demon Hunter';
			break;
		case 'NEUTRAL': 
			return 'Neutral';
			break;
		default:
			return hsClass;
		
	}
}
function classColor(hsClass){
	switch(hsClass){
		case 'DRUID':
			return 5191455;
			break;
		case 'HUNTER':
			return 3502628;
			break;
		case 'MAGE': 
			return 37547;
			break;
		case 'PALADIN': 
			return 14068533;
			break;
		case 'PRIEST': 
			return 14870006;
			break;
		case 'ROGUE': 
			return 4408136;
			break;
		case 'SHAMAN': 
			return 4343455;
			break;
		case 'WARLOCK': 
			return 7492484;
			break;
		case 'WARRIOR': 
			return 10108216;
			break;
		case 'DEATHKNIGHT':
			return 495364;
			break;
		case 'DEMONHUNTER':
			return 3978097;
			break;
		case 'NEUTRAL': 
			return 9539215;
			break;
		default:
			return 0000000;
		
	}
}

//------------------------------HSDeck-------------------------------------------------

async function getDeck(str,chanID){	
	
	const decoded = hsDeck.decode(str);
	
	var classCards = await getDeckClassCard(decoded.cards);
	var neutralCards = await getDeckNeutralCard(decoded.cards);

	var neutralC = 'none';
	var classC = 'none';
	
	if(classCards){
		classC = classCards;
	};
	if(neutralCards){
		neutralC = neutralCards;
	};
	bot.sendMessage({
		to: chanID,
		message: '',
		embed: {
			color: getDeckHeroColor(decoded.heroes),
			footer: {
				text: ''
			},
			thumbnail: {
				url: ''
			},
			title: getDeckHero(decoded.heroes),
			url: '',
			fields: [{
					name: 'Class Cards',
					value: classC,
					inline: true
			},
			{
					name: 'Neutral Cards',
					value: neutralC,
					inline: true
			}
			]
		}
	});
}

function getDeckHeroColor(heroID){
	switch(heroID[0]){
		case 274: //druid
			return 5191455;
			break;
		case 50484: //druid
			return 5191455;
			break;
		case 56358: 
			return 5191455;
			break;
		case 31: //hunter
			return 3502628;
			break;
		case 637: //mage
			return 37547;
			break;
		case 671: //paladin
			return 14068533;
			break;
		case 813: //priest
			return 14870006;
			break;
		case 930: //rogue
			return 4408136;
			break;
		case 40183: //shaman
			return 4343455;
			break;
		case 1066: //shaman
			return 4343455;
			break;
		case 51834: //warlock
			return 7492484;
			break;
		case 893:
			return 7492484;
			break;
		case 7: //warrior
			return 10108216;
			break;
		default:
			break;
	}
}

function getDeckHero(heroID){
	switch(heroID[0]){
		case 274:
			return 'Druid';
			break;
		case 50484: //druid
			return 'Druid';
			break;
		case 56358: 
			return 'Druid';
			break;
		case 31:
			return 'Hunter';
			break;
		case 637:
			return 'Mage';
			break;
		case 671:
			return 'Paladin';
			break;
		case 813:
			return 'Priest';
			break;
		case 930:
			return 'Rogue';
			break;
		case 40183:
			return 'Shaman';
			break;
		case 1066: //shaman
			return 'Shaman';
			break;
		case 51834:
			return 'Warlock';
			break;
		case 893:
			return 'Warlock';
			break;
		case 7:
			return 'Warrior';
			break;
		default:
			break;
	}
}

function getDeckClassCard(cards){
	return new Promise(resolve => {
		var opt;
		var output = ''
		try {
			var apiPath;
				apiPath = "/v1/83143/enUS/cards.json";
			opt = {
				host: "api.hearthstonejson.com",
				path: apiPath,
			};
		}
		catch(err){
			print(err);
			return;
		}
		
		https.get(opt, (res)=>{
			
			var body = "";
	
			res.on("data", (chunk)=>{
				body += chunk;
			});
	
			res.on("end", ()=>{
				var json;
				try {
					json = JSON.parse(body);
				}
				catch(err){
					print(err);
					return;
				}
				if(json.status == 404){
					
				}else{
					var orderCards = [[],[]];
					for (var c = 0; c < cards.length; c++){
						for(var j = 0; j < json.length; j++){
							if (!(typeof json[j].dbfId === 'undefined')){
								if(json[j].dbfId == cards[c][0]){
									if(json[j].cardClass != 'NEUTRAL'){
										if(orderCards[0].length < 1) {
											orderCards[0][0] = json[j].name;
											orderCards[0][1] = json[j].cost;
											orderCards[0][2] = cards[c][1];
											orderCards.splice(1,1);
										} else {
											for(var o = 0; o < orderCards.length; o++){
												if (json[j].cost == orderCards[o][1]){
													if(json[j].name < orderCards[o][0]){
														orderCards.splice(o,0,[json[j].name,json[j].cost,cards[c][1]]);
														break;
													} else if (json[j].name.substring(0,1) > orderCards[o][0].substring(0,1)){
														if ((o+1) == orderCards.length){
															orderCards.push([json[j].name,json[j].cost,cards[c][1]]);
															break;
														}
													} else {
														orderCards.splice(o,0,[json[j].name,json[j].cost,cards[c][1]]);
														break;
													}
												} else if (json[j].cost > orderCards[o][1]){
													if ((o+1) == orderCards.length){
														orderCards.push([json[j].name,json[j].cost,cards[c][1]]);
														break;
													}
												} else if (json[j].cost < orderCards[o][1]){
													orderCards.splice(o,0,[json[j].name,json[j].cost,cards[c][1]]);
													break;
												} else {
													orderCards.push([json[j].name,json[j].cost,cards[c][1]]);
													break;
												}
											}
										}
									}
								}
							}
						}
					}
					for (var out = 0; out < orderCards.length;out++){
						if (orderCards[out].length > 0){
							output += orderCards[out][2] + 'x ' + orderCards[out][0] + '\n'
						}
					}
					resolve(output);
				}
			});
	
		}).on("error", (err)=>{
			print(err);
		});
	});
}

function getDeckNeutralCard(cards){
	return new Promise(resolve => {
		var opt;
		var output = ''
		try {
			var apiPath;
				apiPath = "/v1/83143/enUS/cards.json";
			opt = {
				host: "api.hearthstonejson.com",
				path: apiPath,
			};
		}
		catch(err){
			print(err);
			return;
		}
		
		https.get(opt, (res)=>{
			
			var body = "";
	
			res.on("data", (chunk)=>{
				body += chunk;
			});
	
			res.on("end", ()=>{
				var json;
				try {
					json = JSON.parse(body);
				}
				catch(err){
					print(err);
					return;
				}
				if(json.status == 404){
					
				}else{
					var orderCards = [[],[]];
					for (var c = 0; c < cards.length; c++){
						for(var j = 0; j < json.length; j++){
							if (!(typeof json[j].dbfId === 'undefined')){
								if(json[j].dbfId == cards[c][0]){
									if(json[j].cardClass == 'NEUTRAL'){
										if(orderCards[0].length < 1) {
											orderCards[0][0] = json[j].name;
											orderCards[0][1] = json[j].cost;
											orderCards[0][2] = cards[c][1];
											orderCards.splice(1,1);
										} else {
											for(var o = 0; o < orderCards.length; o++){
												if (json[j].cost == orderCards[o][1]){
													if(json[j].name < orderCards[o][0]){
														orderCards.splice(o,0,[json[j].name,json[j].cost,cards[c][1]]);
														break;
													} else if (json[j].name.substring(0,1) > orderCards[o][0].substring(0,1)){
														if ((o+1) == orderCards.length){
															orderCards.push([json[j].name,json[j].cost,cards[c][1]]);
															break;
														}
													} else {
														orderCards.splice(o,0,[json[j].name,json[j].cost,cards[c][1]]);
														break;
													}
												} else if (json[j].cost > orderCards[o][1]){
													if ((o+1) == orderCards.length){
														orderCards.push([json[j].name,json[j].cost,cards[c][1]]);
														break;
													}
												} else if (json[j].cost < orderCards[o][1]){
													orderCards.splice(o,0,[json[j].name,json[j].cost,cards[c][1]]);
													break;
												} else {
													orderCards.push([json[j].name,json[j].cost,cards[c][1]]);
													break;
												}
											}
										}
									}
								}
							}
						}
					}
					for (var out = 0; out < orderCards.length;out++){
						if (orderCards[out].length > 0){
							output += orderCards[out][2] + 'x ' + orderCards[out][0] + '\n'
						}
					}
					resolve(output);
				}
			});
	
		}).on("error", (err)=>{
			print(err);
		});
	});
}


//-------------------------------------------------------------------------------------

function indexOfObjectByName(array, value){
    for(let i = 0; i < array.length; i++){
        if(array[i].name.toLowerCase().trim() === value.toLowerCase().trim()){
            return i;
        }
    }
    return -1;
}

//------------------------------------mod commands-------------------------------------

function getHelp(chanID){
	
	bot.sendMessage({
							to: chanID,
							message: '',
							embed: {
								color: 9539215,
								footer: {
									text: "Please preface all commands with '!'"
								},
								thumbnail: {
									url: ''
								},
								title: '',
								url: '',
								fields: [{
										name: '😎 Fun Commands',
										value: 
											"**8ball -** Ask the bot anything and see what fate has in store for you.\n" +
											"**ayaya -** AYAYA?? AYAYA!!\n" +
											"**cat -** Return a pretty picture of a kitty!\n" +
											"**dog -** Retrieve a wonderful picture of a doggy!\n" +
											"**funny -** PepeLaugh\n" +
											"**meme -** Get a random may-may from the internet!\n" +
											"**waifu -** See where you stack in waifu ranking!\n\n" +
											"**weather [city] -** Get a 5 day forecast for a chosen city! Not all cities are supported.\n\n"
								},
								{
									name: '🤑 Hearthstone Commands',
									value: "**hs [] -** Replace braces with an HS card to list its info!\n" +
											"**deck [] -** Replace the braces with your HS deckstring to output the deck in Discord!\n\n"
								},
								{
									name: '🤓 Magic Commands',
									value: "**mtg [] -** Replace braces with a Magic card to list its info!\n"
								}
			]
							}
						});
}

//----------------------------Weather-------------------------------

async function getWeather(city,channelID){
	var today = new Date();
	var output;
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	var thisday = yyyy + '/' + mm + '/' + dd;
	
	var setID = await searchCity(city);
	if(setID != 'None'){
		var output = await getForecast(setID,thisday,channelID);
	}
}

function searchCity(city){
	return new Promise(resolve => {
		var mw = new MetaWeather;
		mw.search().query(city).then(function(response) {
			if(!(typeof response.body[0] === 'undefined')){
				resolve(response.body[0].woeid);
			} else {
				resolve('None');
			}
		});
	});
}

function getForecast(cityID,thisday,channelID){
	return new Promise(resolve => {
		var mw = new MetaWeather;
		var d = new Date();
		var n = d.getDay();
		mw.location(cityID).then(function(response) {
			bot.sendMessage({
							to: channelID,
							message: '',
							embed: {
								color: Math.floor(Math.random() * 16777214) + 1,
								footer: {
									text: 'Units are Celsius and km/hr. Forecast provided by Metaweather.com'
								},
								thumbnail: {
									url: ''
								},
								title: 'Forecast for ' + response.body.title,
								url: '',
								fields: [{
										name: 'Today',
										value: getIcon(response.body.consolidated_weather[0].weather_state_abbr) + ' ' + response.body.consolidated_weather[0].weather_state_name + '\n' + 'Max: ' + response.body.consolidated_weather[0].max_temp.toFixed(2) + '\n' + 'Min: ' + response.body.consolidated_weather[0].min_temp.toFixed(2) + '\n' + 'Wind: ' + response.body.consolidated_weather[0].wind_speed.toFixed(2),
										inline:true
								},
								{
										name: 'Tomorrow',
										value: getIcon(response.body.consolidated_weather[1].weather_state_abbr) + ' ' + response.body.consolidated_weather[1].weather_state_name + '\n' + 'Max: ' + response.body.consolidated_weather[1].max_temp.toFixed(2) + '\n' + 'Min: ' + response.body.consolidated_weather[1].min_temp.toFixed(2) + '\n' + 'Wind: ' + response.body.consolidated_weather[1].wind_speed.toFixed(2),
										inline:true
								},
								{
										name: '\u200b',
										value: '\u200b'
								},
								{
										name: getDayWeek(n+2) + ' ' + response.body.consolidated_weather[2].applicable_date.substring(5, 7) + '/' + response.body.consolidated_weather[2].applicable_date.substring(8, 10),
										value: getIcon(response.body.consolidated_weather[2].weather_state_abbr) + ' ' + response.body.consolidated_weather[2].weather_state_name + '\n' + 'Max: ' + response.body.consolidated_weather[2].max_temp.toFixed(2) + '\n' + 'Min: ' + response.body.consolidated_weather[2].min_temp.toFixed(2) + '\n' + 'Wind: ' + response.body.consolidated_weather[2].wind_speed.toFixed(2),
										inline:true
								},
								{
										name: getDayWeek(n+3) + ' ' + response.body.consolidated_weather[3].applicable_date.substring(5, 7) + '/' + response.body.consolidated_weather[3].applicable_date.substring(8, 10),
										value: getIcon(response.body.consolidated_weather[3].weather_state_abbr) + ' ' + response.body.consolidated_weather[3].weather_state_name + '\n' + 'Max: ' + response.body.consolidated_weather[3].max_temp.toFixed(2) + '\n' + 'Min: ' + response.body.consolidated_weather[3].min_temp.toFixed(2) + '\n' + 'Wind: ' + response.body.consolidated_weather[3].wind_speed.toFixed(2),
										inline:true
								},
								{
										name: getDayWeek(n+4) + ' ' + response.body.consolidated_weather[4].applicable_date.substring(5, 7) + '/' + response.body.consolidated_weather[4].applicable_date.substring(8, 10),
										value: getIcon(response.body.consolidated_weather[4].weather_state_abbr) + ' ' + response.body.consolidated_weather[4].weather_state_name + '\n' + 'Max: ' + response.body.consolidated_weather[4].max_temp.toFixed(2) + '\n' + 'Min: ' + response.body.consolidated_weather[4].min_temp.toFixed(2) + '\n' + 'Wind: ' + response.body.consolidated_weather[4].wind_speed.toFixed(2),
										inline:true
								}
								]
							}
						});
		});
	});
}

function getIcon(code){
	switch(code){
		case 'sn':
			return '<:sn:611214132259192852>';
			break;
		case 'sl':
			return '<:sl:611214132347273216>';
			break;
		case 'h':
			return '<:h_:611214132062191619>';
			break;
		case 't':
			return '<:t_:611214132296810516>';
			break;
		case 'hr':
			return '<:hr:611214132208730123>';
			break;
		case 'lr':
			return '<:lr:611214132234027126>';
			break;
		case 's':
			return '<:s_:611214132015792159>';
			break;
		case 'hc':
			return '<:hc:611214131965460481>';
			break;
		case 'lc':
			return '<:lc:611214131915390989>';
			break;
		case 'c':
			return '<:c_:611214132238221315>';
			break;
	}
}

function getDayWeek(day){
	if(day > 6){
		day = day - 7;
	}
	switch(day){
		case 0:
			return 'Sunday';
			break;
		case 1:
			return 'Monday';
			break;
		case 2:
			return 'Tuesday';
			break;
		case 3:
			return 'Wednesday';
			break;
		case 4:
			return 'Thursday';
			break;
		case 5:
			return 'Friday';
			break;
		case 6:
			return 'Saturday';
			break;
	}
}

//----------------------------Magic-------------------------------

function getMagicCard(card,channelID){
	var opt;
		try {
			var apiPath;
			var endPath = card.trim();
			endPath = endPath.replace(/[^\w ]/,'');
			endPath = endPath.replace(/\s/g,'%20');
				apiPath = '/cards/search?q=name='+endPath;
			opt = {
				host: "api.scryfall.com",
				path: apiPath,
			};
		}
		catch(err){
			print(err);
			return;
		}
		
		https.get(opt, (res)=>{
			
			var body = "";
	
			res.on("data", (chunk)=>{
				body += chunk;
			});
	
			res.on("end", async ()=>{
				var json;
				try {
					json = JSON.parse(body);
				}
				catch(err){
					print(err);
					return;
				}
				if(json.status == 404){
					bot.sendMessage({
								to: channelID,
								message: 'Sorry, but the card you searched cannot be found. Please try again!'
					});
				}else{
					var iter = 0;
					if(!(typeof json.data[iter] === 'undefined')){
						for(var i = 0; i < json.data.length; i++){
						if(json.data[i].name.toLowerCase() == card.trim().toLowerCase()){
							iter = i;
							break;
						}
					}
					if(json.data[iter].type == 'Vanguard'){
						if(!(typeof json.data[iter+1] === 'undefined')){
							iter = iter + 1;
						} else {
							bot.sendMessage({
								to: channelID,
								message: 'Sorry, card could not be found. Please try again!'
							});
						}
					}
					var printings = '';
					var scryLink,nameCard,flavor;
					var power = 'Non-Creature';
					var powerText = 'Power/Toughness'
					if (!(typeof json.data[iter].power === 'undefined')){
						power = json.data[iter].power.replace(/\*/g,'\\\*') + '/' + json.data[iter].toughness.replace(/\*/g,'\\\*');
					} else {
						if (!(typeof json.data[iter].loyalty === 'undefined')){
							powerText = 'Loyalty';
							power = json.data[iter].loyalty;
						} 
					}
					if (!(typeof json.data[iter].names === 'undefined')) {
						for (var j = 0; j < json.data[iter].names.length; j++){
							var k = j+1;
							if(k == json.data[iter].names.length){
								nameCard = nameCard + json.data[iter].names[j];
							} else if(!(k == json.data[iter].names.length)){
								if(j == 0) {
									nameCard = json.data[iter].names[j] + ' // ';
								} else {
									nameCard = nameCard + json.data[iter].names[j] + ' // ';
								}
							} else {
								nameCard = json.data[iter].names[j];
							}
						}
					} else {
						nameCard = json.data[iter].name;
					}
					if(!(json.data[iter].flavor === 'undefined')){
						flavor = json.data[iter].flavor;
					} else {
						flavor = '';
					}
					bot.sendMessage({
								to: channelID,
								message: '',
								embed: {
									color: setColorMagic(json.data[iter].color_identity),
									footer: {
										text: json.data[iter].flavor
									},
									thumbnail: {
										url: json.data[iter].image_uris.art_crop
									},
									title: json.data[iter].name,
									url: json.data[iter].scryfall_uri,
									fields: [{
											name: 'Type',
											value: json.data[iter].type_line,
											inline:true
									},
									{
										name: 'Cost',
										value: correctMana(json.data[iter].mana_cost),
										inline:true
									},
									{
										name: 'Rarity',
										value: json.data[iter].rarity.charAt(0).toUpperCase() + json.data[iter].rarity.slice(1),
										inline:true
									},
									{
										name: powerText,
										value: power,
										inline:true
									},
									{
										name: 'Set',
										value: json.data[iter].set_name,
										inline:true
									},
									{
										name: 'Artist',
										value: json.data[iter].artist,
										inline:true
									},
									{
										name: 'Card Text',
										value: correctMana(json.data[iter].oracle_text)
									}
									]
								}
					}, function(err, res){
						print(err);
						if(err != null){
							bot.sendMessage({
								to: channelID,
								message: 'Error. Please ping Krillin for assistance. <:WeirdChamp:588989424583311381>'
							});
						}
					});
					} else {
						bot.sendMessage({
								to: channelID,
								message: 'Sorry, card could not be found. Please try again!'
							});
					}
				}
		}).on("error", (err)=>{
			print(err);
		});
});
}

function setColorMagic(color){
	if(color.length < 2){
		switch(color[0]){
			case 'R':
				return 0xFF0000;
			break;
			case 'W':
				return 0xFFFFFF;
			break;
			case 'B':
				return 0x000000;
			break;
			case 'U':
				return 0x0000FF;
			break;
			case 'G':
				return 0x008000;
			break;
			default:
				return 0xA9A9A9;
		}
	} else {
		return 0xDAA520;
	}
}

function correctMana(manaCost){
	if(!(typeof manaCost === 'undefined') && manaCost != ''){
		var newMana;
		newMana = manaCost.replace(/{B}/g,' <:Mana_B:611428122499219466> ');
		newMana = newMana.replace(/{W}/g,' <:Mana_W:611428122524516377> ');
		newMana = newMana.replace(/{U}/g,' <:Mana_U:611428122411401236> ');
		newMana = newMana.replace(/{G}/g,' <:Mana_G:611428122486767686> ');
		newMana = newMana.replace(/{R}/g,' <:Mana_R:611428122537099283> ');
		newMana = newMana.replace(/{B\/P}/g,' <:Mana_BP:612106777068175361> ');
		newMana = newMana.replace(/{R\/P}/g,' <:Mana_RP:612106777009455147> ');
		newMana = newMana.replace(/{W\/P}/g,' <:Mana_WP:612106777185746966> ');
		newMana = newMana.replace(/{U\/P}/g,' <:Mana_UP:612106777491931146> ');
		newMana = newMana.replace(/{G\/P}/g,' <:Mana_GP:612106777387073546> ');
		newMana = newMana.replace(/{S}/g,' <:Mana_Sn:612109749663563777> ');
		
		//Numbers
		newMana = newMana.replace(/\{0}/g,' <:generic0:612348458531028996> ');
		newMana = newMana.replace(/\{1}/g,' <:generic1:612106777172901898> ');
		newMana = newMana.replace(/\{2}/g,' <:generic2:612108292239392778> ');
		newMana = newMana.replace(/\{3}/g,' <:generic3:612108642979938314> ');
		newMana = newMana.replace(/\{4}/g,' <:generic4:612107778240151562> ');
		newMana = newMana.replace(/\{5}/g,' <:generic5:612108643038658580> ');
		newMana = newMana.replace(/\{6}/g,' <:generic6:612106777244205092> ');
		newMana = newMana.replace(/\{7}/g,' <:generic7:612108937893904385> ');
		newMana = newMana.replace(/\{8}/g,' <:generic8:612108919170531328> ');
		newMana = newMana.replace(/\{9}/g,' <:generic9:612108919048765461> ');
		newMana = newMana.replace(/\{10}/g,' <:generic10:612108919073931284> ');
		newMana = newMana.replace(/\{11}/g,' <:generic11:612109590447783939> ');
		newMana = newMana.replace(/\{12}/g,' <:generic12:612109590695247882> ');
		newMana = newMana.replace(/\{13}/g,' <:generic13:612109590686990336> ');
		newMana = newMana.replace(/\{14}/g,' <:generic14:612109590771007488> ');
		newMana = newMana.replace(/\{15}/g,' <:generic15:612109590707961856> ');
		newMana = newMana.replace(/\{16}/g,' <:generic16:612109590749773844> ');
		newMana = newMana.replace(/\{17}/g,' <:generic17:612109590779265024> ');
		newMana = newMana.replace(/\{18}/g,' <:generic18:612109590779133973> ');
		newMana = newMana.replace(/\{19}/g,' <:generic19:612109590557097995> ');
		newMana = newMana.replace(/\{20}/g,' <:generic20:612109590749773905> ');
		newMana = newMana.replace(/{X}/g,' <:genericX:612108331108270090> ');
		newMana = newMana.replace(/{T}/g,' <:genericT:612122293736570890> ');
		newMana = newMana.replace(/{C}/g,' <:genericC:612122293547696140> ');
		
		//hybrid
		newMana = newMana.replace(/\{W\/U}/g,' <:hybridWU:612127806788468736> ');
		newMana = newMana.replace(/\{W\/B}/g,' <:hybridWB:612127806825955328> ');
		newMana = newMana.replace(/\{U\/R}/g,' <:hybridUR:612127806700388392> ');
		newMana = newMana.replace(/\{U\/B}/g,' <:hybridUB:612127806750457881> ');
		newMana = newMana.replace(/\{R\/W}/g,' <:hybridRW:612127806310055977> ');
		newMana = newMana.replace(/\{R\/G}/g,' <:hybridRG:612127806729748501> ');
		newMana = newMana.replace(/\{G\/W}/g,' <:hybridGW:612127806620434433> ');
		newMana = newMana.replace(/\{G\/U}/g,' <:hybridGU:612127806393942041> ');
		newMana = newMana.replace(/\{B\/R}/g,' <:hybridBR:612127806444535810> ');
		newMana = newMana.replace(/\{B\/G}/g,' <:hybridBG:612127806683480083> ');
		newMana = newMana.replace(/\{2\/W}/g,' <:hybrid2W:612127806456856615> ');
		newMana = newMana.replace(/\{2\/U}/g,' <:hybrid2U:612127806607982610> ');
		newMana = newMana.replace(/\{2\/R}/g,' <:hybrid2R:612127806377164821> ');
		newMana = newMana.replace(/\{2\/G}/g,' <:hybrid2G:612127806616240128> ');
		newMana = newMana.replace(/\{2\/B}/g,' <:hybrid2B:612127806289346571> ');
		
		return newMana;
	}
	return('None');
}
