import React from 'react';
import WhistleCounter from '../components/WhistleCounter';
import Notification from '../components/Notification';

const Counter = () => {
  const predefinedCount = 3; // Set predefined count to 3

  const handleNotification = () => {
    const audio = new Audio('/Audios/cheerful-happy-cooking-food-music-244393.mp3'); // Update the path to the audio file
    audio.play();
  };

  return (
    <div>
      <WhistleCounter predefinedCount={predefinedCount} onNotify={handleNotification} />
      <Notification />
    </div>
  );
};

export default Counter;
