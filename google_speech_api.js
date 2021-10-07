// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const fs = require('fs').promises;

// Creates a client
const client = new speech.SpeechClient();

async function quickstart() {
  // The name of the audio file to transcribe
  const fileName = '/home/valtov/Projects/Discord/audio.wav';

  // Reads a local audio file and converts it to base64
  const file = await fs.readFile(fileName);
  const audioBytes = file.toString('base64');

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 44100,
    languageCode: 'en-US',
  };
  const request = {
    audio: audio,
    config: config
  };

  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  console.log(`Transcription: ${transcription}`);
}
quickstart();