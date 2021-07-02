const mongoose = require("mongoose");
const movieSchema = new mongoose.Schema({
    id:{
        type:String,
        required:false
    },
    moviename:{
        type:String,
        required:false
    },
    movieimage:{
        type:String,
        required:false
    },
    description:{
        type:String,
        required:false
    },
    rating:{
        type:String,
        required:false
    },
    writer:{
        type:String,
        required:false
    },
    director:{
        type:String,
        required:false
    },
    producer:{
        type:String,
        required:false
    },
    cast:{
        type:String,
        required:false
    }
});
const Movie= mongoose.model("Movie",movieSchema);
module.exports =Movie