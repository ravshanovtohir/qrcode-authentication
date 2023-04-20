import mongoose from "mongoose";

async function db() {
    try {
        mongoose.connect('mongodb://0.0.0.0:27017/test', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Connected to MongoDb database");
    } catch (error) {
        console.log("MongoDb Error ---> " + error.message)
    }

}
export default db