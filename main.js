var eventBus = new Vue();

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img v-bind:src="image" :alt="altText" width="400px" />
        </div>

        <div class="product-info">
            <h1> {{ title }} </h1>
            <h3 v-if="onSale">ON SALE!!!</h3>
            <p>Shipping: {{ shipping }}</p>
            <p v-if="inStock > 10">In Stock</p>
            <p v-else-if="inStock <= 10 && inStock > 0">Almost sold out!</p>
            <p v-else :style="{ 'text-decoration':  inStock ? 'none' : 'line-through'}">Out of Stock</p>

            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>


            <div 
                v-for="(variant, index) in variants" 
                v-bind:key="variant.variantId"
                class="color-box"
                :style="{ backgroundColor: variant.variantColor}"
                @mouseover="updateProduct(index)"
            >
            </div>


            <!-- <ul>
                <span>Sizes:</span>
                <li v-for="size in shoesSizes" v-bind:key="size">
                    {{ size }}
                </li>
            </ul> -->

            <div class="buttons">

                <button v-on:click="addToCart" v-bind:disabled="!inStock">Add to cart</button>
                <button @click="removeToCart">Remove to cart</button>
            </div>

            <product-tabs :reviews="reviews"></product-tabs>
        </div>
    </div>
    `,
    data() {
        return {
            brand: "Nike",
            product: "Vapor Max",
            selectedVariant: 0,
            altText: "A orage shoes to you",
            inventory: 0,
            onSale: true,
            details: ["80% cotton", "20% Polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "./img/shoes.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "./img/shoes.jpeg",
                    variantQuantity: 0
                }
            ],
            shoesSizes: [38, 39, 40],
            reviews: []
        }
    },
    computed: {
        title() {
            return this.brand + ' - ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        shipping() {
            if (this.premium) {
                return "Free"
            }
            return 2.99
        }
    },
    methods: {
        addToCart: function () {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        removeToCart() {
            this.$emit('remove-to-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index)
        },
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        })
    }
})

Vue.component("product-review", {
    // props:a,
    template: `
    <form @submit.prevent="onSubmit">

        <p v-if="errors.length">
            <b>Plase correct the following error(s): </b>
            <ul>
                <li v-for="error in errors">{{error}}</li>
            </ul>
        </p>

        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name">
        </p>

        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>

        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
            </select>
        </p>

        <p>
            <input type="submit" value="submit">
        </p>
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview);
                this.name = null;
                this.review = null;
                this.rating = null;
            }
            else {
                if (!this.name) this.errors.push("Name required");
                if (!this.review) this.errors.push("Review required");
                if (!this.rating) this.errors.push("Rating required");
            }
        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <span
                class="tab"
                :class="{'active-tab': selectedTab === tab}"
                v-for="(tab, index) in tabs"
                :key="index"
                @click="selectedTab = tab"
            >
                {{tab}}
            </span>

            <div v-show="selectedTab === 'Reviews'">
                <h2>Reviews</h2>
                <p v-if="!reviews.length">The are no reviews yet.</p>

                <ul>
                    <li v-for="review in reviews">
                        <p> {{review.name}} </p>
                        <p> Rating: {{review.rating}} </p>
                        <p> Review: {{review.review}} </p>
                    </li>
                </ul>
            </div>

            <product-review 
                v-show="selectedTab === 'Make a Review'"
            ></product-review>
        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

var app = new Vue({
    el: "#app",
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeCart(id) {
            // this.cart.map((cartId, index) => {
            //     if (cartId == id) {
            //         delete this.cart[index];
            //     }
            // })
            this.cart.pop()
            // this.cart.pull(id);
        }
    },
});