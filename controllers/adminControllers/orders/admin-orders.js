const orderCollection = require("../../../model/orderSchema");
const walletCollection = require("../../../model/walletSchema");




const admin_orders = async (req, res) => {
    try {
        if (req.session.isAdminAuth) {
            const perPage = 10; // Number of orders per page
            const page = parseInt(req.query.page) || 1; // Current page, default to 1 if not provided

            // Fetch orders with pagination and sorting by _id in descending order
            const orders = await orderCollection.find({})
                .sort({ _id: -1 })
                .skip((perPage * page) - perPage)
                .limit(perPage);

            // Get total count of orders for pagination
            const count = await orderCollection.countDocuments();

           

            res.render('admin-orders', {
                isSuperAdmin: req.session.isSuperAdmin,
                data: orders,
                currentPage: page,
                totalPages: Math.ceil(count / perPage)
            });
        } else {
            res.redirect('/admin/admin-login');
        }
    } catch (error) {
        console.error('Error in admin_orders:', error);
        res.redirect('/admin/errorPage');
    }
};


const adminOrderDetail = async (req,res)=>{
    try {
        if(req.session.isAdminAuth){
            const data = await orderCollection.findOne({orderID:req.params.id});
            res.render('admin-orderDetail',{isSuperAdmin:req.session.isSuperAdmin,data:data})
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_orders:', error);
        res.redirect('/admin/errorPage')
    }
}

const updateStatus = async (req,res)=>{
    try {
        if(req.session.isAdminAuth){
            const orderData = await orderCollection.updateOne({ orderID: req.query.id }, 
                {
                $set: {
                    [`products.${req.query.index}.status`]: `${req.body.status}` 
                }
            });
            res.redirect(`/admin/adminOrderDetail/${req.query.id}`);
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_orders:', error);
        res.redirect('/admin/errorPage')
    }
}



const adminReturnConform = async (req,res)=>{
    try {
        if(req.session.isAdminAuth){
           const {msg,index,id} = req.query
           const data = await orderCollection.findOne({orderID:id})
           const updateData = data.products[index]
           
           const orderData = await orderCollection.updateOne({ orderID: id }, 
            {
            $set: {
                [`products.${index}.status`]: `${msg}` 
            }
        });

        if(msg === 'ReturnConform' ){

            await productCollection.updateOne(
                { productName: updateData.productName },
                {
                    $inc: { stock: updateData.quantity } // Decrement the 'stock' field by cartData.items[i].quantity
                }
            );
    
            const amount = updateData?.Product_total 
            const walletTransactions = {
                remarks: 'User Return the  product',
                date:new Date(),
                type:'Credit',
                amount:amount,
            }
            const wallet = await walletCollection.updateOne({userId:req.session.isUser._id},{$inc:{wallet: +amount},$addToSet:{walletTransactions:walletTransactions}},{upsert:true})
    
        }
        
            res.redirect(`/admin/adminOrderDetail/${id}`);
        }else{
            res.redirect('/admin/admin-login')
        }
    } catch (error) {
        console.error('Error in admin_orders:', error);
        res.redirect('/admin/errorPage')
    }
}




module.exports ={
    admin_orders,
    adminOrderDetail,
    updateStatus,
    adminReturnConform
}