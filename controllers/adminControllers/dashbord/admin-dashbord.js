
const orderCollection = require('../../../model/orderSchema');
// const orderModel = require('../../model/orderModel');
// const productModel=require('../../model/productModel');
const fs = require("fs");
const os = require("os");
const path = require("path");
const puppeteer = require("puppeteer");
const collection = require('../../../model/userSchema');
const productCollection = require('../../../model/productSchema');




const Admin_dashbord = async(req,res)=>{
    try {

        const salesCount = await orderCollection.aggregate([
            {
                $unwind: "$products",
            },
            {
                $match: {
                    "products.status": "Delivered",
                },
            },
            {
                $count: "deliveredProductsCount"
            }
        ]);
        console.log(salesCount);



        const Pending = await orderCollection.aggregate([
            {
                $unwind: "$products",
            },
            {
                $match: {
                    "products.status": "Pending",
                },
            },
            {
                $count: "deliveredProductsCount"
            }
        ]);

        const orders = await orderCollection.find().count()

        const clients = await collection.find().count()
       
            res.render('admin-dashbord',{userName:'Justin Ram',isSuperAdmin:req.session.isSuperAdmin, sales:salesCount[0].deliveredProductsCount
                ,clients:clients,
                orders:orders,
                Pending:Pending[0].deliveredProductsCount
            })
       
    } catch (error) {
        console.error('Error in Admin_dashbord:', error);
        res.redirect('/admin/errorPage')
    }  
}



