import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, AlertTriangle, Activity } from 'lucide-react';

// Componente principal do dashboard
const Tabela = () => {
  // Estados para armazenar os dados
  const [realData, setRealData] = useState({});
  const [intData, setIntData] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para gerar dados fictícios para demonstração
  const generateFakeData = () => {
    // Dados REAL fictícios
    const fakeRealData = {
      "UHLM_PressaoOleo": Math.random() * 150,
      "UHLM_VazaoOleo": Math.random() * 50,
      "UHRV_PressaoOleo": 120 + Math.random() * 20,
      "Turbina_MontanteBorboleta": Math.random() * 10,
      "Turbina_PosicaoDistribuidor": 20 + Math.random() * 5,
      "Turbina_PosicaoRotor": 5 + Math.random() * 3,
      "Gerador_FaseAB": 2300 + Math.random() * 100,
      "Gerador_FaseBC": 2300 + Math.random() * 100,
      "Gerador_FaseCA": 2300 + Math.random() * 100,
      "Gerador_ExcitacaoTensao": 130 + Math.random() * 10,
      "Gerador_ExcitacaoCorrente": 85 + Math.random() * 10,
      "Gerador_Media_Varm": 2300 + Math.random() * 100,
      "Gerador_Media_Iarm": Math.random() * 20,
      "MED_750450_AR1_RTD1": 35 + Math.random() * 10,
      "MED_750450_AR1_RTD2": 40 + Math.random() * 8,
      "MED_750450_AR1_RTD3": 42 + Math.random() * 5,
      "MED_750450_AR1_RTD4": 38 + Math.random() * 7,
      "MED_750450_AR2_RTD1": 50 + Math.random() * 12,
      "MED_750450_AR2_RTD2": 48 + Math.random() * 8,
      "MED_750450_AR2_RTD3": 40 + Math.random() * 5,
      "MED_750450_AR2_RTD4": 45 + Math.random() * 10,
      "MED_750450_AR3_RTD1": 50 + Math.random() * 5,
      "MED_750450_AR3_RTD2": 50 + Math.random() * 5,
      "MED_750450_AR3_RTD3": 48 + Math.random() * 5,
      "MED_750450_AR3_RTD4": 47 + Math.random() * 5,
      "MED_750450_AR4_RTD1": 48 + Math.random() * 5,
      "MED_750450_AR4_RTD2": 49 + Math.random() * 5,
      "MED_750450_AR4_RTD3": 60 + Math.random() * 8,
      "MED_750450_AR4_RTD4": 38 + Math.random() * 5,
      "QCC_NivelMontante_Grade": 404 + Math.random() * 2,
      "QCC_NivelJusante_Grade": 404 + Math.random() * 1.5,
      "QTA_NivelJusante_CanalFuga": Math.random() * 2,
      "QCC_NivelDiferencial_Grade": 0.1 + Math.random() * 0.2,
      "QTA_NivelJusante_Grade": Math.random() * 1
    };
    
    // Dados INT fictícios (simplificados)
    const fakeIntData = {
      "Turbina_Velocidade": Math.round(1500 + Math.random() * 50),
      "Turbina_Vazao": Math.round(100 + Math.random() * 20),
      "Turbina_Vibracao01": Math.round(Math.random() * 20),
      "Turbina_Vibracao02": Math.round(Math.random() * 20),
      "F50_U_Neutro": Math.round(15000 + Math.random() * 200),
      "F50_I_FaseA": Math.round(Math.random() * 500),
      "F50_I_FaseB": Math.round(49000 + Math.random() * 1000),
      "F50_I_FaseC": Math.round(48000 + Math.random() * 1000),
      "F50_P_INST": Math.round(Math.random() * 1000),
      "F50_Q_INST": Math.round(Math.random() * 500),
      "F50_S_INST": Math.round(Math.random() * 1500),
      "F50_FHz_INST": Math.round(59.8 + Math.random() * 0.4 * 100) / 100
    };
    
    return {
      REAL: fakeRealData,
      INT: fakeIntData
    };
  };
  
  // Função para buscar os dados (neste caso, gerando dados fictícios)
  const fetchData = useCallback(() => {
    try {
      // Simula um pequeno atraso de rede (100-500ms)
      setTimeout(() => {
        const fakeData = generateFakeData();
        
        // Atualiza os estados com os dados fictícios
        setRealData(fakeData.REAL || {});
        setIntData(fakeData.INT || {});
        setLastUpdate(new Date());
        setLoading(false);
      }, 100 + Math.random() * 400);
    } catch (err) {
      console.error('Erro ao gerar dados fictícios:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  // Busca os dados ao montar o componente e define o intervalo
  useEffect(() => {
    // Busca inicial
    fetchData();
    
    // Configura o intervalo de 5 segundos
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    
    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, [fetchData]);

  // Função para formatar valores (evitar números muito longos)
  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'number') {
      return Number(value).toFixed(2);
    }
    return value;
  };

  // Renderiza um indicador de status baseado no valor
  const StatusIndicator = ({ value, thresholds = { warning: 70, critical: 90 } }) => {
    if (value === null || value === undefined) return <AlertCircle className="text-gray-400" />;
    
    // Ajusta o thresholds para diferentes tipos de medidas
    let adjustedThresholds = thresholds;
    
    // Diferentes limites para temperaturas
    if (typeof value === 'number') {
      if (value >= adjustedThresholds.critical) {
        return <AlertTriangle className="text-red-500" />;
      } else if (value >= adjustedThresholds.warning) {
        return <AlertCircle className="text-yellow-500" />;
      } else {
        return <Activity className="text-green-500" />;
      }
    }
    return <Activity className="text-green-500" />;
  };

  // Componente para exibir um card de dados
  const DataCard = ({ title, data, icon }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {icon}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{key}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{formatValue(value)}</span>
                <StatusIndicator value={value} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Monitor de Dados</h2>
        <p className="text-gray-600">
          Última atualização: {lastUpdate?.toLocaleTimeString()}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DataCard
          title="Dados em Tempo Real"
          data={realData}
          icon={<Activity className="text-blue-500" />}
        />
        <DataCard
          title="Dados Integrais"
          data={intData}
          icon={<Activity className="text-green-500" />}
        />
      </div>
    </div>
  );
};

export default Tabela;