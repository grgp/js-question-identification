var url = "http://dzulham.ga/drafts/desatta/json/tweets-2cols.json"
// var bayes = require('bayes')

var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        classifier: {aya: "whahha"}
    },
    methods: {
        init: function(){
            // this.loadData();
        },
        loadData: function() { 
            this.$http.get(url).then((response) => { 
                if(!!response.body) {
                    classifier = bayes.fromJSON(response.body);
                    console.log(classifier)
                }
            }, (response) => {
                console.log("not working jyal")
            });
        },
        update: function (newText) {
            console.log(classifier)
            this.message = classifier.categorize(newText).predicted + " kya kya kya"
            // this.message = classifier.categorize(newText).predicted + " kya kya kya"
        }
    }
})

// var url = "http://dzulham.ga/drafts/desatta/json/tweets-2cols.json"
// var url = "tweets-2cols.json"

// $.getJSON(url, function(data) {
//     var tweets = data
//     classifier = makeClassifier(tweets)
//     app.classifier = classifier
// });