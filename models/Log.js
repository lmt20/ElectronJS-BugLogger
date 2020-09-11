const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LogSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is required']
    },
    user: {
        type: String,
        trim: true,
        required: [true, 'User is required']
    },
    priority: {
        type: String,
        default: 'low',
        enum: ['low', 'moderate', 'high']
    },
    created: {
        type: Date,
        default: Date.now()
    },
})

module.exports = mongoose.model('Log', LogSchema);


// userSchema.methods.addToCart = function (productId) {
//     if (!this.cart.items) {
//         this.cart.items = [];
//     }
//     let itemIndex = this.cart.items.findIndex(item => {
//         return productId.toString() === item.productId.toString();
//     });
//     if (itemIndex === -1) {
//         this.cart.items.push({ productId: productId, quantity: 1 });
//     }
//     else {
//         this.cart.items[itemIndex].quantity += 1;
//     }
//     return this.save();
// }