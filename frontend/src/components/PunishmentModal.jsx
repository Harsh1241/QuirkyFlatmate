import React from 'react';

const PunishmentModal = ({ punishment, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Punishment</h3>
        <p className="text-gray-700 mb-4">{punishment}</p>
        <button onClick={onClose} className="bg-blue-500 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  );
};

export default PunishmentModal;