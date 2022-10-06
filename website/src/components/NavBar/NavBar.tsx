import React, { useState } from 'react';

const barStyle: React.CSSProperties = {
  display: 'flex',
  height: '60px',
  padding: '0 4ch 0 4ch',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '2px solid #178b6e',
};

const btnWrapperStyle = {
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'end',
};

const btnStyle = {
  margin: '0 1ch 0 1ch',
  padding: '2ch',
  border: '2px solid #178b6e',
  borderRadius: '4px',
  transition: 'background-color .3s, color: .3s',
};

export default function NavBar() {
  const [lightBtnHovered, setLightBtnHovered] = useState(false);
  const [darkBtnHovered, setDarkBtnHovered] = useState(false);

  const lightBtnStyle = {
    ...btnStyle,
    color: lightBtnHovered ? '#fff' : '#178b6e',
    backgroundColor: lightBtnHovered ? '#1A178B6E' : '#f5f5f5',
  };

  const darkBtnStyle = {
    ...btnStyle,
    color: darkBtnHovered ? '#178b6e' : '#fff',
    backgroundColor: darkBtnHovered ? '#f5f5f5' : '#178b6e',
  };

  return (
    <header style={barStyle}>
      <div>ShopiCSV</div>
      <div style={btnWrapperStyle}>
        <button
          style={lightBtnStyle}
          onMouseEnter={() => setLightBtnHovered(true)}
          onMouseLeave={() => setLightBtnHovered(false)}
          type="button">
          Sign up for the newsletter
        </button>
        <button
          style={darkBtnStyle}
          onMouseEnter={() => setDarkBtnHovered(true)}
          onMouseLeave={() => setDarkBtnHovered(false)}
          type="button">
          Try the demo
        </button>
      </div>
    </header>
  );
}
