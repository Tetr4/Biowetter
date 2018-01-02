'use strict';
const cheerio = require('cheerio');
const request = require('request');

function fetchBiowetter(id, callback) {
    request('http://www.meinestadt.de/wildeshausen/wetter/biowetter', (error, response, html) => {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            const element = $(id);
            const [title, text] = element.text().split('\n');
            callback({
                title: title.trim(),
                text: text.trim()
            });
        } else {
            callback(null)
        }
    });
}

exports.fetchBiowetterToday = (callback) => {
    return fetchBiowetter('[id^=ms_bio_first]', callback)
}

exports.fetchBiowetterTomorrow = (callback) => {
    return fetchBiowetter('[id^=ms_bio_second]', callback)
}


