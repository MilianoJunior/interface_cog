// components/Dashboard/Dashboard.jsx
import React, { useMemo } from 'react';
import { AlertCircle, AlertTriangle, Activity, Thermometer, Droplet, Wind, Zap } from 'lucide-react';
import useClpData from '../../hooks/useClpData';
import DataCard from './DataCard';

const Dashboard = () => {
  const {
    data,
    loading,
    error,
    lastUpdate,
    isActive,
    fetchData,
    startPolling,
    stopPolling
  } = useClpData('aparecida', 'principal', 'ug01', { interval: 5000 });

  // Usando useMemo para evitar recálculos desnecessários
  const turbineData = useMemo(() => {
    return Object.entries(data.REAL || {})
      .filter(([key]) => key.startsWith('Turbina_'))
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  }, [data.REAL]);

  const temperatureData = useMemo(() => {
    return Object.entries(data.REAL || {})
      .filter(([key]) => key.includes('RTD'))
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  }, [data.REAL]);

  const generatorData = useMemo(() => {
    return Object.entries(data.REAL || {})
      .filter(([key]) => key.startsWith('Gerador_'))
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  }, [data.REAL]);

  const hydraulicData = useMemo(() => {
    return Object.entries(data.REAL || {})
      .filter(([key]) => key.startsWith('UHLM_') || key.startsWith('UHRV_') || key.startsWith('QCC_') || key.startsWith('QTA_'))
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  }, [data.REAL]);

  // Status geral da usina baseado em indicadores-chave
  const plantStatus = useMemo(() => {
    const criticalTemp = Object.values(temperatureData).some(temp => temp > 65);
    const pressureTooLow = (data.REAL?.UHLM_PressaoOleo < 100) || (data.REAL?.UHRV_PressaoOleo < 100);
    
    if (criticalTemp) {
      return { status: "Alerta", color: "bg-red-100 border-red-500", textColor: "text-red-800" };
    }
    
    if (pressureTooLow) {
      return { status: "Atenção", color: "bg-yellow-100 border-yellow-500", textColor: "text-yellow-800" };
    }
    
    return { status: "Normal", color: "bg-green-100 border-green-500", textColor: "text-green-800" };
  }, [temperatureData, data.REAL]);

  // Renderiza estado de carregamento apenas na primeira vez
  // Para atualizações subsequentes, mantém o conteúdo anterior
  if (loading && !lastUpdate) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-lg mx-auto max-w-4xl mt-8">
        <h2 className="text-red-800 text-xl font-bold">Erro ao carregar dados</h2>
        <p className="text-red-700">{error.message}</p>
        <button 
          onClick={fetchData} 
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard CGH Aparecida</h1>
            <p className="text-gray-600">
              Última atualização: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'N/A'}
              {loading && <span className="ml-2 text-blue-500">(Atualizando...)</span>}
            </p>
          </div>
          <div className={`${plantStatus.color} border-l-4 p-4 rounded`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {plantStatus.status === "Normal" ? (
                  <Activity className="h-5 w-5 text-green-500" />
                ) : plantStatus.status === "Atenção" ? (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${plantStatus.textColor}`}>
                  Status da Usina: <span className="font-bold">{plantStatus.status}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DataCard 
          title="Gerador" 
          data={generatorData}
          icon={<Zap className="text-yellow-500" size={24} />} 
        />
        
        <DataCard 
          title="Turbina" 
          data={turbineData} 
          icon={<Wind className="text-blue-500" size={24} />}
        />
        
        <DataCard 
          title="Sistema Hidráulico" 
          data={hydraulicData} 
          icon={<Droplet className="text-blue-600" size={24} />}
        />
        
        <DataCard 
          title="Temperaturas" 
          data={temperatureData} 
          icon={<Thermometer className="text-red-500" size={24} />}
        />
      </div>

      <div className="flex justify-between mt-8">
        <div>
          <button 
            onClick={fetchData}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            disabled={loading}
          >
            {loading ? 'Atualizando...' : 'Atualizar Agora'}
          </button>
          
          <button 
            onClick={isActive ? stopPolling : startPolling}
            className={`${isActive ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'} text-white font-bold py-2 px-4 rounded`}
          >
            {isActive ? 'Pausar Atualizações' : 'Iniciar Atualizações'}
          </button>
        </div>
        
        <div className="text-xs text-gray-500 text-right">
          <p>Status: {isActive ? 'Atualizando automaticamente' : 'Atualização manual'}</p>
          <p>Intervalo: 5 segundos</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;