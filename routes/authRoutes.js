import express from "express"
import { OrderStatusController, forgerPasswordController, getAllorderController, getorderController, loginController, registerController, testController, updateProfileController } from "../controllers/authController.js"
import { isAdmin, requireSignIn } from "../middlewares/authMiddlewares.js";

//router object
const router = express.Router();

//routing

//register || method post
router.post('/register', registerController)

//login
router.post('/login', loginController)

//forget password
router.post('/forgot-password',forgerPasswordController)

//test route (in route we can add multiple middleware)
router.get('/test', requireSignIn, isAdmin, testController)

//protected user route auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});

//protected admin route auth
router.get("/admin-auth", requireSignIn,isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});

//update prorfile
router.put('/profile',requireSignIn,updateProfileController)

//get order
router.get('/orders',requireSignIn,getorderController)

//all orders
router.get('/all-orders',requireSignIn,isAdmin,getAllorderController)

// change orde stauts
router.put('/order-status/:orderId',requireSignIn,isAdmin,OrderStatusController)


export default router