var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        classifier: null
    },
    methods: {
        update: function (newText) {
            this.message = classifier.categorize(newText).predicted + " kya kya kya"
            // this.message = classifier.categorize(newText).predicted + " kya kya kya"
        }
    }
})

// var url = "http://dzulham.ga/drafts/desatta/json/tweets-2cols.json"
var url = "tweets-2cols.json"

$.getJSON(url, function(data) {
    var tweets = data
    classifier = makeClassifier(tweets)
    app.classifier = classifier
});