(async () => {
    const wait = (time) => new Promise(resolve => setTimeout(() => resolve(), time));

    const getLink = async () => {

        selector = 'body > div._n8._3qx.uiLayer._3qw > div._n9 > div > div > div > div._4-of._50-l._516b > div._4-og';
        rightArrow = 'body > div._n8._3qx.uiLayer._3qw > div._n9 > div > div > div > div._4-of._50-l._516b > div:nth-child(1) > div.clearfix > div._ohf.rfloat > a'

        selectorImg = document.querySelector(`${selector} img`);
        selectorVid = document.querySelector(`${selector} video`);
        selectorRightArrow = document.querySelector(rightArrow);

        if (!selectorImg && !selectorVid) {
            console.log('Waiting For Updates');
            return await wait(1000);
        }
        
        const url = selectorImg ? selectorImg.src : selectorVid.src;

        if (!selectorRightArrow) {
            await wait(1000);
            return url;
        }

        await wait(250);
        document.querySelector(rightArrow).click();
        return url;
    }

    const values = [];

    for (let i = 0; i < 100; i += 1) {
        values.push(await getLink());
    }

    console.log(JSON.stringify(values))

    return await values;
})();
