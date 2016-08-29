
const fs = require("fs");

let configure = function configure() {
    let data = fs.readFileSync(__dirname + "/config.json");
    let config = JSON.parse(data.toString());

    let headers = {
        "cookie": config.HEADERS.Cookie,
        "content-type": "application/x-www-form-urlencoded",
        "user-agent": "Chrome",
        "origin": "https://www.facebook.com",
        "accept-language": "en-US,en;q=0.8",
        "pragma": "no-cache",
        "accept": "*/*"
    };

    let payload = {
        client: "web_messenger",
        __user: config.THREAD_INFO.__user,
        __a: config.THREAD_INFO.__a,
        __dyn: config.THREAD_INFO.__dyn,
        __req: config.THREAD_INFO.__req,
        fb_dtsg: config.THREAD_INFO.fb_dtsg,
        ttstamp: config.THREAD_INFO.ttstamp,
        __rev: config.THREAD_INFO.__rev
    };

    /*
     * Check for max response messages
     */
    let messageCount = config.MESSAGE_COUNT;

    if (config.MESSAGE_COUNT > 17500) {
        messageCount = 17500
    }

    payload["messages[thread_fbids][" + config.MESSAGE_ID + "][timestamp]"] = new Date(config.MESSAGE_START).getTime();
    payload["messages[thread_fbids][" + config.MESSAGE_ID + "][limit]"] = messageCount;

    /*
    payload["messages[thread_fbids][" + config.MESSAGE_ID + "][offset]"] = "100000";
    payload["messages[user_ids][" + config.MESSAGE_ID + "][offset]"] = "0";
    payload["messages[user_ids][" + config.MESSAGE_ID + "][limit]"] = config.MESSAGE_COUNT;
    */

    return {
        headers: headers,
        payload: payload
    };

};


module.exports = {
    configure: configure
};
