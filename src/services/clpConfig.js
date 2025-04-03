// services/clpConfig.js

// Configuração para CGH Aparecida
const aparecidaLeituras = {
    "REAL": [
      { "nome": "UHLM_PressaoOleo", "addr": 13289 },
      { "nome": "UHLM_VazaoOleo", "addr": 13291 },
      { "nome": "UHRV_PressaoOleo", "addr": 13301 },
      { "nome": "Turbina_MontanteBorboleta", "addr": 13315 },
      { "nome": "Turbina_PosicaoDistribuidor", "addr": 13317 },
      { "nome": "Gerador_FaseAB", "addr": 13385 },
      { "nome": "Gerador_FaseBC", "addr": 13387 },
      { "nome": "Gerador_FaseCA", "addr": 13389 },
      { "nome": "MED_750450_AR1_RTD1", "addr": 13455 },
      { "nome": "MED_750450_AR1_RTD2", "addr": 13457 },
      { "nome": "QCC_NivelMontante_Grade", "addr": 13519 },
      { "nome": "QCC_NivelJusante_Grade", "addr": 13521 }
    ],
    "INT": [
      { "nome": "Reserva_13296", "addr": 13303 },
      { "nome": "F50_U_Neutro", "addr": 13391 },
      { "nome": "F50L_U_FaseAB", "addr": 13385 },
      { "nome": "F50L_U_FaseBC", "addr": 13387 },
      { "nome": "Turbina_Velocidade", "addr": 13321}
    ],
    "DINT": [],
    "TIME": []
  };
  
  // Configurações base para as usinas
  const usinas = {
    aparecida: {
      nome: "CGH Aparecida",
      table: "cgh_aparecida",
      servidores: {
        principal: {
          ip_servidor: "100.110.212.125",
          porta_servidor: "8000",
          clps: {
            ug01: {
              id: 1,
              ug: "UG-01",
              ip_clp: "192.168.10.2",
              porta_clp: "502",
              leituras: aparecidaLeituras
            },
          }
        },
      }
    },
    // Modelo para adicionar outra usina
    // outraUsina: {
    //   nome: "Outra Usina",
    //   table: "outra_usina",
    //   servidores: {
    //     principal: {
    //       ip_servidor: "100.110.213.100",
    //       porta_servidor: "8000",
    //       clps: {
    //         // Configurações dos CLPs desta usina
    //       }
    //     }
    //   }
    // }
  };
  
// Função para obter configuração completa para requisição
const getConfiguracao = (usinaId, servidorId, clpId) => {
    try {
      const usina = usinas[usinaId];
      if (!usina) throw new Error(`Usina ${usinaId} não encontrada`);
      
      const servidor = usina.servidores[servidorId];
      if (!servidor) throw new Error(`Servidor ${servidorId} não encontrado para usina ${usinaId}`);
      
      const clp = servidor.clps[clpId];
      if (!clp) throw new Error(`CLP ${clpId} não encontrado para servidor ${servidorId} da usina ${usinaId}`);
      
      // Monta o objeto de requisição
      return {
        table: usina.table,
        id: clp.id,
        ug: clp.ug,
        ip_servidor: servidor.ip_servidor,
        porta_servidor: servidor.porta_servidor,
        ip_clp: clp.ip_clp, 
        porta_clp: clp.porta_clp,
        leituras: clp.leituras
      };
    } catch (error) {
      console.error("Erro ao obter configuração:", error);
      return null;
    }
  };
  
  
  // Lista todas as combinações disponíveis
  const getOpcoesDisponíveis = () => {
    const opcoes = [];
    
    Object.keys(usinas).forEach(usinaId => {
      const usina = usinas[usinaId];
      
      Object.keys(usina.servidores).forEach(servidorId => {
        const servidor = usina.servidores[servidorId];
        
        Object.keys(servidor.clps).forEach(clpId => {
          const clp = servidor.clps[clpId];
          
          opcoes.push({
            usinaId,
            servidorId,
            clpId,
            nome: `${usina.nome} - ${clp.ug} (${servidorId})`
          });
        });
      });
    });
    
    return opcoes;
  };
  
  export { getConfiguracao, getOpcoesDisponíveis, usinas };