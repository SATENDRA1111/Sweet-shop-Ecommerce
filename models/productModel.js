import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    },
    description:{
        type:String,
        require:true,
    },
    price:{
        type:Number,
        require:true
    },
    category:{ //we mede other model for categore so we need id and reference
        type:mongoose.ObjectId,
        ref:'Category',
        require:true,

    },
    quantity:{
        type:Number,
        require:true,
    },
    photo:{//we can not access photo directly for that we need to 'npm i express-formidable'
        data:Buffer,
        contentType:String
    },
    shipping:{
        type:Boolean,
    }

},
{timestamps:true})

export default mongoose.model('products',productSchema)