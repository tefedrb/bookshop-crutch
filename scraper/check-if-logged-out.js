const verifyStillLoggedIn = async (page) => {
    const verification = {loggedIn: true, processed: false};
    await page.evaluate(() => {
        const bgText = document.querySelector(".textWhiteBG");
        if(bgText){
            verification.loggedIn = false;
        }
        verification.processed = true;
    }, verification);
    console.log(verification, "VERIFICATION");
    return verification;
}

exports.verifyStillLoggedIn = verifyStillLoggedIn;
