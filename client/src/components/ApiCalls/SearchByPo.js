const SearchByPo = async (poNum, wsUrl) => {
    try {
        console.log("Searching by po...")
        const res = 
            await fetch('http://localhost:9000/browser/search-by-po',{
                method: 'post',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    poNum: poNum,
                    wsUrl: wsUrl
                })
            })
        return res.json();
    } catch (err){
        console.log("Error in SearchByPo: ", err.message);
    }
}

export default SearchByPo;