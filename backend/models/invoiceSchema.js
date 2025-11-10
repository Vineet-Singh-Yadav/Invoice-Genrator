import mongoose from "mongoose"

const itemSchema = new mongoose.Schema({
    item_name: {
        type: String,
        required: true,
    },
    unit_price: {
        type: Number,
        required: true,
    },
    quantity:
    {
        type: Number,
        required: true,
    },
    gst_per: {
        type: Number,
    },
    discount: {
        type: Number,
    }
})

const invoiceSchema = new mongoose.Schema({
    invoiceNumber:{
      type: String,
      required:true
    },
    business_name: {
        type: String,
        required: true,
    },
    gst: {
        type: String,
    },
    address: {
        type: String,
        trim: true
    },
    email: {
        type: String,
    },
    phone: {
        type: Number,
    },

    items: [itemSchema],

    sub_total: { type: Number, default: 0 },
    total_discount: { type: Number, default: 0 },
    total_gst: { type: Number, default: 0 },
    grand_total: { type: Number, default: 0 },

    userId:{type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},

    createdAt: { type: Date, default: Date.now }
});

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;