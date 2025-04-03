// services/clpService.js
import { getConfiguracao } from './clpConfig';

// URL base da API
const API_URL = 'http://localhost:8010/readclp';

/**
 * Busca dados do CLP usando as configurações especificadas
 * @param {string} usinaId - Identificador da usina (ex: 'aparecida')
 * @param {string} servidorId - Identificador do servidor (ex: 'principal')
 * @param {string} clpId - Identificador do CLP (ex: 'ug01')
 * @returns {Promise} - Promise com os dados da resposta
 */
export const fetchClpData = async (usinaId, servidorId, clpId) => {
  try {
    // Obtém a configuração da requisição
    const config = getConfiguracao(usinaId, servidorId, clpId);
    
    if (!config) {
      throw new Error('Configuração inválida');
    }
    
    // Faz a requisição para a API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    });
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar dados do CLP:', error);
    throw error;
  }
};

// Função com parâmetros padrão para facilitar o uso
export const fetchAparecidaUG01 = () => {
  return fetchClpData('aparecida', 'principal', 'ug01');
};