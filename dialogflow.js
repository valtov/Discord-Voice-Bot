const speech_handler = require("./speech_handler.js")

async function streamingDetectIntent(
  projectId,
  sessionId,
  audioStream,
  encoding,
  sampleRateHertz,
  languageCode,
  connection, 
  server
) {

  const util = require('util');
  const {Transform, pipeline} = require('stream');
  const {struct} = require('pb-util');

  const pump = util.promisify(pipeline);
  // Imports the Dialogflow library
  const dialogflow = require('@google-cloud/dialogflow');

  // Instantiates a session client
  const sessionClient = new dialogflow.SessionsClient();

  // The path to the local file on which to perform speech recognition, e.g.
  //const filename = './hello.raw';

  // The encoding of the audio file, e.g. 'AUDIO_ENCODING_LINEAR_16'
  //const encoding = 'AUDIO_ENCODING_LINEAR_16';

  // The sample rate of the audio file in hertz, e.g. 16000
  //const sampleRateHertz = 16000;

  // The BCP-47 language code to use, e.g. 'en-US'
  //const languageCode = 'en-US';
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  const initialStreamRequest = {
    session: sessionPath,
    queryInput: {
      audioConfig: {
        audioEncoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
      },
      singleUtterance: true,
    },
  };

  // Create a stream for the streaming request.
  const detectStream = sessionClient
    .streamingDetectIntent()
    .on('error', console.error)
    .on('data', data => {
      if (data.recognitionResult) {
        console.log(`Intermediate transcript: ${data.recognitionResult.transcript}`);
      } else {
        console.log('Detected intent:');

        const result = data.queryResult;
        // Instantiates a context client
        const contextClient = new dialogflow.ContextsClient();

        console.log(`Detected speech: ${result.queryText}`);
        speech_handler.processSpeech(result.queryText, connection, server)
      }
    });

  // Write the initial stream request to config for audio input.
  detectStream.write(initialStreamRequest);

  // Stream an audio file from disk to the Conversation API, e.g.
  // "./resources/audio.raw"
  await pump(
    audioStream,
    // Format the audio stream into the request format.
    new Transform({
      objectMode: true,
      transform: (obj, _, next) => {
        next(null, {inputAudio: obj});
      },
    }),
    detectStream
  );
  // [END dialogflow_detect_intent_streaming] 
}

exports.streamingDetectIntent = streamingDetectIntent;