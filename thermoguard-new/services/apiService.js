/**
 * Serviço de API principal para comunicação com o backend .NET
 * 
 * Este serviço centraliza todas as requisições HTTP para a API,
 * fornecendo métodos para GET, POST, PUT e DELETE com tratamento
 * de erros robusto e timeouts.
 */

import { API_CONFIG, getApiUrl } from '../config';

class ApiService {
  constructor() {
    this.baseURL = getApiUrl();
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Obtém os headers padrão para requisições
   */
  getHeaders() {
    return {
      ...API_CONFIG.DEFAULT_HEADERS,
    };
  }

  /**
   * Cria um controller para timeout das requisições
   */
  createAbortController() {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), this.timeout);
    return controller;
  }

  /**
   * Processa a resposta da API
   */
  async handleResponse(response) {
    // Verificar se a resposta é ok (status 2xx)
    if (!response.ok) {
      let errorMessage = `Erro ${response.status}: ${response.statusText}`;
      
      try {
        // Tentar extrair mensagem de erro do corpo da resposta
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.title) {
          errorMessage = errorData.title;
        } else if (errorData.errors) {
          // Tratar erros de validação do .NET
          const validationErrors = Object.values(errorData.errors).flat();
          errorMessage = validationErrors.join(', ');
        }
      } catch (parseError) {
        // Se não conseguir fazer parse do JSON, usar mensagem padrão
        console.warn('Não foi possível fazer parse da resposta de erro:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    // Verificar se a resposta tem conteúdo
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Se não for JSON, retornar como texto
      return response.text();
    }

    // Retornar dados JSON
    return response.json();
  }

  /**
   * Realiza uma requisição GET
   */
  async get(endpoint, params = {}) {
    try {
      // Construir URL com parâmetros de query
      const url = new URL(this.baseURL + endpoint);
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key]);
        }
      });

      // Configurar controller para timeout
      const controller = this.createAbortController();

      // Realizar requisição
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
        signal: controller.signal,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Erro na requisição GET para ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Realiza uma requisição POST
   */
  async post(endpoint, data = {}) {
    try {
      // Configurar controller para timeout
      const controller = this.createAbortController();

      // Realizar requisição
      const response = await fetch(this.baseURL + endpoint, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Erro na requisição POST para ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Realiza uma requisição PUT
   */
  async put(endpoint, data = {}) {
    try {
      // Configurar controller para timeout
      const controller = this.createAbortController();

      // Realizar requisição
      const response = await fetch(this.baseURL + endpoint, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Erro na requisição PUT para ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Realiza uma requisição DELETE
   */
  async delete(endpoint) {
    try {
      // Configurar controller para timeout
      const controller = this.createAbortController();

      // Realizar requisição
      const response = await fetch(this.baseURL + endpoint, {
        method: 'DELETE',
        headers: this.getHeaders(),
        signal: controller.signal,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Erro na requisição DELETE para ${endpoint}:`, error);
      throw error;
    }
  }
}

// Instância singleton do serviço de API
const apiService = new ApiService();

export default apiService;

