const PostIngramLogin = async (body, browser) => {
    const browserStatus = browser?.browserStatus === "connected" ? "connected" : "disconnected";
    const wsEndpoint = browser ? browser.wsEndpoint : null;
    try {
        const res = 
            await fetch('http://localhost:9000/login-ingram/', {
                method: 'post',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    ingramU: body.ingramU,
                    ingramP: body.ingramP,
                    browser: browserStatus,
                    wsEndpoint: wsEndpoint
                })
            })
        if(res.status !== 200){
            return false
        } else {
            return res.json();
        }
    } catch (err){
        console.log("Error in PostIngramLogin: ", err.message);
    }
}

export default PostIngramLogin;