var eventBus = new Vue();

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div>
        <div class="product">
            <div class="product-image">
                <img v-bind:src="image" :alt="altText" width="400px" />
                <p> Sold by: Nike Brasil </p>
                <p> Available sizes: {{ shoesSizes.toString() }} </p>
            </div>

            <div class="product-info">
                <div> 
                    <h1> {{ title }} </h1>
                    <hr/>
                    <h3 v-if="onSale">ON SALE!!!</h3>
                    <p><i class="fas fa-star"></i> Shipping: {{ shipping }}</p>
                    <p v-if="inStock > 10">In Stock</p>
                    <p v-else-if="inStock <= 10 && inStock > 0"> 
                        <i class="fas fa-exclamation-triangle"></i>
                        Almost sold out!
                    </p>
                    <p v-else :style="{ 'text-decoration':  inStock ? 'none' : 'line-through'}">
                        <i class="fas fa-exclamation-circle" style="color: red;"></i>
                        Out of Stock
                    </p>
                </div>
              
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>

                <div class="inline-div">
                    <div 
                    v-for="(variant, index) in variants" 
                    v-bind:key="variant.variantId"
                    class="color-box"
                    :style="{ backgroundColor: variant.variantColor}"
                    @mouseover="updateProduct(index)"
                    >
                    </div>
                </div>

                <!-- <ul>
                    <span>Sizes:</span>
                    <li v-for="size in shoesSizes" v-bind:key="size">
                        {{ size }}
                    </li>
                </ul> -->

                <div class="buttons">
                    <button class="btn btn-add" v-on:click="addToCart" v-bind:disabled="!inStock">
                        <i class="fas fa-plus-circle"></i>
                        Add to cart
                    </button>
                    <button class="btn btn-remove" @click="removeToCart">
                        <i class="fas fa-trash" style="color: orangered;"></i>
                        Remove to cart
                    </button>
                </div>
            </div>
        </div>
        
        <product-tabs :reviews="reviews" class="product-review"></product-tabs>    
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
                    variantColor: "orangered",
                    variantImage: "./img/shoes2.webp",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "orange",
                    variantImage: "./img/shoes3.webp",
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
    <form @submit.prevent="onSubmit" class="form">

        <div v-if="errors.length" class="error">
            <b>Plase correct the following error(s): </b>
            <ul>
                <li v-for="error in errors">{{error}}</li>
            </ul>
        </div>

        <div>
            <label for="name">Name:</label>
            <input id="name" v-model="name">
        </div>

        <div>
            <label for="review" style="vertical-align: middle;">Review:</label>
            <input id="review" v-model="review" class="textReview"></input>
        </div>

        <div>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
            </select>
        </div>

        <div>
            <input type="submit" value="Send" class="btn btn-submit">
        </div>
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
                class="tab titles"
                :class="{'active-tab': selectedTab === tab}"
                v-for="(tab, index) in tabs"
                :key="index"
                @click="selectedTab = tab"
            >
                {{ tab }}
            </span>

            <div v-show="selectedTab === 'Reviews'">
                <h2>Reviews</h2>
                <p v-if="!reviews.length">The are no reviews yet.</p>

                
                <div class="reviewBox"> 
                    <div v-for="review in reviews">
                        <h3 class="revName"> {{review.name}} </h3>
                        <p class="revRating"> <b>Rating:</b> {{review.rating}} <i class="fas fa-star"></i> </p>
                        <p class="revReview"> <b>Review:</b> <span>{{review.review}}</span> </p>
                    </div>
                </div>
                
            </div>

            <product-review 
                v-show="selectedTab === 'Make a Review'"
            ></product-review>
        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Make a Review'
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