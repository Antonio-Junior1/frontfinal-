/**
 * Serviço para gerenciar operações CRUD de Sensores
 * 
 * Este serviço fornece métodos para criar, ler, atualizar e excluir
 * sensores, integrando com o backend .NET através do ApiService.
 */

import apiService from './apiService';
import { API_ENDPOINTS, validateSensorData } from '../config';

class SensorService {
  /**
   * Obtém todos os sensores
   */
  async getAllSensores() {
    try {
      const sensores = await apiService.get(API_ENDPOINTS.SENSORES.GET_ALL);
      return sensores;
    } catch (error) {
      console.error('Erro ao buscar sensores:', error);
      throw error;
    }
  }

  /**
   * Obtém um sensor específico por ID
   */
  async getSensorById(id) {
    try {
      const sensor = await apiService.get(API_ENDPOINTS.SENSORES.GET_BY_ID(id));
      return sensor;
    } catch (error) {
      console.error(`Erro ao buscar sensor ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cria um novo sensor
   */
  async createSensor(sensorData) {
    try {
      // Validar dados antes de enviar
      const validation = validateSensorData(sensorData);
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${Object.values(validation.errors).join(', ')}`);
      }

      // Preparar dados para envio (mapeamento para DTO)
      const sensorCreateDto = {
        nome: sensorData.nome.trim(),
        localizacao: sensorData.localizacao.trim(),
      };

      const novosensor = await apiService.post(API_ENDPOINTS.SENSORES.CREATE, sensorCreateDto);
      return novosensor;
    } catch (error) {
      console.error('Erro ao criar sensor:', error);
      throw error;
    }
  }

  /**
   * Atualiza um sensor existente
   */
  async updateSensor(id, sensorData) {
    try {
      // Validar dados antes de enviar
      const validation = validateSensorData(sensorData);
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${Object.values(validation.errors).join(', ')}`);
      }

      // Preparar dados para envio (mapeamento para DTO)
      const sensorUpdateDto = {
        nome: sensorData.nome.trim(),
        localizacao: sensorData.localizacao.trim(),
      };

      await apiService.put(API_ENDPOINTS.SENSORES.UPDATE(id), sensorUpdateDto);
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar sensor ${id}:`, error);
      throw error;
    }
  }

  /**
   * Exclui um sensor
   */
  async deleteSensor(id) {
    try {
      await apiService.delete(API_ENDPOINTS.SENSORES.DELETE(id));
      return true;
    } catch (error) {
      console.error(`Erro ao excluir sensor ${id}:`, error);
      throw error;
    }
  }
}

// Instância singleton do serviço de sensor
const sensorService = new SensorService();

export default sensorService;

