export const StartLoadingBar = () => {
    let dots = 0
    let milli = 0
    let milliTen = 0
    let seconds = 0
    // console.log("start loading bar");
    let dotsInterval = setInterval(() => {
        let loading = document.getElementById('loading');
        // console.log("dots interval");
        if (dots < 5) {
            loading.innerText += '.'
            dots++
        } else {
            loading.innerText = 'Loading' 
            dots = 0
        }
    }, 100)

    let milliInterval = setInterval(() => {
        let elapsed = document.getElementById('elapsed');
        // console.log("Mili interval");
        if (milli > 9) {
            milliTen++
            milli = 0
            if (milliTen > 9) {
                seconds++
                milliTen = 0
            }
        }
        milli++
        elapsed.innerText = `[ ${seconds}.${milliTen} ]`
    }, 10)
    return [dotsInterval, milliInterval]
}

const clearIntervals = intervalArray => {
    intervalArray.forEach(interval => {
        clearInterval(interval);
    });
}

export const StopLoadingBar = (arr) => {
    clearIntervals(arr);
}

