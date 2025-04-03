// hooks/useClpData.js
import { useState, useEffect, useCallback } from 'react';
import { fetchClpData } from '../services/clpService';

/**
 * Hook para buscar e gerenciar dados do CLP
 * 
 * @param {string} usinaId - ID da usina (ex: 'aparecida')
 * @param {string} servidorId - ID do servidor (ex: 'principal')
 * @param {string} clpId - ID do CLP (ex: 'ug01')
 * @param {Object} options - Opções adicionais
 * @param {number} options.interval - Intervalo em ms para atualização (0 para desativar)
 * @param {boolean} options.autoStart - Se deve iniciar a busca automaticamente
 * @returns {Object} - Objeto com dados e funções para controle
 */
const useClpData = (
  usinaId, 
  servidorId, 
  clpId, 
  { interval = 5000, autoStart = true } = {}
) => {
  // Estados para armazenar os diferentes tipos de dados
  const [realData, setRealData] = useState({});
  const [intData, setIntData] = useState({});
  const [dintData, setDintData] = useState({});
  const [timeData, setTimeData] = useState({});
  
  // Estados para controle do ciclo de vida
  const [loading, setLoading] = useState(autoStart);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isActive, setIsActive] = useState(autoStart && interval > 0);

  // Função que busca os dados
  const fetchData = useCallback(async () => {
    if (!usinaId || !servidorId || !clpId) {
      setError(new Error('Parâmetros de configuração incompletos'));
      setLoading(false);
      setInitialLoad(false);
      return;
    }

    try {
      setLoading(true);
      
      const data = await fetchClpData(usinaId, servidorId, clpId);
      
      // Atualiza os estados com os dados recebidos
      setRealData(data.REAL || {});
      setIntData(data.INT || {});
      setDintData(data.DINT || {});
      setTimeData(data.TIME || {});
      
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError(err);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [usinaId, servidorId, clpId]);

  // Iniciar/parar o intervalo de atualização
  const startPolling = useCallback(() => {
    setIsActive(true);
  }, []);

  const stopPolling = useCallback(() => {
    setIsActive(false);
  }, []);

  // Efeito para primeira busca e configuração do intervalo
  useEffect(() => {
    // Busca inicial se autoStart for true
    if (autoStart) {
      fetchData();
    }

    // Configura o intervalo se estiver ativo e intervalo > 0
    let intervalId;
    if (isActive && interval > 0) {
      intervalId = setInterval(fetchData, interval);
    }

    // Limpa o intervalo quando o componente é desmontado
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchData, interval, isActive, autoStart]);

  // Retorna os dados e funções de controle
  return {
    data: {
      REAL: realData,
      INT: intData,
      DINT: dintData,
      TIME: timeData,
    },
    loading,
    initialLoad,
    error,
    lastUpdate,
    isActive,
    fetchData,     // Para atualização manual
    startPolling,  // Para iniciar o intervalo
    stopPolling,   // Para parar o intervalo
  };
};

export default useClpData;