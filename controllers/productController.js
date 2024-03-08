import slugify from "slugify"
import fs from 'fs'
import productModel from "../models/productModel.js"
import categoryModel from '../models/categoryModel.js'
import braintree from 'braintree'
import Razorpay from "razorpay"
import orderModel from "../models/orderModel.js"
import dotenv from 'dotenv'
import crypto from "crypto"


dotenv.config();

export const createProductController = async (req, res) => {
    try {           //we can not access photo directly for that we need to 'npm i express-formidable'
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is Required' })

            case !description:
                return res.status(500).send({ error: 'Description is Required' })

            case !price:
                return res.status(500).send({ error: 'Name is Required' })

            case !category:
                return res.status(500).send({ error: 'Name is Required' })

            case !quantity:
                return res.status(500).send({ error: 'Name is Required' })

            case photo && photo.size > 1000000:
                return res.status(500).send({ error: 'photo is required and should be less than 1mb' })

        }
        const products = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: 'product created successfully',
            products,
        })
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in creating product',
            error,
        })
    }
}

export const getProductController = async (req, res) => {
    try {//we made other api for photo if we are loading again and again it will take lots of time
        const product = await productModel.find({}).select('-photo').limit(12).sort({ createAt: -1 })
        res.status(200).send({
            success: true,
            countTotal: product.length,
            message: 'All product',
            product,
        })
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in get product',
            error: error.message
        })
    }
}

//get single product
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).select('-photo').populate('category')
        res.status(200).send({
            success: true,
            message: 'single product',
            product,
        })
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in get single product',
            error,
        })
    }
}

//get photo
export const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select('photo')
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in get photo',
            error
        })
    }
}

//delete product

export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select('-photo')
        res.status(200).send({
            success: true,
            message: 'product delet successfully'
        })
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in product delet',
            error
        })
    }
}

//update product
export const updateProductController = async (req, res) => {

    try {  //we can not access photo directly for that we need to 'npm i express-formidable'
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is Required' })

            case !description:
                return res.status(500).send({ error: 'Description is Required' })

            case !price:
                return res.status(500).send({ error: 'Name is Required' })

            case !category:
                return res.status(500).send({ error: 'Name is Required' })

            case !quantity:
                return res.status(500).send({ error: 'Name is Required' })

            case photo && photo.size > 1000000:
                return res.status(500).send({ error: 'photo is required and should be less than 1mb' })

        }
        const products = await productModel.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: 'product created successfully',
            products,
        })
    } catch (error) {
        // console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in creating product',
            error,
        })
    }
}

//product filter
export const productFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body
        let args = {};
        if (checked.length > 0) args.category = checked
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
        const products = await productModel.find(args)
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        // console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error while Filtering Product',
            error,
        })
    }
}

//product count pagination
export const productCountCountroller = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total,
        })
    } catch (error) {
        // console.log(error)
        res.status(400).send({
            success: false,
            message: 'error in product count',
            error,
        })
    }
}

//product list based on page
export const productListController = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const product = await productModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            product,
        });


    } catch (error) {
        // console.log(error)
        res.status(400).send({
            success: false,
            message: 'error in per page ctrl'
        })
    }
}

//search product
export const searchProductControlller = async (req, res) => {
    try {
        const { keyword } = req.params
        const results = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        }).select('-photo')
        res.json(results)
    } catch (error) {
        // console.log(error)
        res.status(400).send({
            success: false,
            message: 'error in search controller',
            error,

        })
    }
}

// similer product

export const realtedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid } //not include same product
        }).select('-photo').limit(3).populate('category')
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        // console.log(error)
        res.status(400).send({
            success: false,
            message: 'error in similer product controller'
        })
    }
}

//category product
export const ProductCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.find({ slug: req.params.slug })
        const products = await productModel.find({ category }).populate('category')
        res.status(200).send({
            success: true,
            category,
            products
        })
    } catch (error) {
        // console.log(error)
        res.status(400).send({
            success: false,
            message: 'error in product-category controller'
        })
    }
}

//paypal payment gateway
//token
// export const braintreeTokentController = async (req, res) => {
//     try {
//         gateway.clientToken.generate({}, function (err, response) {
//             if (err) {
//                 res.status(500).send(err);
//             }
//             else {
//                 res.send(response)
//             }
//         });
//     } catch (error) {
//         console.log(error)
//     }
// }

//paypal payment
// export const braintreePaymentController = async (req, res) => {
//     try {
//         const { cart, nonce } = req.body
//         let total = 0;
//         cart.map((i) => {
//             total += i.price
//         });
//         let newtransction = gateway.transaction.sale({
//             amount: total,
//             paymentMethodNonce: nonce,
//             options: {
//                 submitForSettlement: true
//             }
//         },
//             function (err, result) {
//                 if (result) {
//                     const order = new orderModel({
//                         products: cart,
//                         payment: result,
//                         buyer: req.user._id,
//                     }).save();
//                     res.json({ ok: true });
//                 }

//                 else {
//                     res.status(500).send(err)
//                 }
//             })
//     } catch (error) {
//         console.log(error)
//     }
// }



export const verifyPaymentController = async (req, res) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body.response;
    const { cart } = req.body

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    var expectedSignature = crypto.createHmac('sha256', process.env.RAZERPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        await orderModel.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            products: cart,
            buyer: req.user._id,
        });
        // res.status(200).send({ success:true,  message:'Sign valid' });
        res.send({ code: 200, message: 'Sign valid', })


    }
    else {
        res.status(500).send({ code: 500, message: 'Sign Invalid' })
    }

}

export const razerPaymentController = async (req, res) => {
    try {
        const { cart } = req.body
        let total = 0;
        cart.map((i) => {
            total += i.price
        });

        let instance = new Razorpay({
            key_id: process.env.RAZERPAY_KEY_ID,
            key_secret: process.env.RAZERPAY_KEY_SECRET,
        })
        var options = {
            amount: total * 100,  // amount in the smallest currency unit
            currency: "INR",
        };
        instance.orders.create(options, function (err, result) {
            if (result) {
                res.json({ ok: true, result, cart });

            }

            else {
                res.status(500).send({
                    message: 'error in razor controller',
                    err
                })
            }

        });


    } catch (error) {
        // console.log(error)
    }

}
