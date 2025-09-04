import React, { useState } from 'react';
import listIcon from '../../resources/list.png'
import tileIcon from '../../resources/Union.png' 
import './index.scss';

const ViewToggle = ({ onChange }) => {
  const [isListMode, setListMode] = useState(true);

  const handleToggle = () => {
    setListMode(!isListMode);
    onChange(!isListMode); // Notify parent component about the view mode change
  };
  const buttonTitle = isListMode ? 'Tile View' : 'List View';

  return (
    <button onClick={handleToggle} className="view-toggle tooltip" data-tooltip={buttonTitle}> 
      {isListMode ? <img src={tileIcon} alt="" /> : <img src={listIcon} alt="" />}
    </button>
  );
};

export default ViewToggle;
