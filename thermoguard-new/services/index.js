/**
 * Exporta todos os serviços da aplicação
 * 
 * Este arquivo centraliza a exportação de todos os serviços,
 * facilitando a importação em outros módulos.
 */

// Serviços principais
export { default as apiService } from './apiService';
export { default as sensorService } from './sensorService';
export { default as leituraService } from './leituraService';

// Exportação padrão com todos os serviços
export default {
  apiService: require('./apiService').default,
  sensorService: require('./sensorService').default,
  leituraService: require('./leituraService').default,
};

