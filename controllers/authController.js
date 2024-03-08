import userModel from "../models/userModel.js"
import orderModel from "../models/orderModel.js";
import { comparePassword, hashPassword } from "./../helper/authHelper.js"
import JWT from "jsonwebtoken"

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;
    //validations
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!answer) {
      return res.status(400).send({ message: "Answer is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }


    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registeration",
      error,
    });
  }
};




//login

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

//forget-password
export const forgerPasswordController = async (req, res) => {
  try {
    const { email, answer, newpassword } = req.body
    if (!email) {
      res.status(400).send({ message: 'Email is require' })
    }
    if (!answer) {
      res.status(400).send({ message: 'Answer is require' })
    }
    if (!newpassword) {
      res.status(400).send({ message: 'NewPassword is require' })
    }
    //check
    const user = await userModel.findOne({ email, answer })
    if (!user) {
      res.status(400).send({
        success: false,
        message: 'Wrong email and answer'
      })
    }
    const hashed = await hashPassword(newpassword)
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: 'Password change Successfully'
    });
  } catch (error) {
    // console.log(error)
    res.status(500).send({
      success: false,
      message: 'something went wrong',
      error
    })
  }
}

//test
export const testController = (req, res) => {
  try {
    res.send("Protected Route")
  } catch (error) {
    // console.log(error)
    res.send({ error })
  }
}

//update profiel controleer
export const updateProfileController = async (req, res) => {
  try {
    const { name, password, phone, address, email } = req.body
    const user = await userModel.findById(req.user._id)
    //password
    if (password && password.length < 6) {
      return res.send({ error: 'password require and 6 character long' })
    }
    const hashedPassword = password ? await hashPassword(password) : undefined
    const updateUser = await userModel.findByIdAndUpdate(req.user._id, {
      name: name || user.name,
      address: address || user.address,
      phone: phone || user.name,
      password: hashedPassword || user.password

    },
      { new: true })
    res.status(200).send({
      success: true,
      message: 'profile updated successfully',
      updateUser,
    })
  } catch (error) {
    // console.log(error)
    res.status(400).send({
      success: false,
      message: 'error while update profile'

    })
  }
}

//get order 
export const getorderController = async (req, res) => {
  try {
    const orders = await orderModel.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    // console.log(error)
    res.status(500).send({
      success: false,
      message: 'error while getting order'
    })
  }

}


export const getAllorderController = async (req, res) => {
  try {
    const allOrder = await orderModel.find({})
      .populate('products', '-photo')
      .populate('buyer',)
      
    // .sort({createdAt:'-1'})
    res.json(allOrder)
  } catch (error) {
    // console.log(error)
    res.status(500).send({
      success: false,
      message: 'error in get All orders'
    })
  }
}


export const OrderStatusController=async(req,res)=>{
  try {
     const {orderId}=req.params
     const {status}=req.body
     const orderStatus=await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
     res.json({orderStatus})
  } catch (error) {
    // console.log(error)
    res.status(500).send({
      success:false,
      message:'error in order status controller'
    })
  }
}