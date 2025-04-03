// components/Dashboard/DataCard.jsx
import React from 'react';
import StatusIndicator from './StatusIndicator';

// Função para formatar valores
const formatValue = (value, key) => {
  if (value === null || value === undefined) return 'N/A';
  
  // Se for um número
  if (typeof value === 'number') {
    // Para valores que normalmente não precisam de casas decimais (como velocidade)
    if (key.includes('Velocidade') || key.includes('Vazao')) {
      return Math.round(value).toString();
    }
    // Para outros valores, manter as casas decimais
    return Number(value).toFixed(2);
  }
  
  return value;
};

const DataCard = React.memo(({ title, data, icon }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        {icon}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(data || {}).map(([key, value]) => (
          <div key={key} className="flex justify-between border-b border-gray-200 py-2">
            <span className="text-sm text-gray-600">{key}</span>
            <div className="flex items-center">
              <span className="font-medium mr-2">{formatValue(value, key)}</span>
              <StatusIndicator value={value} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default DataCard;