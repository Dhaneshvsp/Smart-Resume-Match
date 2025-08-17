// src/components/Alert.jsx
import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Alert = () => {
  const { alert } = useContext(AuthContext);

  if (alert === null) {
    return null;
  }

  const alertStyles = {
    error: 'bg-red-100 border-red-400 text-red-700',
    success: 'bg-green-100 border-green-400 text-green-700',
  };

  return (
    <div className={`border px-4 py-3 rounded relative mb-4 ${alertStyles[alert.type]}`} role="alert">
      <span className="block sm:inline">{alert.msg}</span>
    </div>
  );
};

export default Alert;
