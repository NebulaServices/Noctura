import React, { useState, useEffect } from 'react';

const options = [
  { id: 1, title: 'Ultraviolet', description: 'Highly sophisticated proxy used for evading internet censorship.', image: 'Ultraviolet.png' },
  { id: 2, title: 'Rammerhead', description: 'Proxy based on testcafe-hammerhead.', image: 'Rammerhead.png' },
  { id: 3, title: 'Dynamic', description: 'Dynamic is a new generation interception proxy.', image: 'Dynamic.png' },
];

const Dropdown = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const storedOption = localStorage.getItem('selectedOption');
    if (storedOption) {
      setSelectedOption(JSON.parse(storedOption));
    } else {
      setSelectedOption(options[0]);
    }
  }, []);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    localStorage.setItem('selectedOption', JSON.stringify(option));
  };

  return (
    <div className="custom-dropdown">
      <div className="dropdown-input" onClick={() => handleOptionChange(selectedOption)}>
        {selectedOption ? (
          <>
            <img src={selectedOption.image} className="dropdown-displayed" alt={selectedOption.title} />
          </>
        ) : (
          <>
            <span className="dropdown-placeholder"></span>
            <span className="dropdown-icon"></span>
          </>
        )}
      </div>
      <div className="dropdown-options">
        {options.map((option) => (
          <div
            className="dropdown-option"
            key={option.id}
            onClick={() => handleOptionChange(option)}
          >
            <img src={option.image} className="dropdown-image" alt={option.title} />
            <div className="dropdown-option-details">
              <div className="dropdown-option-title">{option.title}</div>
              <div className="dropdown-option-description">{option.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
