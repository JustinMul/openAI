import React from 'react';
import './ScrollableTextBox.css'

const ScrollableTextBox = ({ messageList }) => {
  return (
    <div className='textBox'>
      {messageList.map((message, index) => {
        if (message.trim() === '') {
          return null; // Skip rendering empty messages
        }

        const isLeftAligned = index % 2 === 0;

        return (
          <div
            key={index}
            className={`message ${isLeftAligned ? 'left' : 'right'}`}
          >
            {message}
          </div>
        );
      })}
    </div>
  );
};

export default ScrollableTextBox;
