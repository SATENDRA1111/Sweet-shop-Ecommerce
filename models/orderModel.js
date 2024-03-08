import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    products: [
        {
            type: mongoose.ObjectId,
            ref: 'products',
        },
    ],
    // payment: {},
    razorpay_order_id: [{
        type: String,
        require: true
    }],
    razorpay_payment_id: [{
        type: String,
        require: true
    }],
    razorpay_signature: [{
        type: String,
        require: true
    }],

    buyer: {
        type: mongoose.ObjectId,
        ref: 'users'
    },
    status: {
        type: String,
        default: 'Not Process',
        enum: ["Not Process", 'Processing', 'Shipping', "Deliverd", 'Cancel']
    }
}, { timestamps: true })
//collecation name and schema name
export default mongoose.model('Order', orderSchema);




