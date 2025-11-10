import mongoose from "mongoose";

const BusinessSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    business: {
        type: String,
        required: true,
        trim: true,
    },
    gst: {
        type: String,
    },
    address: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        lowercase: true,
    },
    phone: {
        type: Number,
    },
});

const Business = mongoose.model("Business", BusinessSchema);
export default Business;