const PostIngramLogin = async (body) => {
    try {
        console.log("Ingram Login")
        console.log(body, "body")
        const res = 
            await fetch('http://localhost:9000/login-ingram/', {
                method: 'post',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    ingramU: body.ingramU,
                    ingramP: body.ingramP
                })
            })
        return res.json();
    } catch (err){
        console.log("Error in GetOrdersByPo: ", err.message);
    }
}

export default PostIngramLogin;