


const home = async(req,res)=>{
    try {
        res.render('home')
    } catch (error) {
        console.error('Error in home:', error);
        res.status(500).send('Internal Error');
    }  
}




module.exports = {
    home
}