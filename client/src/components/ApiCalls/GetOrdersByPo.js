const GetOrdersByPo = async (poNum) => {
    try {
        console.log("Get orders by po")
        const res = 
            await fetch('http://localhost:9000/run-scraper/' + poNum)
        return res.json();
    } catch (err){
        console.log("Error in GetOrdersByPo: ", err.message);
    }
}

export default GetOrdersByPo;