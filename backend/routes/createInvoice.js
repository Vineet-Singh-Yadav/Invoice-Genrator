import express from "express"
import genrateInvoiceNo from '../middleware/genrateInvoiceNo.js';
import authVerify from "../middleware/jwtVerify.js";
import Invoice from "../models/invoiceSchema.js";
import Business from "../models/business.js";
import path from 'path';
import ejs from 'ejs';
import puppeteer from 'puppeteer';
import { chromium } from "playwright";


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

// router.get("/createPdf/:invoiceNumber", async (req, res) => {
//     try {
//         const { invoiceNumber } = req.params;
//         const decodedInvoiceNumber = decodeURIComponent(invoiceNumber);
//         const invoice = await Invoice.findOne({ invoiceNumber: decodedInvoiceNumber });

//         if (!invoice) {
//             return res.status(404).json({ success: false, message: "Invoice not found" });
//         }

//         const owner = await Business.findOne({ userId: invoice.userId });

//         const date = new Date(invoice.createdAt).toLocaleDateString();

//         const invoiceData = {
//             invoice,
//             owner,
//             date
//         }

//         const tampletePath = path.join(process.cwd(), "templates", "pdfTemplate.ejs");

//         const html = await ejs.renderFile(tampletePath, { invoiceData, logoUrl: process.env.LOGO_URL });

//         const broswer = await puppeteer.launch({
//             headless: "new",
//             args: ["--no-sandbox", "--disable-setuid-sandbox"]
//         });
//         const page = await broswer.newPage();

//         await page.setContent(html, { waitUntil: "networkidle0" });
//         await page.emulateMediaType("screen");

//         const pdf = await page.pdf({
//             format: "A4",
//             landscape: false,
//             printBackground: true,
//             margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" }
//         });

//         await broswer.close();

//         res.set({
//             "Content-Type": "application/pdf",
//             "Content-Disposition": `attachment; filename=invoice_${invoiceNumber}.pdf`
//         });

//         res.send(pdf);
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ success: false, msg: "Error generating PDF" });
//     }
// });


//I have change the puppeteer to Playwright because during the build on the free render, Render blocks the large download
//And puppeteer try to download the full chromium browser 
//So i used the Playwright, it have its own browser in the NPM package so no need to download during the render build
// but we have to use npx playwright install in loacl because the browser not download properly in local machine
router.get("/createPdf/:invoiceNumber", async (req, res) => {
    try {
        const { invoiceNumber } = req.params;
        const decodedInvoiceNumber = decodeURIComponent(invoiceNumber);

        const invoice = await Invoice.findOne({ invoiceNumber: decodedInvoiceNumber });
        if (!invoice) {
            return res.status(404).json({ success: false, message: "Invoice not found" });
        }

        const owner = await Business.findOne({ userId: invoice.userId });
        const date = new Date(invoice.createdAt).toLocaleDateString();

        const invoiceData = { invoice, owner, date };

        const templatePath = path.join(process.cwd(), "templates", "pdfTemplate.ejs");
        const html = await ejs.renderFile(templatePath, {
            invoiceData,
            logoUrl: process.env.LOGO_URL
        });

        const browser = await chromium.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle" });

        const pdf = await page.pdf({
            format: "A4",
            landscape: false,
            printBackground: true,
            margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" }
        });

        await browser.close();

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=invoice_${invoiceNumber}.pdf`
        });

        res.send(pdf);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Error generating PDF" });
    }
});


export default router;