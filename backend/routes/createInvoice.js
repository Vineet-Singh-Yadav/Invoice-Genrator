import express from "express"
import genrateInvoiceNo from '../middleware/genrateInvoiceNo.js';
import authVerify from "../middleware/jwtVerify.js"
import Invoice from "../models/invoiceSchema.js";

const router = express.Router();

router.post("/createInvoice", [authVerify], async (req, res) => {
    try {
        const invoiceNumber = await genrateInvoiceNo();

        const { business_name, gst, address, email, phone, items } = req.body;

        let sub_total = 0;
        let total_discount = 0;
        let total_gst = 0;

        items.forEach(e => {
            const price = parseFloat(e.unit_price) || 0;
            const quantity = parseFloat(e.quantity) || 0;
            const gst = parseFloat(e.gst_per) || 0;
            const discount = parseFloat(e.discount) || 0;

            const totalPrice = price * quantity;
            const totalDiscount = (totalPrice * discount) / 100;
            const gstAmount = ((totalPrice - totalDiscount) * gst) / 100;

            sub_total += totalPrice;
            total_discount += totalDiscount;
            total_gst += gstAmount;
        });


        const grand_total = sub_total - total_discount + total_gst;

        const newInvoice = await Invoice.create({
            userId: req.user.id,
            invoiceNumber,
            business_name,
            gst,
            address,
            email,
            phone: Number(phone),
            items,
            sub_total,
            total_discount,
            total_gst,
            grand_total
        });

        res.status(201).json({ success: true, invoice: newInvoice, message: "Invoice created" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/fetchInvoice", [authVerify], async (req, res) => {
    try {
        const userId = req.user.id;

        const invoices = await Invoice.find({ userId });
        if (!invoices || invoices.length === 0) {
            return res.json({ success: false, message: "No Invoice Found" });
        }

        return res.status(200).json({ success: true, invoices });
        console.log(invoices);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        console.log(error)
    }
});


router.get("/getInvoice/:invoiceNumber", async (req, res) => {
    try {
        const { invoiceNumber } = req.params;
        const decodedInvoiceNumber = decodeURIComponent(invoiceNumber);
        const invoice = await Invoice.findOne({ invoiceNumber: decodedInvoiceNumber });

        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }

        res.status(200).json({ success: true, invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;