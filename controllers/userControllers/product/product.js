const productCollection = require("../../../model/productSchema")
const categoryCollection = require('../../../model/categorySchema')


const product = async(req,res)=>{
    try {
        // const sort = req.query.sort

        const {category,sort,filter,stock,search}=req.query;
        let sortOption = {}
        let filtering = {}
        let searchData


         // Set sort options
        if(sort==='newness'){
            sortOption = {_id:-1}
        }else if(sort==='priceLow'){
            sortOption = {offerPrice:1}
        }else if(sort==='priceHigh'){
            sortOption = {offerPrice:-1}
        }


         // Set filter options
         if (filter === '0to1k') {
            filtering = { offerPrice: { $gte: 0, $lte: 1000 } };
            sortOption = {offerPrice:1};
        } else if (filter === '1kto5k') {
            filtering = { offerPrice: { $gte: 1000, $lte: 5000 } };
            sortOption = {offerPrice:1};
        } else if (filter === '5kto25k') {
            filtering = { offerPrice: { $gte: 5000, $lte: 25000 } };
            sortOption = {offerPrice:1};
        } else if (filter === '25kto1lak') {
            filtering = { offerPrice: { $gte: 25000, $lte: 100000 } };
            sortOption = {offerPrice:1};
        }else if(filter === '1lakPlus'){
            filtering = { offerPrice: { $gte: 100000 } };
            sortOption = {offerPrice:1};
        }
       



        // Stock filter options
        if (stock === 'inStock') {
            filtering = { stock: { $gt: 0 } };
            sortOption = {offerPrice:1};
        }else if(stock === 'outOffStock'){
            filtering = { stock: { $lt: 1 } };
            sortOption = {offerPrice:1};
        }

     


        const categoryData = await categoryCollection.findOne({categoryName:category})
        const catData = await categoryCollection.find().sort({_id:-1}).limit(5)

        let productData;

            // search filter options
            if(search){
                searchData = { productName: { $regex: search, $options: 'i' } }
                productData = await productCollection.find(searchData).sort(sortOption)

             }   
        else if(category){
            productData = await productCollection.find({category:categoryData._id}).sort(sortOption)
        }else{
            productData = await productCollection.find(filtering).sort(sortOption)
        }

        res.render('product',{
            data:productData,
            isUser:req.session.isUser,
            catData:catData
        })
    } catch (error) {
        console.error('Error in product:', error);
        res.redirect('/userError')
    } 
}





module.exports = {
    product
}