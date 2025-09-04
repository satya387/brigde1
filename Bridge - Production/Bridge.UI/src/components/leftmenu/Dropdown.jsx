import React, { useState  } from 'react';
import { NavLink } from 'react-router-dom';
const Dropdown = ({ submenus }) => {
    const [activeItem, setActiveItem] = useState(0);
     
    const handleItemClick = (itemId) => {
        setActiveItem(itemId);  
      
      };
    return (
      <div className="dropdown">
        {submenus.map((submenu, index) => (
         
        <NavLink
            key={submenu.id}
            to={submenu.path}
            
            className={`menuitemBottomLess ${activeItem === submenus.id ? 'active' : ''}`}
            onClick={() =>  handleItemClick(submenu.id)}            
          >
                <img src={submenu.icon} alt={submenu.title}  />
            <span>{submenu.title}</span>   
          </NavLink>
        ))}
      </div>
    );
  };
  
  export default Dropdown;