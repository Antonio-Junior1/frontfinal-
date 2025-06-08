# ThermoGuard Mobile App




📋 VISÃO GERAL DA SOLUÇÃO
O Sistema Global de Monitoramento de Emergências é uma plataforma tecnológica integrada que visa revolucionar a gestão de riscos e resposta a emergências através do monitoramento contínuo, alertas inteligentes e coordenação eficiente entre múltiplos stakeholders. A solução combina tecnologias de ponta com uma arquitetura robusta para proporcionar resposta rápida e eficaz a situações de emergência.


🎯 OBJETIVO PRINCIPAL
Criar um ecossistema digital que permita a detecção precoce, comunicação instantânea e coordenação eficiente de ações preventivas e de resposta a emergências, reduzindo significativamente o tempo de resposta de mais de 30 minutos para menos de 5 minutos, mantendo disponibilidade superior a 99.9%.

## 📱 Telas do Aplicativo

### 1. **Home (Dashboard)**
- Estatísticas gerais do sistema
- Resumo de sensores e leituras
- Última leitura registrada
- Acesso rápido às funcionalidades principais

### 2. **Sensores**
- Listagem de todos os sensores
- CRUD completo (Create, Read, Update, Delete)
- Formulário com validação robusta
- Busca e filtros

### 3. **Leituras**
- Listagem de todas as leituras de temperatura
- CRUD completo com seleção de sensor
- Cores dinâmicas baseadas na temperatura
- Ordenação por data mais recente

### 4. **Temperaturas Altas**
- Monitoramento de alertas (temperaturas > 40°C)
- Visualização específica para anomalias
- Atualização em tempo real

### 5. **Relatórios por Período**
- Geração de relatórios customizados
- Seleção de período (data início/fim)
- Estatísticas detalhadas (min, max, média)
- Listagem completa das leituras do período

## 🛠 Tecnologias Utilizadas

- **React Native** com Expo
- **React Navigation** (Tab + Stack)
- **Expo Vector Icons** para ícones
- **Date/Time Pickers** para seleção de datas
- **Fetch API** para comunicação HTTP
- **JavaScript ES6+** com async/await

## 📦 Estrutura do Projeto

```
thermoguard-new/
├── config/
│   └── index.js              # Configurações centralizadas
├── navigation/
│   └── AppNavigator.js       # Navegação principal
├── screens/
│   ├── HomeScreen.js         # Dashboard principal
│   ├── SensorListScreen.js   # Listagem de sensores
│   ├── SensorFormScreen.js   # Formulário de sensores
│   ├── LeituraListScreen.js  # Listagem de leituras
│   ├── LeituraFormScreen.js  # Formulário de leituras
│   ├── TemperaturasAltasScreen.js  # Temperaturas altas
│   └── RelatoriosPeriodoScreen.js  # Relatórios
├── services/
│   ├── apiService.js         # Serviço HTTP base
│   ├── sensorService.js      # CRUD de sensores
│   ├── leituraService.js     # CRUD de leituras
│   └── index.js              # Exportações
├── styles/
│   └── theme.js              # Tema e estilos globais
├── App.js                    # Componente principal
└── package.json              # Dependências
```

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 18+
- Expo CLI
- Backend .NET rodando na porta 5285


link do repositorio do backend  https://github.com/luketa02496/gs.net.git


### Instalação
```bash
# Instalar dependências
npm install

# Iniciar o aplicativo
npm start

# Para Android
npm run android

# Para iOS
npm run ios
```

### Configuração da API
O aplicativo está configurado para se conectar ao backend .NET em:
```
http://10.0.2.2:5285/api/
```

Para alterar a URL da API, edite o arquivo `config/index.js`:
```javascript
export const API_CONFIG = {
  BASE_URL: 'http://SEU_BACKEND:PORTA/api/',
  // ...
};
```

## 🌡️ Funcionalidades de Temperatura

### Cores Dinâmicas
- **Muito Frio** (<0°C): Azul escuro
- **Frio** (0-10°C): Azul
- **Normal** (10-20°C): Verde
- **Morno** (20-30°C): Laranja claro
- **Quente** (30-40°C): Laranja
- **Muito Quente** (>40°C): Vermelho

### Validações
- **Temperatura**: Entre -50°C e 100°C
- **Sensor**: Nome (3-100 chars), Localização (3-200 chars)
- **Data/Hora**: Validação de formato e consistência

## 🔄 Integração com Backend .NET

### Endpoints Utilizados
- `GET /api/Sensor` - Listar sensores
- `POST /api/Sensor` - Criar sensor
- `PUT /api/Sensor/{id}` - Atualizar sensor
- `DELETE /api/Sensor/{id}` - Excluir sensor
- `GET /api/Leitura` - Listar leituras
- `POST /api/Leitura` - Criar leitura
- `PUT /api/Leitura/{id}` - Atualizar leitura
- `DELETE /api/Leitura/{id}` - Excluir leitura
- `GET /api/Leitura/temperaturas-altas` - Temperaturas > 40°C
- `GET /api/Leitura/por-periodo` - Leituras por período

### Mapeamento de DTOs
O aplicativo mapeia automaticamente os dados entre o formato JavaScript e os DTOs do .NET, incluindo conversão de datas para ISO strings.

## 🎨 Design System

### Paleta de Cores
- **Primárias**: Azul (#1976D2), Vermelho (#F44336)
- **Secundárias**: Verde (#4CAF50), Laranja (#FF9800)
- **Temperatura**: Escala de azul (frio) a vermelho (quente)

### Componentes
- **Cards** com sombras e bordas arredondadas
- **Botões** com estados visuais claros
- **Inputs** com validação visual
- **FAB** para ações principais
- **Tab Bar** com ícones intuitivos

## 📱 Compatibilidade

- **Android** 6.0+ (API 23+)
- **iOS** 11.0+
- **Expo SDK** 53+
- **React Native** 0.79+




---

**ThermoGuard** - Sistema de Monitoramento de Temperaturas
Desenvolvido com ❤️ usando React Native e .NET

