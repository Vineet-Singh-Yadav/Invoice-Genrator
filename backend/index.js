import express from "express";
import connectDB  from "./db.js";
import authRoute from "./routes/authRoutes.js"
import bussinessRoute from "./routes/businessRoute.js"
import invoiceRoute from "./routes/createInvoice.js"
import dotenv from "dotenv";
import cors from "cors"


dotenv.config();
connectDB(); 
const app = express();
app.use(cors());

const port = process.env.PORT;

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/business", bussinessRoute );
app.use("/api/invoice", invoiceRoute);

app.listen(port, ()=>{
    console.log(`connected to serever at ${port}`); 
})