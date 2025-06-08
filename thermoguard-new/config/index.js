/**
 * Configurações da aplicação ThermoGuard
 * 
 * Este arquivo centraliza todas as configurações do aplicativo,
 * incluindo URLs da API, timeouts e outras constantes.
 */

// Configuração da API
export const API_CONFIG = {
  // URL base da API do backend .NET
  BASE_URL: 'http://10.0.2.2:5285/api/',
  
  // Timeout para requisições (em milissegundos)
  TIMEOUT: 30000,
  
  // Headers padrão para requisições
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Endpoints específicos da API
export const API_ENDPOINTS = {
  // Endpoints de Leitura
  LEITURAS: {
    BASE: 'Leitura',
    GET_ALL: 'Leitura',
    GET_BY_ID: (id) => `Leitura/${id}`,
    CREATE: 'Leitura',
    UPDATE: (id) => `Leitura/${id}`,
    DELETE: (id) => `Leitura/${id}`,
    TEMPERATURAS_ALTAS: 'Leitura/temperaturas-altas',
    POR_PERIODO: 'Leitura/por-periodo',
  },
  
  // Endpoints de Sensor
  SENSORES: {
    BASE: 'Sensor',
    GET_ALL: 'Sensor',
    GET_BY_ID: (id) => `Sensor/${id}`,
    CREATE: 'Sensor',
    UPDATE: (id) => `Sensor/${id}`,
    DELETE: (id) => `Sensor/${id}`,
  },
};

// Configurações de validação
export const VALIDATION_CONFIG = {
  // Validação para Sensor
  SENSOR: {
    NOME_MIN_LENGTH: 3,
    NOME_MAX_LENGTH: 100,
    LOCALIZACAO_MIN_LENGTH: 3,
    LOCALIZACAO_MAX_LENGTH: 200,
  },
  
  // Validação para Leitura
  LEITURA: {
    TEMPERATURA_MIN: -50,
    TEMPERATURA_MAX: 100,
  },
};

// Configurações de UI
export const UI_CONFIG = {
  // Cores para status de temperatura
  TEMPERATURE_COLORS: {
    VERY_COLD: '#1976D2',    // Azul escuro para muito frio
    COLD: '#2196F3',         // Azul para frio
    NORMAL: '#4CAF50',       // Verde para normal
    WARM: '#FF9800',         // Laranja para quente
    HOT: '#F44336',          // Vermelho para muito quente
  },
  
  // Limites de temperatura para cores
  TEMPERATURE_THRESHOLDS: {
    VERY_COLD: 0,
    COLD: 15,
    NORMAL: 25,
    WARM: 35,
    HOT: 40,
  },
  
  // Configurações de paginação
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
};

// Função para obter a URL da API baseada no ambiente
export const getApiUrl = () => {
  // Em um ambiente real, isso poderia verificar variáveis de ambiente
  // Por enquanto, retorna a URL de desenvolvimento
  return API_CONFIG.BASE_URL;
};

// Função para obter a cor baseada na temperatura
export const getTemperatureColor = (temperature) => {
  const { TEMPERATURE_THRESHOLDS, TEMPERATURE_COLORS } = UI_CONFIG;
  
  if (temperature < TEMPERATURE_THRESHOLDS.VERY_COLD) {
    return TEMPERATURE_COLORS.VERY_COLD;
  } else if (temperature < TEMPERATURE_THRESHOLDS.COLD) {
    return TEMPERATURE_COLORS.COLD;
  } else if (temperature < TEMPERATURE_THRESHOLDS.NORMAL) {
    return TEMPERATURE_COLORS.NORMAL;
  } else if (temperature < TEMPERATURE_THRESHOLDS.WARM) {
    return TEMPERATURE_COLORS.WARM;
  } else {
    return TEMPERATURE_COLORS.HOT;
  }
};

// Função para validar dados de sensor
export const validateSensorData = (sensorData) => {
  const errors = {};
  const { SENSOR } = VALIDATION_CONFIG;
  
  // Validar nome
  if (!sensorData.nome || sensorData.nome.trim().length === 0) {
    errors.nome = 'O nome do sensor é obrigatório.';
  } else if (sensorData.nome.trim().length < SENSOR.NOME_MIN_LENGTH) {
    errors.nome = `O nome deve ter pelo menos ${SENSOR.NOME_MIN_LENGTH} caracteres.`;
  } else if (sensorData.nome.trim().length > SENSOR.NOME_MAX_LENGTH) {
    errors.nome = `O nome deve ter no máximo ${SENSOR.NOME_MAX_LENGTH} caracteres.`;
  }
  
  // Validar localização
  if (!sensorData.localizacao || sensorData.localizacao.trim().length === 0) {
    errors.localizacao = 'A localização é obrigatória.';
  } else if (sensorData.localizacao.trim().length < SENSOR.LOCALIZACAO_MIN_LENGTH) {
    errors.localizacao = `A localização deve ter pelo menos ${SENSOR.LOCALIZACAO_MIN_LENGTH} caracteres.`;
  } else if (sensorData.localizacao.trim().length > SENSOR.LOCALIZACAO_MAX_LENGTH) {
    errors.localizacao = `A localização deve ter no máximo ${SENSOR.LOCALIZACAO_MAX_LENGTH} caracteres.`;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Função para validar dados de leitura
export const validateLeituraData = (leituraData) => {
  const errors = {};
  const { LEITURA } = VALIDATION_CONFIG;
  
  // Validar data e hora
  if (!leituraData.dataHora) {
    errors.dataHora = 'A data e hora são obrigatórias.';
  } else if (!(leituraData.dataHora instanceof Date) || isNaN(leituraData.dataHora.getTime())) {
    errors.dataHora = 'Data e hora inválidas.';
  }
  
  // Validar temperatura
  if (leituraData.temperatura === undefined || leituraData.temperatura === null || leituraData.temperatura === '') {
    errors.temperatura = 'A temperatura é obrigatória.';
  } else if (isNaN(leituraData.temperatura)) {
    errors.temperatura = 'A temperatura deve ser um número válido.';
  } else if (leituraData.temperatura < LEITURA.TEMPERATURA_MIN || leituraData.temperatura > LEITURA.TEMPERATURA_MAX) {
    errors.temperatura = `A temperatura deve estar entre ${LEITURA.TEMPERATURA_MIN}°C e ${LEITURA.TEMPERATURA_MAX}°C.`;
  }
  
  // Validar sensor ID
  if (!leituraData.sensorId || isNaN(leituraData.sensorId) || leituraData.sensorId <= 0) {
    errors.sensorId = 'Um sensor válido deve ser selecionado.';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  API_CONFIG,
  API_ENDPOINTS,
  VALIDATION_CONFIG,
  UI_CONFIG,
  getApiUrl,
  getTemperatureColor,
  validateSensorData,
  validateLeituraData,
};

