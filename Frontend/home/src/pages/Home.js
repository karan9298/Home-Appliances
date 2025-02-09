import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import WhistleCounter from '../components/WhistleCounter';

const Home = () => {
  const [isCookingStarted, setIsCookingStarted] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const [microphoneStream, setMicrophoneStream] = useState(null);
  const notificationAudioRef = useRef(null); // Reference to the audio element

  const handleStartCooking = () => {
    if (isCookingStarted) {
      stopListening();
      setIsCookingStarted(false);
      localStorage.setItem('whistleCount', 0); // Reset count in local storage
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

        const buffer = new Float32Array(analyser.frequencyBinCount);
        analyser.getFloatFrequencyData(buffer);

        const maxIndex = buffer.reduce((maxIndex, value, index) => value > buffer[maxIndex] ? index : maxIndex, 0);
        const frequency = maxIndex * context.sampleRate / analyser.fftSize;

        if (frequency > 1000) {
          if (!isWhistling) {
            isWhistling = true;
            whistleStartTime = Date.now();
          } else if (Date.now() - whistleStartTime > 2000) {
            isWhistling = false;
            whistleStartTime = null;
            if (notificationAudioRef.current) {
              notificationAudioRef.current.pause();
              notificationAudioRef.current.currentTime = 0;
            }
            const audio = new Audio('/Audios/cheerful-happy-cooking-food-music-244393.mp3');
            notificationAudioRef.current = audio;
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

    if (notificationAudioRef.current) {
      notificationAudioRef.current.pause();
      notificationAudioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    // Reset count in local storage on component mount (page refresh)
    localStorage.setItem('whistleCount', 0);

    return () => {
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }

      if (microphoneStream) {
        microphoneStream.getTracks().forEach(track => track.stop());
      }

      if (notificationAudioRef.current) {
        notificationAudioRef.current.pause();
        notificationAudioRef.current.currentTime = 0;
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
        <WhistleCounter 
          predefinedCount={3} 
          onNotify={() => {
            if (notificationAudioRef.current) {
              notificationAudioRef.current.pause();
              notificationAudioRef.current.currentTime = 0;
            }
            const audio = new Audio('/Audios/cheerful-happy-cooking-food-music-244393.mp3');
            notificationAudioRef.current = audio;
            audio.play();
          }} 
          reset={false}
        />
      )}
    </div>
  );
};

export default Home;
