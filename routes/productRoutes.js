import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddlewares.js";
import { ProductCategoryController, createProductController, deleteProductController, getProductController, getSingleProductController, productCountCountroller, productFilterController, productListController, productPhotoController, razerPaymentController, realtedProductController, searchProductControlller, updateProductController, verifyPaymentController } from "../controllers/productController.js";
import formidable from "express-formidable";


const router = express.Router()

//routes
//we can not access photo directly for that we need to 'npm i express-formidable'
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)

//update product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController)

//get product
router.get('/get-products', getProductController)

//single product
router.get('/get-product/:slug', getSingleProductController)

//get photo
router.get('/product-photo/:pid', productPhotoController)

//delet product
router.delete('/product-delete/:pid', deleteProductController)

// filter product
router.post('/product-filter', productFilterController)

//product count 
router.get('/product-count', productCountCountroller)

//product per page
router.get('/product-list/:page', productListController)

//search product
router.get('/search/:keyword',searchProductControlller)

//similar product
router.get('/related-product/:pid/:cid',realtedProductController)

//category wise product
//token
router.get('/product-category/:slug', ProductCategoryController)

// //payment paypal route 
// router.get('/braintree/token', braintreeTokentController)

// //payments paypal
// router.post('/briantree/payment',requireSignIn, braintreePaymentController)

//razerpay
router.post('/verify',requireSignIn,verifyPaymentController)

router.post('/razorpayment',requireSignIn,razerPaymentController)

export default router