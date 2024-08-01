const { session } = require("passport");
const orderCollection = require("../../../model/orderSchema");
const productCollection = require("../../../model/productSchema");
const walletCollection = require("../../../model/walletSchema");
const { Long } = require("mongodb");
const { format } = require('date-fns');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');





const orderConfirmation =async (req,res)=>{
    try{
        const orderData = await orderCollection.findOne({orderID:req.query.id});
        res.render('orderConfirmation',{isUser:req.session.isUser,data:orderData});
    }catch(error){
        console.error('Error in orderConfirmation :',error);
        res.redirect('/userError');
    }
}

const orderHistory =async (req,res)=>{
    try{
        const orderData = await orderCollection.find({userID:req.session.isUser._id}).populate('products.product').sort({_id:-1})

        

        res.render('orderHistory',{isUser:req.session.isUser,data:orderData});
    }catch(error){
        console.error('Error in orderHistory :',error);
        res.redirect('/userError');
    }
}



const orderTracking =async (req,res)=>{
    try{
        const {id,index} = req.params
        const orderData = await orderCollection.findOne({orderID:id});
       
        
        if (!orderData) {
            return res.render('orderDetails', { isUser: req.session.isUser, data: null, error: 'Order not found' });
        }
        res.render('orderDetails',{isUser:req.session.isUser,data:orderData,index:index, error: null });
    }catch(error){
        console.error('Error in orderDetail :',error);
        res.redirect('/userError');
    }
}


const cancelProducts = async (req, res) => {
    try {    
      
        const {id,i} = req.query
        const data = await orderCollection.findOne({orderID:id})
        const updateData = data.products[i]

        const numProducts = data.products.length;
        const discountPerProduct = data.discount / numProducts;
        const adjustedProductTotal = updateData.Product_total - discountPerProduct;
               
        await orderCollection.updateOne({ orderID: req.query.id }, 
            {
            $set: {
                [`products.${req.query.i}.status`]: 'Cancelled',
                [`products.${req.query.i}.cancel`]: true
            }
        });
        
        await productCollection.updateOne(
            { productName: updateData.productName },
            {
                $inc: { stock: updateData.quantity }
            }
        );


        if(data.paymentMethod !=='COD'){
              
            const walletTransactions = {
                remarks: 'User cancel a product',
                date:new Date(),
                type:'Credit',
                amount:adjustedProductTotal,
            }
            await walletCollection.updateOne({userId:req.session.isUser._id},{$inc:{wallet: +adjustedProductTotal},$addToSet:{walletTransactions:walletTransactions}},{upsert:true})

        }
        

        // Redirect or render response
        res.redirect(`/orderTracking/${id}/${i}`);
    } catch (error) {
        console.error('Error in cancelProducts:', error);
        res.redirect('/userError');
    }
}





const invoice = async (req, res) => {
    try {
        const orderId = req.params.id;

        const orderData = await orderCollection.findOne({ orderID: orderId }).populate('user');

        let formattedDate = {};
        if (orderData && orderData.date) {
            const date = new Date(orderData.date);
            formattedDate.weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
            formattedDate.month = date.toLocaleDateString('en-US', { month: 'long' });
            formattedDate.day = date.toLocaleDateString('en-US', { day: 'numeric' });
            formattedDate.year = date.toLocaleDateString('en-US', { year: 'numeric' });
        }

        res.render('orderInvoice', {
             isUser: req.session.isUser, 
             data: orderData,
             date: formattedDate
            });
    } catch (error) {
        console.error('Error in invoice:', error);
        res.redirect('/userError');
    }
}










