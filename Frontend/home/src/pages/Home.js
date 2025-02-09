import React, { useState, useEffect } from 'react';
import './Home.css';
import WhistleCounter from '../components/WhistleCounter';

const Home = () => {
  const [isCookingStarted, setIsCookingStarted] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [microphoneStream, setMicrophoneStream] = useState(null);

  const handleStartCooking = () => {
    if (isCookingStarted) {
      stopListening();
      setIsCookingStarted(false);
    } else {
      startListening();
      setIsCookingStarted(true);
    }
  };

  const startListening = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(context);
      setMicrophoneStream(stream);
      const analyser = context.createAnalyser();
      const microphone = context.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 2048;

      const bufferLength = analyser.fftSize;
      const dataArray = new Uint8Array(bufferLength);

      let isWhistling = false;
      let whistleStartTime = null;

      const detectWhistle = () => {
        analyser.getByteTimeDomainData(dataArray);
        
        // Simple frequency detection logic
        const buffer = new Float32Array(analyser.frequencyBinCount);
        analyser.getFloatFrequencyData(buffer);

        const maxIndex = buffer.reduce((maxIndex, value, index) => value > buffer[maxIndex] ? index : maxIndex, 0);
        const frequency = maxIndex * context.sampleRate / analyser.fftSize;

        if (frequency > 1000) {
          if (!isWhistling) {
            isWhistling = true;
            whistleStartTime = Date.now();
          } else if (Date.now() - whistleStartTime > 2000) {
            // Increment count
            isWhistling = false;
            whistleStartTime = null;
            const audio = new Audio('/Audios/cheerful-happy-cooking-food-music-244393.mp3');
            audio.play();
          }
        } else {
          isWhistling = false;
          whistleStartTime = null;
        }

        if (isCookingStarted) {
          requestAnimationFrame(detectWhistle);
        }
      };

      detectWhistle();
    }).catch(error => {
      console.error('Error accessing microphone:', error);
    });
  };

  const stopListening = () => {
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close().then(() => {
        setAudioContext(null);
      });
    }

    if (microphoneStream) {
      microphoneStream.getTracks().forEach(track => track.stop());
      setMicrophoneStream(null);
    }
  };

  useEffect(() => {
    return () => {
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }

      if (microphoneStream) {
        microphoneStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioContext, microphoneStream]);

  return (
    <div className="home-container">
      <h1 className="home-title">Let's Start Cooking</h1>
      <p className="home-subtitle">Click on the button to start counting whistles.</p>
      <button className="start-cooking-btn" onClick={handleStartCooking}>
        {isCookingStarted ? 'STOP NOW?' : 'Start Cooking'}
      </button>
      {isCookingStarted && (
        <WhistleCounter predefinedCount={3} onNotify={() => {
          const audio = new Audio('/Audios/cheerful-happy-cooking-food-music-244393.mp3');
          audio.play();
        }} />
      )}
    </div>
  );
};

export default Home;
