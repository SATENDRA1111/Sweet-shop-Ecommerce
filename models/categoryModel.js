import mongoose from "mongoose";

const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        unque:true,
    },
     slug:{   // replace spaces with replacement character `-`
        type:String,
        lowercase:true,
    }

})
//collecation name and schema name
export default mongoose.model('Category',categorySchema);