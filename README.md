# Facebook Messenger Scraper
Scrapes Group Chat Images / Messages

## Config Details
Get Config Details from `/ajax/mercury/delivery_receipts.php` AJAX call for group thread on https://www.facebook.com/messages

* MESSAGE_COUNT - no larger than 17500
* MESSAGE_START - 2015-9-10 (Year, Month, Day) - North American Format

## Example

    const fs = require("fs");
    
    const Scrape = require("facebook-messenger-scraper");
    const Config = require("./config.json");
    
    (() => {
    
        const outputFile = "./messages.html";
    
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
