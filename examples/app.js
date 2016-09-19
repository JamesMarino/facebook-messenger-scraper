/**
 * Messenger Scraper Example
 * By James Marino
 * https://jamesmarino.name
 */

const fs = require("fs");

const Scrape = require("../scraper/scraper");
const Config = require("../examples/config.json");

(async () => {

    const outputFile = "./examples/messages.html";

    try {

        let scraper = new Scrape(Config);

        let messages = await scraper.requestMessages();
        let html = Scrape.formatHTML(messages, outputFile);

        fs.writeFileSync(outputFile, html);

        console.log("Saved in examples/messages.html");

    } catch (error) {
        console.error(error);
    }

})();
