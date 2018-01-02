'use strict';

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
function getBiowetterResponse() {
    // TODO parse from website
    const cardTitle = 'Biowetter für heute';
    const speechOutput = 'Die aktuelle Wetterlage wirkt sich negativ auf den gesunden Tiefschlaf und rheumatische Erkrankungen aus. Menschen mit hohem Blutdruck sollten einen Gang zurückschalten, denn unnötige Aufregungen beschleunigen bei dieser Witterung Durchblutung und Stoffwechsel merklich. Das allgemeine Wohlbefinden leidet unter Kopfweh und Migräne.';
    const shouldEndSession = true;
    return buildResponse(cardTitle, speechOutput, shouldEndSession);
}

function getSessionEndResponse() {
    const cardTitle = 'Session zuende';
    const speechOutput = 'Tschüss!';
    const shouldEndSession = true;
    return buildResponse(cardTitle, speechOutput, shouldEndSession);
}


// --------------- Request handler -----------------------
function handleLaunch(launchRequest) {
    console.log('onLaunch');
    return getBiowetterResponse();
}

function handleIntent(intentRequest) {
    console.log('onIntent', intentRequest.intent.name);
    switch (intentRequest.intent.name) {
        case 'AMAZON.HelpIntent':
            return getBiowetterResponse();
        case 'AMAZON.StopIntent': // fall through
        case 'AMAZON.CancelIntent':
            return getSessionEndResponse();
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
                callback(null, handleLaunch(event.request));
                break;
            case 'IntentRequest':
                callback(null, handleIntent(event.request));
                break;
            case 'SessionEndedRequest':
                callback();
                break;
        }
    } catch (err) {
        callback(err);
    }
};
