import React from 'react';

const Notification = () => {
  const playSound = () => {
    const audio = new Audio('/path/to/notification-sound.mp3');
    audio.play();
  };

  return (
    <button onClick={playSound}>Test Notification Sound</button>
  );
};

export default Notification;
