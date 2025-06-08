/**
 * Serviço para gerenciar operações CRUD de Leituras
 * 
 * Este serviço fornece métodos para criar, ler, atualizar e excluir
 * leituras de temperatura, integrando com o backend .NET através do ApiService.
 */

import apiService from './apiService';
import { API_ENDPOINTS, validateLeituraData } from '../config';

class LeituraService {
  /**
   * Obtém todas as leituras
   */
  async getAllLeituras() {
    try {
      const leituras = await apiService.get(API_ENDPOINTS.LEITURAS.GET_ALL);
      
      // Converter strings de data para objetos Date
      return leituras.map(leitura => ({
        ...leitura,
        dataHora: new Date(leitura.dataHora),
      }));
    } catch (error) {
      console.error('Erro ao buscar leituras:', error);
      throw error;
    }
  }

  /**
   * Obtém uma leitura específica por ID
   */
  async getLeituraById(id) {
    try {
      const leitura = await apiService.get(API_ENDPOINTS.LEITURAS.GET_BY_ID(id));
      
      // Converter string de data para objeto Date
      return {
        ...leitura,
        dataHora: new Date(leitura.dataHora),
      };
    } catch (error) {
      console.error(`Erro ao buscar leitura ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtém leituras com temperaturas altas (> 40°C)
   */
  async getTemperaturasAltas() {
    try {
      const leituras = await apiService.get(API_ENDPOINTS.LEITURAS.TEMPERATURAS_ALTAS);
      
      // Converter strings de data para objetos Date
      return leituras.map(leitura => ({
        ...leitura,
        dataHora: new Date(leitura.dataHora),
      }));
    } catch (error) {
      console.error('Erro ao buscar temperaturas altas:', error);
      throw error;
    }
  }

  /**
   * Obtém leituras por período
   */
  async getLeiturasPorPeriodo(dataInicio, dataFim) {
    try {
      const params = {
        inicio: dataInicio.toISOString(),
        fim: dataFim.toISOString(),
      };
      
      const leituras = await apiService.get(API_ENDPOINTS.LEITURAS.POR_PERIODO, params);
      
      // Converter strings de data para objetos Date
      return leituras.map(leitura => ({
        ...leitura,
        dataHora: new Date(leitura.dataHora),
      }));
    } catch (error) {
      console.error('Erro ao buscar leituras por período:', error);
      throw error;
    }
  }

  /**
   * Cria uma nova leitura
   */
  async createLeitura(leituraData) {
    try {
      // Validar dados antes de enviar
      const validation = validateLeituraData(leituraData);
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${Object.values(validation.errors).join(', ')}`);
      }

      // Preparar dados para envio (mapeamento para DTO)
      const leituraCreateDto = {
        dataHora: leituraData.dataHora.toISOString(),
        temperatura: parseFloat(leituraData.temperatura),
        sensorId: parseInt(leituraData.sensorId),
      };

      const novaLeitura = await apiService.post(API_ENDPOINTS.LEITURAS.CREATE, leituraCreateDto);
      
      // Converter string de data para objeto Date na resposta
      return {
        ...novaLeitura,
        dataHora: new Date(novaLeitura.dataHora),
      };
    } catch (error) {
      console.error('Erro ao criar leitura:', error);
      throw error;
    }
  }

  /**
   * Atualiza uma leitura existente
   */
  async updateLeitura(id, leituraData) {
    try {
      // Validar dados antes de enviar
      const validation = validateLeituraData(leituraData);
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${Object.values(validation.errors).join(', ')}`);
      }

      // Preparar dados para envio (mapeamento para DTO)
      const leituraUpdateDto = {
        dataHora: leituraData.dataHora.toISOString(),
        temperatura: parseFloat(leituraData.temperatura),
        sensorId: parseInt(leituraData.sensorId),
      };

      await apiService.put(API_ENDPOINTS.LEITURAS.UPDATE(id), leituraUpdateDto);
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar leitura ${id}:`, error);
      throw error;
    }
  }

  /**
   * Exclui uma leitura
   */
  async deleteLeitura(id) {
    try {
      await apiService.delete(API_ENDPOINTS.LEITURAS.DELETE(id));
      return true;
    } catch (error) {
      console.error(`Erro ao excluir leitura ${id}:`, error);
      throw error;
    }
  }
}

// Instância singleton do serviço de leitura
const leituraService = new LeituraService();

export default leituraService;

