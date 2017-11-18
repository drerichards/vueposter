const PRICE = 9.99,
    LOAD_NUM = 10
new Vue({
    el: '#app',
    data: {
        total: 0,
        price: PRICE,
        items: [],
        cart: [],
        results: [],
        newSearch: 'innit',
        lastSearch: ' ',
        loading: false
    },
    computed: {
        noMoreItems: function () {
            return this.items.length === this.results.length && this.results.length > 0
        }
    },
    methods: {
        appendItems: function () {
            if (this.items.length < this.results.length) {
                let append = this.results.slice(this.items.length, this.items.length + LOAD_NUM)
                this.items = this.items.concat(append)
            }
        },
        onSearchSubmit: function () {
            if (this.newSearch.length) {
                this.items = [],
                    this.loading = true
                this.$http.get('/search/' + this.newSearch).then(function (res) {
                    this.lastSearch = this.newSearch
                    this.results = res.body
                    this.appendItems()
                    this.loading = false
                })
            }
        },
        addItem: function (index) {
            this.total += PRICE
            let item = this.items[index]
            let found = false
            for (let i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id === item.id) {
                    found = true
                    this.cart[i].qty++
                    break
                }
            }
            if (!found) {
                this.cart.push({
                    id: item.id,
                    title: item.title,
                    price: PRICE,
                    qty: 1
                })
            }
        },
        increm: function (item) {
            item.qty++
            this.total += PRICE
        },
        decrem: function (item) {
            item.qty--
            this.total -= PRICE
            if (item.qty <= 0) {
                for (let i = 0; i < this.cart.length; i++) {
                    if (this.cart[i].id === item.id) {
                        this.cart.splice(i, 1)
                        break
                    }
                }
            }
        }
    },
    filters: {
        currency: function (figure) {
            return '$'.concat(figure.toFixed(2))
        }
    },
    mounted: function () {
        this.onSearchSubmit()

        let vueInstance = this,
            elem = document.getElementById('product-list-bottom'),
            monitor = scrollMonitor.create(elem)

        monitor.enterViewport(function () {
            vueInstance.appendItems()
        })
    },
})