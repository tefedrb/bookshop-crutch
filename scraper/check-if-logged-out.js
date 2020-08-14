const verifyStillLoggedIn = async (page) => {
    console.log("verifying...............")
    // https://ipage.ingramcontent.com/ipage/error.jsp?timeout=y
    // We're sorry, but your session has expired. Please
    const verification = await page.evaluate(() => {
        console.log("HERE!! IN THE THING")
        const ingramForm = document.querySelector("form[name='login']");
        // const bgText = document.querySelector(".textWhiteBG");
        const expired = document.querySelector(".errorMessage");

        const verification = { loggedIn: true, processed: false };
        if(expired || ingramForm){
            verification.loggedIn = false;
            // verification.what = String(ingramForm);
            // verification.the = String(bgText);
        } 
        verification.processed = true;
        return verification;
    });
    console.log(verification, "VERIFICATION");
    return verification;
}

exports.verifyStillLoggedIn = verifyStillLoggedIn;
