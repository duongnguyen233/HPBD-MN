import React from 'react';
import './Modal.css';

const Modal = ({ onStart, score }) => {
  return (
    <div className="modul">
      <div className="start">
        {score ? <span>{score} Points!</span> : <span onClick={onStart}>Play Snake</span>}
      </div>
    </div>
  );
};

export default Modal;
