// Fischer-Yates
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function cleanTweet(tweet) {
    tweet = tweet.replace(/[0-9]/g, '')
    tweet = tweet.replace(/(@\S+)/gi,"")
    tweet = tweet.toLowerCase()
    return tweet
}

function makeClassifier(tweets) {
    var bayes = require('bayes')

    var classifier = bayes({
        tokenizer: function (text) { return text.split(/\W+/) }
    })

    // classifier.learn("hari ini hari apa ya?", "is_question")
    for (var i = 0; i < tweets.length; i++) {
        classifier.learn(cleanTweet(""+tweets[i].tweet), tweets[i].class)
    }

    var stateJson = classifier.toJson()
    stateJson = JSON.parse(stateJson)

    var wordclasses = stateJson.wordFrequencyCount

    for (var prop in wordclasses) {
        var wordclass = wordclasses[prop]
        for (var propc in wordclass) {
            if (wordclass[propc] < 5) {
                delete wordclass[propc]
            }
        }
    }

    // load the classifier back from its JSON representation.
    classifier = bayes.fromJson(JSON.stringify(stateJson))
    return classifier
}

function checkLabel(classifier, testing_array) {
    var tp = 0, fp = 0, fn = 0, tn = 0, tot = 0
    
    for (let t of testing_array) {
        var result = classifier.categorize(""+t.tweet)
        var predicted = result.predicted
        if (predicted == t.class && (predicted == "is_question" || predicted == "is_complaint")) {
            tp++
        } else if (predicted == "is_question" || predicted == "is_complaint") {
            fp++
        } else if (t.class == "is_question" || t.class == "is_complaint") {
            fn++
        } else {
            tn++
        }
        tot++
    }

    console.log("TP: " + (tp/tot).toFixed(3) + " || FP: " + (fp/tot).toFixed(3) + " || FN: " + (fn/tot).toFixed(3) + " || TN: " + (tn/tot).toFixed(3) + " || Accuracy: " + ((tp+tn)/tot).toFixed(3) + " || Total: " + tot)
}

function crossValidation(tweets) {
    tweets = shuffle(tweets)
    var numchunks = 5
    var i, j, temparray, chunksize = tweets.length/numchunks;
    var chunks = []
    for (i = 0, j = tweets.length; i < j; i += chunksize) {
        temparray = tweets.slice(i,i+chunksize)
        chunks.push(temparray)
    }

    for (k = 0; k < numchunks; k++) {
        var training_array = []
        for (m = 0; m < numchunks; m++) {
            if (m != k) {
                // training_array.concat(chunks[m])
                training_array = chunks[m]
            }
        }
        var testing_array = chunks[k]
        
        classifier = makeClassifier(training_array)
        checkLabel(classifier, testing_array)
    }
}

function classify(classifier, sentences) {
    for (let sentence of sentences) {
        console.log("Sentence:", sentence)
        console.log("   > Class:", classifier.categorize(sentence))
    }
}

var fs = require('fs');
var tweets = JSON.parse(fs.readFileSync('tweets-2cols.json', 'utf8'));

// console.log("Total tweets: ", tweets.length)

classifier = makeClassifier(tweets)

// classify(classifier, ["Utk harga yg tertera pada aplikasi adalah harga estimasi. Anda dapat membayarkan sesuai dgn struk yg diberikan. Tks ^yun",
//                       "mbaa janeett.. nama bandara di korea selatan apa ya? @IndonesiaGaruda",
//                       "@CommuterLine malam . Sya mau tnya apakah ada batasan waktu untuk mengambil uang jaminan tiket kreta harian berjamin ???",
//                       "@CommuterLine loopline 8.15 ber jng tp skrng masih di pse? Whyyy????",
//                       "@KAI121 pegawai tsb pindah stlh CSOT tanya ke penumpang sblh nya apa bangku 4B kosong? selepas Semarang baru duduk di 4B https://twitter.com/agungbjn/status/863776416608927744",
//                       "Informasi lebih lanjut terkait pembatalan tiket kami sampaikan via Direct Message. Tiket Infant penumpang anak berusia 3 tahun |1"
//                       ])

// // uncomment to run
crossValidation(tweets)