const salesReport = async(req,res)=>{
    try {
        console.log("***salesReport***");
        const { startDate, endDate } = req.body;
        console.log("Start Date is:", startDate);
        console.log("End Date is:", endDate);

        console.log('1 ------------------------------------------------------------------------');

        // const Product = await orderModel.aggregate([
        //     {
        //         $match: {
        //             date: {
        //                 $gte: new Date(startDate),
        //                 $lte: new Date(endDate),
        //             },
        //         },
        //     },
        //     {
        //         $unwind: "$products",
        //     },
        //      {
        //         $match: { "status": "Delivered" },
        //     },
        //     {
        //         $group: {
        //             _id: "$products.product",
        //             totalOrders: { $sum: 1 },
        //         },
        //     },
        //     {
        //         $sort: { totalOrders: -1 },
        //     },
        //     {
        //         $limit: 3,
        //     },
        // ]);
        

        // console.log("Product details:", Product);
        console.log('2 ------------------------------------------------------------------------');

        const status = await orderCollection.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                },
            },
            {
                $unwind: "$products",
            },
            {
                $group: {
                    _id: "$products.status",
                    count: { $sum: 1 },
                },
            },
        ]);

        console.log(status,'3 ------------------------------------------------------------------------');

        const revenue = await orderCollection.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                },
            },
            {
                $unwind: "$products",
            },
            {
                $match: {
                    "products.status": "Delivered",
                },
            },
            {
                $project: {
                    amount: {
                        $multiply: ["$products.quantity", "$products.price"],
                    },
                },
            },
            {
                $group: {
                    _id: "",
                    total_revenue: { $sum: "$amount" },
                },
            },
        ]);

        console.log(revenue,'4 ------------------------------------------------------------------------');

        const orderData = await orderCollection.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                },
            },
            {
                $unwind: "$products",
            },
            {
                $match: { "products.status": "Delivered" },
            },
            {
                $sort: { date: 1 },
            },
        ]);

        console.log(orderData,'5 ------------------------------------------------------------------------');

        const totalRevenue = revenue.length > 0 ? revenue[0].total_revenue : 0;

        const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Sales Report - Bagdot</title>
                    <style>
                        body {
                            margin-right: 20px;
                        }
                    </style>
                </head>
                <body>
                    <h2 align="center"> Sales Report Florish Store</h2>
                    From: ${startDate}<br>
                    To: ${endDate}<br>
                    <center>
                    <h3>Orders  </h3>
                        <table style="border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th style="border: 1px solid #000; padding: 8px;">#</th>
                                    <th style="border: 1px solid #000; padding: 8px;">User</th>
                                    <th style="border: 1px solid #000; padding: 8px;">DoO</th>
                                    <th style="border: 1px solid #000; padding: 8px;">Order ID</th>
                                    <th style="border: 1px solid #000; padding: 8px;">Shipped to</th>
                                    <th style="border: 1px solid #000; padding: 8px;">Product Name</th>
                                    <th style="border: 1px solid #000; padding: 8px;">Rate</th>
                                    <th style="border: 1px solid #000; padding: 8px;">Qty</th>
                                    <th style="border: 1px solid #000; padding: 8px;">Paid By</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                ${orderData.map(
            (item, index) => `
                                    <tr>
                                        <td style="border: 1px solid #000; padding-left: 8px;">${index + 1}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item.user}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item.date.toLocaleDateString()}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item.orderID}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item.address.name}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item.products.productName}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item.products.price}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item.products.quantity}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item.paymentMethod}</td>
                                        
                                    </tr>`
        )}
                            </tbody>
                        </table>
                    </center>
                    <br>
                    <center>
                    <h3>Order Status</h3>
                        <table style="border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th style="border: 1px solid #000; padding: 8px;">#</th>
                                    <th style="border: 1px solid #000; padding: 8px;">Status</th>
                                    <th style="border: 1px solid #000; padding: 8px;">Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${status.map(
            (item, index) => `
                                    <tr>
                                        <td style="border: 1px solid #000; padding: 8px;">${index + 1}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item._id}</td>
                                        <td style="border: 1px solid #000; padding: 8px;">${item.count}</td>
                                    </tr>`
        )}
                            </tbody>
                        </table>
                    </center>
                    <br>
                    <center>
                    <h3>Total Revenue generated: <span>₹ ${totalRevenue}</span></h3>
                    </center>
                    <p style="padding-left:20px;">Summary:<br>A total of ${orderData.length} products have been delivered. Total revenue generated is worth ₹ ${totalRevenue}.  </p>
                </body>
                </html>
            `;





            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
    
            const page = await browser.newPage();
            await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
            await page.emulateMediaType('screen');
    
            const pdfPath = 'report.pdf';
            await page.pdf({
                path: pdfPath,
                format: 'A4',
                printBackground: true,
                margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' }
            });
    
    
            await browser.close();
    
            // Send the PDF as a response
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=sales_report.pdf');
            fs.createReadStream(pdfPath).pipe(res);
    
            // Clean up the temporary PDF file
            fs.unlink(pdfPath, err => {
                if (err) throw err;
            });
    

            // const browser = await puppeteer.launch({
            //     executablePath: "/usr/bin/chromium-browser",
            //   });
            //   const page = await browser.newPage();
            //   await page.setContent(htmlContent);
          
            //   const pdfBuffer = await page.pdf();
          
            //   await browser.close();
          
            //   res.setHeader("Content-Length", pdfBuffer.length);
            //   res.setHeader("Content-Type", "application/pdf");
            //   res.setHeader(
            //     "Content-Disposition",
            //     "attachment; filename=Bagdot-Sales.pdf"
            //   );
            //   res.status(200).end(pdfBuffer);

       
    } catch (error) {
        console.error('Error in salesReport:', error);
        res.redirect('/admin/errorPage')
    }  
}



const sales_data = async(req,res)=>{
    try {
        
        console.log("getSalesData");
        const { filter } = req.query;
        console.log("filter--------->>>", filter);
        let salesData = {};
        if (filter === "yearly") {
            salesData = await getYearlySalesData();
        } else if (filter === "monthly") {
            salesData = await getMonthlySalesData();
        } else if (filter === "daily") {
            salesData = await getDailySalesData();
        } else {
            throw new Error("Invalid filter parameter");
        }
        res.json(salesData);

    } catch (error) {
        console.error('Error in sales_data:', error);
        res.redirect('/admin/errorPage')
    }  
}


async function getDailySalesData() {
    const Aggregation = await orderCollection.aggregate([
        {
            $match: {
                date: { $exists: true },
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                count: { $sum: 1 },
            },
        },
        {
            $sort: { _id: 1 },
        },
    ]);
    console.log("Aggregation value for daily graph is: ", Aggregation);

    const saleDate = Aggregation.map((item) => item._id);
    const count = Aggregation.map((item) => item.count);
    return { saleDate, count };
}




async function getMonthlySalesData() {
    console.log('monthly cahrt')
    const Aggregation = await orderCollection.aggregate([
        {
            $match: {
                date: { $exists: true },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" },
                },
                count: { $sum: 1 },
            },
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1,
            },
        },
    ]);

    console.log("Aggregation value for monthly graph is: ", Aggregation);
    const saleDate = Aggregation.map((item) => item._id.month);
    const count = Aggregation.map((item) => item.count);
    return { saleDate, count };
}



async function getYearlySalesData() {
    console.log('yearly cahrt')
    const getYearlySalesData = await orderCollection.aggregate([
        {
            $match: {
                date: { $exists: true },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                },
                count: { $sum: 1 },
            },
        },

    ]);

    console.log("Aggregation value for yearly graph is: ", getYearlySalesData);
    const saleDate = getYearlySalesData.map((item) => item._id.year);
    const count = getYearlySalesData.map((item) => item.count);
    return { saleDate, count };
}





module.exports = {
    Admin_dashbord,
    salesReport,
    sales_data
}