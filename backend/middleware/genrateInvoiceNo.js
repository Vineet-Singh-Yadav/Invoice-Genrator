import Invoice from "../models/invoiceSchema.js";

export default async function genrateInvoiceNo (){
    const year = new Date().getFullYear();

    const lastInvoice = await Invoice.findOne().sort({_id: -1}).limit(1);

    let newNumber =1;

    if(lastInvoice && lastInvoice.invoiceNumber){
        const part = lastInvoice.invoiceNumber.split("/");
        const lastNum = parseInt(part[2]);
        if(!isNaN(lastNum)){newNumber= lastNum + 1};
    }

    const formattedNumber = `INV/${year}/${String(newNumber).padStart(3, "0")}`;
    return formattedNumber;
}