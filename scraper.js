/**
 * Messenger Scraper
 * By James Marino
 * https://jamesmarino.name
 */

const https = require("https");
const qs = require("querystring");
const fs = require("fs");
const moment = require("moment");
const setup = require("./config/config");

let data = setup.configure();
requestMessage(data);

function requestMessage(data) {

    let options = {
        hostname: "facebook.com",
        port: 443,
        path: "/ajax/mercury/thread_info.php",
        method: "POST",
        headers: data.headers
    };

    https.request(options, (response) => {

        let body = "";

        response.on("data", (chunk) => {
            body += chunk;
        });

        response.on("end", () => {

            let illegal = "for (;;);";

            try {
                let chatData = JSON.parse(body.replace(illegal, ""));
                format(chatData.payload);
            } catch (err) {
                console.error("Illegal Response: " + err + "\n");
                console.log(body);
            }

        });

    }).end(qs.stringify(data.payload));


}

function format(data) {

    if (data.hasOwnProperty("actions")) {
        if (data.actions.length < 0) {
            throw new Error("No Messages")
        }
    } else {
        throw new Error("Invalid")
    }

    /*
     * Process however you like
     */

    let chatLength = data.actions.length;
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

    fs.writeFileSync(__dirname + "/output/messages.html", html);

    console.log("Finished Writing File\n");
    console.log("Chat Length: " + chatLength);
    console.log("Images: " + imageLength);

}
