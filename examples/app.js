/**
 * Messenger Scraper Example
 * By James Marino
 * https://jamesmarino.name
 */

const fs = require("fs");

const Scrape = require("../scraper/scraper");
const Config = require("../examples/config.json");

(() => {

    const outputFile = "./examples/messages.html";

    try {

        let scraper = new Scrape(Config);

        scraper.requestMessages().then((messages) => {

            // Validate before anything
            Scrape.validate(messages);

            // Get stats of Messages
            let stats = Scrape.getStats(messages);

            // Get List of Images
            let images = Scrape.getImages(messages);

            // Get List of Chats
            let chats = Scrape.getChats(messages);

            // Output Images to HTML file
            let html = Scrape.formatImagesHTML(messages, outputFile);
            fs.writeFileSync(outputFile, html);

        }).catch((error) => {
            console.error(error);
        });

    } catch (error) {
        console.error(error);
    }

})();
