import express from 'express';
import authVerify from '../middleware/jwtVerify.js';
import Business from '../models/business.js';
import Item from "../models/itemSchema.js";

const router = express.Router();

router.post("/businessDetails", [authVerify], async (req, res) => {
    try {
        const { business, gst, address, email, phone } = req.body;

        const existing = await Business.findOne({ userId: req.user.id });

        if (existing) {
            existing.business = business;
            existing.gst = gst;
            existing.address = address;
            existing.email = email;
            existing.phone = Number(phone);

            await existing.save();
            return res.json({success:true, message: "Business info updated successfully", data: existing });
        }

        const businessDetails = await Business.create({
            userId: req.user.id,
            business,
            gst,
            address,
            email,
            phone: Number(phone)
        });

        return res.status(201).json({success:true, message: "Business info saved successfully", data: businessDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: "Server error", error });
    }
});

router.get("/ownerDetails", [authVerify], async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await Business.findOne({ userId: userId });

        if (!user) {
            return res.json({ success: false, message: "Business details not found" });
        }

        res.json({ success: true, user });

    } catch (error) {
        res.status(500).json({success:false, message: "Server error", error });
    }
});

router.post("/saveItem",[authVerify],async(req, res)=>{
    try{
       const{item_name, unit_price, gst, discount}= req.body;

       const existing = await Item.findOne({userId: req.user.id, item_name});

       if(existing){
        existing.item_name = item_name;
        existing.unit_price = Number(unit_price);
        existing.gst = Number(gst);
        existing.discount = Number(discount);

        await existing.save();
        return res.json({ success:true, message: "Item info updated successfully", data: existing });
       }

       const itemAdded  = await Item.create({
        userId: req.user.id,
        item_name,
        unit_price: Number(unit_price),
        gst: Number(gst),
        discount: Number(discount),
       });

       return res.json({success:true, message: "Item info Saved successfully", data: itemAdded });

    }catch(error){
        console.error(error);
        res.status(500).json({success:false, message: "Server error", error })
    };
});

router.get("/getSavedItem",[authVerify], async(req, res)=>{
    try {
        const userId = req.user.id;
        const item = await Item.find({userId});

        if(!item){return res.json({success:false, message:"No item found"})};

        res.json({success: true, item: item});
    } catch (error) {
        res.status(500).json({success:false, message: "Server error", error });
    }
});


export default router;