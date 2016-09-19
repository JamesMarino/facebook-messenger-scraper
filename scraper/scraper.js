/**
 * Messenger Scraper
 * By James Marino
 * https://jamesmarino.name
 */

const https = require("https");
const qs = require("querystring");
const moment = require("moment");

class Scrape {

    constructor(config) {

        if (!config) {
            throw new Error("No Configuration Object Specified")
        }

        const MAX_RETRIEVAL = 17500;

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

        if (config.MESSAGE_COUNT > MAX_RETRIEVAL) {
            messageCount = MAX_RETRIEVAL
        }

        payload["messages[thread_fbids][" + config.MESSAGE_ID + "][timestamp]"] = new Date(config.MESSAGE_START).getTime();
        payload["messages[thread_fbids][" + config.MESSAGE_ID + "][limit]"] = messageCount;

        /*
         payload["messages[thread_fbids][" + config.MESSAGE_ID + "][offset]"] = "100000";
         payload["messages[user_ids][" + config.MESSAGE_ID + "][offset]"] = "0";
         payload["messages[user_ids][" + config.MESSAGE_ID + "][limit]"] = config.MESSAGE_COUNT;
         */

        this.Config = {
            headers: headers,
            payload: payload
        };

    }

    requestMessages() {

        let options = {
            hostname: "facebook.com",
            port: 443,
            path: "/ajax/mercury/thread_info.php",
            method: "POST",
            headers: this.Config.headers
        };

        const illegal = "for (;;);";

        return new Promise((resolve) => {

            let request = https.request(options, (response) => {

                let body = "";

                response.on("data", (chunk) => {
                    body += chunk;
                });

                response.on("end", () => {
                    return resolve(JSON.parse(body.replace(illegal, "")))
                });

            });

            request.write(qs.stringify(this.Config.payload));
            request.end();

        });

    }

    static validate(data) {

        if (data.hasOwnProperty("payload")) {

            if (data.payload.hasOwnProperty("actions")) {

                if (data.payload.actions.length > 0) {
                    return true;
                } else {
                    throw new Error("No Messages");
                }

            } else {
                throw new Error("No Data");
            }

        } else {

            let response = "Invalid Facebook Response";

            if (data.hasOwnProperty("errorDescription")) {
                response = data.errorDescription;
            }

            throw new Error(response);
        }

    }

    static getStats(messages) {
        // Todo
        return {};
    }

    static getImages(messages) {
        // Todo
        return [];
    }

    static getChats(messages) {
        // Todo
        return [];
    }

    static formatImagesHTML(data) {

        data = data.payload;

        /*
         * Quick HTML
         */

        let imageLength = 0;

        let html = "<html><head><title>Chat Images</title>" +
            "<style>html, body {font-family: Arial}</style>" +
            "</head><body><div style='width:800px; margin:0 auto;'>" +
            "<h1 style='text-align: center'>Chat Images</h1>";

        let orderedMessages = data.actions.reverse();

        for (const message of orderedMessages) {

            if (message.attachments) {
                for (const attachment of message.attachments) {
                    if (attachment.hires_url) {

                        html += "<img width='100%' src='" + attachment.hires_url + "'/>" +
                            "<p style='color:dimgray'>" +
                            moment(message.timestamp).format("MMMM Do YYYY, h:mm a") +
                            " <b>by " + message.author + "</b></p>" +
                            "<div style='padding-top: 10px'></div>";

                        imageLength++;
                    }
                }
            }
        }

        html += "</div></body></html>";

        return html;

    }

}

module.exports = Scrape;
