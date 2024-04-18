

const dealOfTheMonth = async(req,res)=>{
    try {
        res.render('dealOfTheMonth')
    } catch (error) {
        console.error('Error in dealOfTheMonth:', error);
        res.status(500).send('Internal Error');
    }
    
}



module.exports = {
    dealOfTheMonth
}