import React, { useState, useEffect } from 'react';

const WhistleCounter = ({ predefinedCount, onNotify, reset }) => {
  const [count, setCount] = useState(() => {
    const savedCount = localStorage.getItem('whistleCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  useEffect(() => {
    if (reset) {
      setCount(0);
      localStorage.removeItem('whistleCount');
    }
  }, [reset]);

  useEffect(() => {
    localStorage.setItem('whistleCount', count);
    if ((count/2) >= predefinedCount) {
      onNotify();
    }
  }, [count, predefinedCount, onNotify]);

  useEffect(() => {
    const startListening = () => {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 2048;

        const bufferLength = analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);

        let isWhistling = false;
        let whistleStartTime = null;
        let whistleDetected = false;

        const detectWhistle = () => {
          analyser.getByteTimeDomainData(dataArray);

          const buffer = new Float32Array(analyser.frequencyBinCount);
          analyser.getFloatFrequencyData(buffer);

          const maxIndex = buffer.reduce((maxIndex, value, index) => value > buffer[maxIndex] ? index : maxIndex, 0);
          const frequency = maxIndex * audioContext.sampleRate / analyser.fftSize;

          if (frequency > 1000) {
            if (!isWhistling) {
              isWhistling = true;
              whistleStartTime = Date.now();
            } else if (Date.now() - whistleStartTime > 2000 && !whistleDetected) {
              setCount(prevCount => prevCount + 1);
              whistleDetected = true;
            }
          } else {
            isWhistling = false;
            whistleStartTime = null;
            whistleDetected = false;
          }

          requestAnimationFrame(detectWhistle);
        };

        detectWhistle();
      }).catch(error => {
        console.error('Error accessing microphone:', error);
      });
    };

    startListening();
  }, []);

  const handleWhistle = () => {
    setCount(prevCount => prevCount + 1);
  };

  return (
    <div>
      <h2>Whistle Counter</h2>
      <p>Count: {count/2}</p>
      <button onClick={handleWhistle}>Whistle</button>
    </div>
  );
};

export default WhistleCounter;
