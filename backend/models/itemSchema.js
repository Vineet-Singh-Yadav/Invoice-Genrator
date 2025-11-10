import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    item_name: {
        type: String,
        required: true
    },
    unit_price: {
        type: Number,
        required: true
    },
    gst: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

const Item = mongoose.model("Item", itemSchema);
export default Item;