'use strict';
const scraper = require('./scraper');

// --------------- Response Helper -----------------------
function buildResponse(title, output, shouldEndSession) {
    return {
        version: '1.0',
        sessionAttributes: {},
        response: {
            outputSpeech: {
                type: 'PlainText',
                text: output,
            },
            card: {
                type: 'Simple',
                title: `SessionSpeechlet - ${title}`,
                content: `SessionSpeechlet - ${output}`,
            },
            shouldEndSession,
        },
    };
}


// --------------- Skill Behavior -----------------------
function sendBiowetterResponse(callback) {
    const biowetter = scraper.fetchBiowetterToday((biowetter) => {
        if (biowetter) {
            const response = buildResponse(biowetter.title, biowetter.text, true)
            callback(null, response);
        } else {
            callback(new Error("Could not fetch Biowetter"))
        }
    });
}

function sendSessionEndResponse(callback) {
    const response = buildResponse('Session zuende', 'Tschüss!', true);
    callback(null, response);
}


// --------------- Request handler -----------------------
function handleLaunch(launchRequest, callback) {
    console.log('handleLaunch');
    sendBiowetterResponse(callback);
}

function handleIntent(intentRequest, callback) {
    console.log('handleIntent', intentRequest.intent.name);
    switch (intentRequest.intent.name) {
        case 'AMAZON.HelpIntent':
            sendBiowetterResponse(callback);
        case 'AMAZON.StopIntent': // fall through
        case 'AMAZON.CancelIntent':
            sendSessionEndResponse(callback);
        default:
            throw new Error('Invalid intent');
    }
}


// --------------- Main handler -----------------------
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);
        // if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
        //      callback('Invalid Application ID');
        // }
        switch (event.request.type) {
            case 'LaunchRequest':
                handleLaunch(event.request, callback);
                break;
            case 'IntentRequest':
                handleIntent(event.request, callback);
                break;
            case 'SessionEndedRequest':
                callback();
                break;
        }
    } catch (err) {
        callback(err);
    }
};
