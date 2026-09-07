import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import redis from "../config/redis.js"

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()
        
        if (redis) {
            await redis.del("all_products");
        }

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        if (redis) {
            const cachedProducts = await redis.get("all_products");
            if (cachedProducts) {
                return res.json({success: true, products: cachedProducts});
            }
        }
        
        const products = await productModel.find({});
        
        if (redis) {
            await redis.set("all_products", products, { ex: 3600 }); // cache for 1 hour
        }
        
        res.json({success:true,products})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        
        if (redis) {
            await redis.del("all_products");
            await redis.del(`product:${req.body.id}`);
        }
        
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        
        if (redis) {
            const cachedProduct = await redis.get(`product:${productId}`);
            if (cachedProduct) {
                return res.json({success: true, product: cachedProduct});
            }
        }
        
        const product = await productModel.findById(productId)
        
        if (redis && product) {
            await redis.set(`product:${productId}`, product, { ex: 3600 }); // cache for 1 hour
        }
        
        res.json({success:true,product})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { listProducts, addProduct, removeProduct, singleProduct }