const invoiceBill = async (req, res) => {
    try {
        const orderData = await orderCollection.findOne({ orderID: req.params.id });
        date = orderData.date;
       

          //------------------------------------------------------------------//
          
        const num = `${orderData.totalOrderValue}`;
        const wordify = (num) => {
            const single = [
                "Zero",
                "One",
                "Two",
                "Three",
                "Four",
                "Five",
                "Six",
                "Seven",
                "Eight",
                "Nine",
            ];
            const double = [
                "Ten",
                "Eleven",
                "Twelve",
                "Thirteen",
                "Fourteen",
                "Fifteen",
                "Sixteen",
                "Seventeen",
                "Eighteen",
                "Nineteen",
            ];
            const tens = [
                "",
                "Ten",
                "Twenty",
                "Thirty",
                "Forty",
                "Fifty",
                "Sixty",
                "Seventy",
                "Eighty",
                "Ninety",
            ];
            const formatTenth = (digit, prev) => {
                return 0 == digit
                    ? ""
                    : " " + (1 == digit ? double[prev] : tens[digit]);
            };
            const formatOther = (digit, next, denom) => {
                return (
                    (0 != digit && 1 != next ? " " + single[digit] : "") +
                    (0 != next || digit > 0 ? " " + denom : "")
                );
            };
            let res = "";
            let index = 0;
            let digit = 0;
            let next = 0;
            let words = [];
            if (((num += ""), isNaN(parseInt(num)))) {
                res = "";
            } else if (parseInt(num) > 0 && num.length <= 10) {
                for (index = num.length - 1; index >= 0; index--)
                    switch (
                    ((digit = num[index] - 0),
                        (next = index > 0 ? num[index - 1] - 0 : 0),
                        num.length - index - 1)
                    ) {
                        case 0:
                            words.push(formatOther(digit, next, ""));
                            break;
                        case 1:
                            words.push(formatTenth(digit, num[index + 1]));
                            break;
                        case 2:
                            words.push(
                                0 != digit
                                    ? " " +
                                    single[digit] +
                                    " Hundred" +
                                    (0 != num[index + 1] && 0 != num[index + 2] ? " and" : "")
                                    : ""
                            );
                            break;
                        case 3:
                            words.push(formatOther(digit, next, "Thousand"));
                            break;
                        case 4:
                            words.push(formatTenth(digit, num[index + 1]));
                            break;
                        case 5:
                            words.push(formatOther(digit, next, "Lakh"));
                            break;
                        case 6:
                            words.push(formatTenth(digit, num[index + 1]));
                            break;
                        case 7:
                            words.push(formatOther(digit, next, "Crore"));
                            break;
                        case 8:
                            words.push(formatTenth(digit, num[index + 1]));
                            break;
                        case 9:
                            words.push(
                                0 != digit
                                    ? " " +
                                    single[digit] +
                                    " Hundred" +
                                    (0 != num[index + 1] || 0 != num[index + 2]
                                        ? " and"
                                        : " Crore")
                                    : ""
                            );
                    }
                res = words.reverse().join("");
            } else res = "";
            return res;
        };
       
        //------------------------------------------------------------------//

       
        const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice</title>
          <style>
              /! tailwindcss v3.0.12 | MIT License | https://tailwindcss.com/,:after,:before{box-sizing:border-box;border:0 solid #e5e7eb}:after,:before{--tw-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:initial}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:initial;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:initial}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input:-ms-input-placeholder,textarea:-ms-input-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none},:after,:before{--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:#3b82f680;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.flex{display:flex}.table{display:table}.table-cell{display:table-cell}.table-header-group{display:table-header-group}.table-row-group{display:table-row-group}.table-row{display:table-row}.hidden{display:none}.w-60{width:15rem}.w-40{width:10rem}.w-full{width:100%}.w-\[12rem\]{width:12rem}.w-9\/12{width:75%}.w-3\/12{width:25%}.w-6\/12{width:50%}.w-2\/12{width:16.666667%}.w-\[10\%\]{width:10%}.flex-1{flex:1 1 0%}.flex-col{flex-direction:column}.items-start{align-items:flex-start}.items-end{align-items:flex-end}.justify-center{justify-content:center}.rounded-l-lg{border-top-left-radius:.5rem;border-bottom-left-radius:.5rem}.rounded-r-lg{border-top-right-radius:.5rem;border-bottom-right-radius:.5rem}.border-x-\[1px\]{border-left-width:1px;border-right-width:1px}.bg-gray-700{--tw-bg-opacity:1;background-color:rgb(55 65 81/var(--tw-bg-opacity))}.p-10{padding:2.5rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.px-4{padding-left:1rem;padding-right:1rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.pl-4{padding-left:1rem}.pb-20{padding-bottom:5rem}.pb-16{padding-bottom:4rem}.pb-1{padding-bottom:.25rem}.pb-2{padding-bottom:.5rem}.pt-20{padding-top:5rem}.pr-10{padding-right:2.5rem}.pl-24{padding-left:6rem}.pb-6{padding-bottom:1.5rem}.pl-10{padding-left:2.5rem}.text-left{text-align:left}.text-center{text-align:center}.text-right{text-align:right}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.font-bold{font-weight:700}.font-normal{font-weight:400}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128/var(--tw-text-opacity))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.text-gray-400{--tw-text-opacity:1;color:rgb(156 163 175/var(--tw-text-opacity))}.text-black{--tw-text-opacity:1;color:rgb(0 0 0/var(--tw-text-opacity))}
          </style>
      </head>
      <body>
          <div class="p-10">
              <!--Logo and Other info-->
              <div class="flex items-start justify-center">
                  <div class="flex-1">
                      <div class="w-60 pb-6">
                         
                      </div>
                      
                      <div class="w-60 pl-4 pb-6">
                          <h3 class="font-bold">FLOURISH</h3>
                          <p>12th cross, 80th feet Road</p>
                          <p>HSR Layout</p>
                          <p>Bangalore 560075</p>
                      </div>
                      
                      <div class="pl-4 pb-20">
                          <p class="text-gray-500">Shipping to:</p>
                          <h3 class="font-bold">${orderData.address.name
            }</h3>
                          <h3>${orderData.address.housename}, ${orderData.address.street
            }, ${orderData.address.city}</h3>
                          <h3>${orderData.address.State}, ${orderData.address.pincode
            } - ${orderData.address.save_as}</h3>
                      </div>
                      
                  </div>
                  <div class="flex items-end flex-col">
      
                      <div class="pb-16">
                          <h1 class=" font-normal text-4xl pb-1">Invoice</h1>
                          <br><p class="text-right text-gray-500 text-xl"></p>
                          <p class="text-right text-gray-500 text-xl">#: ${orderData.orderID
            }</p>
                      </div>
      
                      <div class="flex">
                          <div class="flex flex-col items-end">
                              <p class="text-gray-500 py-1">Date: </p>
                              <p class="text-gray-500 py-1">Payment Method:</p>
                          </div>
                          <div class="flex flex-col items-end w-[12rem] text-right">
                              <p class="py-1">${date.toDateString()}</p>
                              <p class="py-1 pl-10">${orderData.paymentMethod}</p>
                              
                          </div>
                      </div>
                  </div>
              </div>
              
              <!--Items List-->
      <div class="table w-full">
                  <div class=" table-header-group bg-gray-700 text-white ">
                      <div class=" table-row ">
                          <div class=" table-cell w-6/12 text-left py-2 px-4 rounded-l-lg border-x-[1px]">Item</div>
                          <div class=" table-cell w-[10%] text-center border-x-[1px]">Qty</div>
                          <div class=" table-cell w-2/12 text-center border-x-[1px]">Unit Price</div>
                          
                          <div class=" table-cell w-2/12 text-center rounded-r-lg border-x-[1px]">Amount</div>
                      </div>
                  </div>
      
                  <div class="table-row-group">
                      ${getDeliveryItemsHTML(orderData)}
                  </div>
              </div>
              
              <!--Total Amount-->
             
              
               <div class=" pt-10 pr-10 text-right">
                  <p class="text-gray-400">Sub total: <span class="pl-24 text-black">₹${orderData.totalOrderValue}
                </span></p>
              </div>
             
              
              <div class=" pt-20 pr-10 text-right">
                  <p class="text-gray-400">Total: <span class="pl-24 text-black">₹${orderData.totalOrderValue
            }
                </span></p>
              </div>
  
              <div class=" pt-10 pr-10 text-left">
                  <p class="text-gray-400">Amount in Words: <span class="pl-24 text-black">${wordify(
                num
            )}</span></p>
              </div> 
      
              <!--Notes and Other info-->
              <div class="py-6">
              <br>
                  <p class="text-gray-400 pb-2">Notes: <span>Thanks for ordering with us.</span></p> </div>
      
              <div class="">
                  <p class="text-gray-400 pb-2">Terms: <span style="font-size:8px;">Invoice is Auto generated at the time of delivery,if there is any issue contact provider.</span></p>
                  
              </div>
          </div>
      </body>
      </html>
      `;

        function getDeliveryItemsHTML(orderData) {
            let data = "";
            orderData.products.forEach((value) => {
                data += `
      <div class="table-row">
          <div class=" table-cell w-6/12 text-left font-bold py-1 px-4">${value.productName
                    }</div>
          <div class=" table-cell w-[10%] text-center">${value.quantity
                    }</div>
          <div class=" table-cell w-2/12 text-center">₹${value.price}</div>
          <div class=" table-cell w-2/12 text-center">₹${value.price * value.quantity
                    }</div>
      </div>
      `;
            });
            return data;
        }

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

    } catch (error) {
        console.error('Error in invoice:', error);
        res.redirect('/userError');
    }
}







const ReturnReason = async (req, res) => {
    try {
  
        const { orderID, index, reason } = req.body;
        const order = await orderCollection.findOne({orderID:orderID})
      
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (index < 0 || index >= order.products.length) {
            return res.status(400).json({ message: 'Invalid product index' });
        }


         await orderCollection.updateOne({ orderID: orderID }, 
            {
            $set: {
                [`products.${index}.status`]: `${'Return'}` ,
                [`products.${index}.returnReason`]: reason
            }
        });


        res.status(200).json({ message: 'Order return request processed successfully' })
    } catch (error) {
        console.error('Error in ReturnReason:', error);
        res.redirect('/userError');
    }
}



const reviewRating = async (req, res) => {
    try {

        const { id} = req.query;
        const { rating, review } = req.body;
        const date = new Date
        const userId = req.session.isUser._id;
    
        const productId = id;
    
        const product = await productCollection.findById(productId);
    
        if (!product) {
          res.render("/userError")
        }
    
        const existingUserRating = product.userRatings.find(
          (userRating) => userRating.userId.toString() === userId
        );
    
        if (existingUserRating) {
          existingUserRating.rating = rating;
          existingUserRating.review = review;
          existingUserRating.date = date;
          
        } else {
          product.userRatings.push({ userId, rating, review, date });
        }

        const totalRatings = product.userRatings.reduce((acc, cur) => acc + cur.rating, 0);
        const averageRating = totalRatings / product.userRatings.length;


     
        product.ratingNumber = averageRating;
    
        await product.save();
   
        res.redirect("/orderHistory");
    } catch (error) {
        console.error('Error in reviewRating:', error);
        res.redirect('/userError');
    }
}


module.exports = {
    orderConfirmation,
    orderHistory,
    orderTracking,
    cancelProducts,
    invoice,
    ReturnReason,
    reviewRating,
    invoiceBill
}

