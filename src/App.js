import React, { useState } from 'react';
import { Container } from 'reactstrap';
import { getTokenOrRefresh } from './token_util';
import './custom.css'
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk';

const speechsdk = require('microsoft-cognitiveservices-speech-sdk')

export default function App() {
    const [displayText, setDisplayText] = useState('INITIALIZED: ready to test speech...');
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');

    const languages = [
        { code: 'en-US', name: 'English' },
        { code: 'si-LK', name: 'Sinhala' },
        { code: 'ta-IN', name: 'Tamil' }
    ];

    async function sttFromMic() {
        const tokenObj = await getTokenOrRefresh();
        const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
        speechConfig.speechRecognitionLanguage = selectedLanguage;

        const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
        const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

        setDisplayText('speak into your microphone...');

        recognizer.recognizeOnceAsync(result => {
            if (result.reason === ResultReason.RecognizedSpeech) {
                setDisplayText(`RECOGNIZED: Text=${result.text}`);
            } else {
                setDisplayText('ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.');
            }
        });
    }

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
        setDisplayText(`Language changed to ${languages.find(lang => lang.code === event.target.value).name}. Ready to test speech...`);
    };

    return (
        <Container className="app-container">
            <div className="row main-container">
                <div className="col-6">
                    <div className="mb-3">
                        <label htmlFor="languageSelect" className="form-label">Select Language:</label>
                        <select
                            id="languageSelect"
                            className="form-select mb-3"
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                        >
                            {languages.map(language => (
                                <option key={language.code} value={language.code}>
                                    {language.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <i className="fas fa-microphone fa-lg mr-2" onClick={() => sttFromMic()}></i>
                        Convert speech to text from your mic.
                    </div>
                </div>
                <div className="col-6 output-display rounded">
                    <code>{displayText}</code>
                </div>
            </div>
        </Container>
    );
}