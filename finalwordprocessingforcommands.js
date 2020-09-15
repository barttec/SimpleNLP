/*

steps to do this

    1 get words from user
    2 spellcheck the words (for top 10,000 words)
    3 classify the words into nouns and verbs
    4 add synonyms to the final words
    5 Translate the commands into synonyms
    6 compare comand synoyms to extracted synonyms
    7 if a command is found execute it if not - restart

*/
const dictionary = require('fs').readFileSync("google-10000-english.txt", 'utf-8').split('\n') //This is just an array of words
const nlp = require('compromise');
const natural = require('natural');
const readlineSync = require('readline-sync');
const thesaurus = require("thesaurus");
const tokenizer = new natural.TreebankWordTokenizer();


//sleep function use like this: sleep(ms);
function sleep(ms) {
    var waitTill = new Date(new Date().getTime() + ms);
    while(waitTill > new Date()){}
}   

//define known commands
var commands = [
    'kill the humans',
    'greet our guests',
    'turn off the lights',
    'thank you',
    'show them mercy',
    'play some music',
    'silence the crowd',
    'destory the enemy base'
]


//console.log('_____________ STAGE 1 Begin _____________');
// ask the user
var rawword = readlineSync.question('Yes master? ');
//debug
var start = new Date().getTime();// measure time for whole procedure after user input words

// lower case it ( for comparison later on)
var nlpword = nlp(rawword).toLowerCase()
// tokenise it
var processed = nlpword.terms().out('array')
//console.log('_____________ STAGE 1 Passed _____________');

//console.log('_____________ STAGE 2 Begin _____________');
//create a spellcheck object based off our 10000 word dictionary
var spellcheck = new natural.Spellcheck(dictionary);
//define the depth
var depth = 1; // one character deviation
//define a misspelt array
var misspelt = [];
//check if the words in the processed array already are correct (ie look though the diconary array for them)
processed.forEach(element => {
    if(dictionary.indexOf(element) == -1) {
        misspelt.push(element);
    }
});
//loop though all words spellchecking them
misspelt.forEach(word => {
    let betterspelling = spellcheck.getCorrections(word, depth); // ['something'] fast
    if(betterspelling.length != 0) {// if a correction is found replace original with correction
        processed[processed.indexOf(word)] = betterspelling[0]; // set the original word to spelt better if word is not found then it will just remove it ;)
    }
});
//join together processed words
rawwordsspeltchecked = processed.join(" ");
//console.log('_____________ STAGE 2 Passed _____________');

//console.log('_____________ STAGE 3 Begin _____________');
//create a new nlp doc object based of our spelt correctly words
var nlpword = nlp(rawwordsspeltchecked)//.toLowerCase()
//get the nouns out
var nlpverbs = [];//nlpword.verbs().out('array')
//get the verbs out
var nlpnouns = [];//nlpword.nouns().out('array')
//get all words
var nlpnouns = nlpword.terms().out('array')
// create a array with extracted words
var extractedwords = nlpnouns.concat(nlpverbs);
//console.log('_____________ STAGE 3 Passed _____________');

//console.log('_____________ STAGE 4 Begin _____________');
//define variable for synonym words
var synonyms = [];
//loop though the extracted words
extractedwords.forEach(word => {
    // get similar words to each token from extracted words
    let similar = thesaurus.find(word);
    // add these words to the synonyms list
    synonyms = synonyms.concat(similar);
});
// combine extracted words and synonyms
extractedwords = extractedwords.concat(synonyms);
//console.log('_____________ STAGE 4 Passed _____________');

//console.log('_____________ STAGE 5 Begin _____________');
// define extended commands
var extendedcommands = []
//loop though the commands
commands.forEach(command => {
    //define variable for synonym of each command
    var commandsynonyms = [];
    // tokenise the command
    let commandToken = tokenizer.tokenize(command);
    // loop though the command tokens
    commandToken.forEach(element => {
        // find synonyms for each token of the command
        let similar = thesaurus.find(element);
        // add these words to the synonyms list
        commandsynonyms = commandsynonyms.concat(similar);
    });
    // now add the synonims of the commands to the command synonims array
    command = commandsynonyms.join(" ");
    // add the command synonims to the new command array
    extendedcommands.push(command);
});
// now one of the arrays will be weighted more then the other
//console.log('_____________ STAGE 5 Passed _____________');

//console.log('_____________ STAGE 6 Begin _____________');
//define array for probablilities for each command
var prob = [];
//defune threshold (how similar the words need to be to mark as correct);
var threshold = 0.8; // the lower this is the more "holistic" the algo is
//initalise with 0 probablility the prob array
for(let index = 0; index < commands.length; index++) {
    prob.push(0)
};
// cycle throught command array
for (let index = 0; index < commands.length; index++) {
    // select each command here
    var element = commands[index];
    // tokenise each command
    var commandsToken = tokenizer.tokenize(element);
    //cycle through each token of the command
    commandsToken.forEach(one => {
        // cycle through each of the tokens of the processed words
        extractedwords.forEach(two => {
            //calculate the distance between each two tokens
            dist = natural.JaroWinklerDistance(one,two,undefined,true); // undefined is the distance and true makes the algo ignore case
            // firstly ignore words that are one characters (i is a culprit)
            if(one.length != 1 && two.length != 1 && dist > threshold) {
                if(dist > 0.90) {
                    prob[index] += dist*5; // the probablilty is exponencial
                }
                //here add the distance to the probablilty index for each command
                prob[index] += dist; // the probablilty is exponencial
            }
        });
    });
    // select extended command
    // select each command here
    var element = extendedcommands[index];
    // define the scale at which the extended commands are worth,
    var scale = 1/(extractedwords.length);
    // tonise the extended commands
    var extendedCommandsToken = tokenizer.tokenize(element);
    // now we cycle thought the extended commands to get a more accurate categorisation
    extendedCommandsToken.forEach(one => {
            // cycle through each of the tokens of the processed words
            extractedwords.forEach(two => {
                //calculate the distance between each two tokens
                dist = natural.JaroWinklerDistance(one,two,undefined,true); // undefined is the distance and true makes the algo ignore case
                // firstly ignore words that are one characters (i is a culprit)
                if(one.length != 1 && two.length != 1 && dist > threshold) {
                    //here add the distance to the probablilty index for each command
                    prob[index] += dist * scale;
                }
            });
    });
};
// select the maximum value (max probablity for the command)
var maxvalue = Math.max.apply(null, prob);
// select the index of the command with the max value
var indexofmax = prob.indexOf(maxvalue);
// now select the value of the command
var command = commands[indexofmax];
//debug
// console.log(commands)
// console.log(prob)
var anwser = commands[indexofmax];
//console.log('_____________ STAGE 6 Passed _____________');
var tot = 0;
prob.forEach(element => {
    tot = element + tot
});
var percentageofmax = (prob[indexofmax] / tot);

// final output
console.log("i am ", Math.floor(percentageofmax* 100),"% sure that you ment",anwser);





var end =  new Date().getTime();
//console.log(end-start);




// //console.log(dictionary);

// var spellcheck = new natural.Spellcheck(dictionary);


// var depth = 1;

// var start = new Date().getTime();
// //console.log(spellcheck.getCorrections(word, depth)); // ['something'] fast
// var end =  new Date().getTime();
// //console.log(end-start);







// const natural = require('natural');
// const tokenizer = new natural.TreebankWordTokenizer();
