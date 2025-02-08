import React from 'react';
import WhistleCounter from '../components/WhistleCounter';
import Notification from '../components/Notification';

const Counter = () => {
  const predefinedCount = 3; // Set your predefined count here

  const handleNotification = () => {
    const audio = new Audio('/path/to/notification-sound.mp3');
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
