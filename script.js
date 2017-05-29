new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
    },
    methods: {
        update: function (newText) {
            this.message = newText + " kya kya kya"
        }
    }
})