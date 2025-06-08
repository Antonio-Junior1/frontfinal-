/**
 * Tema principal da aplicação ThermoGuard
 * 
 * Define cores, tipografia, espaçamentos e outros elementos
 * de design para manter consistência visual em todo o app.
 */

export const theme = {
  // Paleta de cores principal
  colors: {
    // Cores primárias
    primary: {
      blue: '#1976D2',      // Azul principal - confiança e tecnologia
      red: '#F44336',       // Vermelho - alertas e temperaturas altas
      darkBlue: '#0D47A1',  // Azul escuro - headers e elementos importantes
    },
    
    // Cores secundárias
    secondary: {
      green: '#4CAF50',     // Verde - sucesso e temperaturas normais
      orange: '#FF9800',    // Laranja - avisos e temperaturas moderadas
      purple: '#9C27B0',    // Roxo - elementos especiais
      teal: '#009688',      // Verde-azulado - elementos de apoio
    },
    
    // Cores de temperatura (baseadas em escala térmica)
    temperature: {
      veryHot: '#D32F2F',   // Muito quente (>40°C)
      hot: '#F57C00',       // Quente (30-40°C)
      warm: '#FFA726',      // Morno (20-30°C)
      normal: '#66BB6A',    // Normal (10-20°C)
      cool: '#42A5F5',      // Frio (0-10°C)
      cold: '#1976D2',      // Muito frio (<0°C)
    },
    
    // Cores neutras
    neutral: {
      white: '#FFFFFF',
      lightGray: '#F5F5F5',
      gray: '#9E9E9E',
      darkGray: '#424242',
      black: '#212121',
    },
    
    // Cores de estado
    status: {
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      info: '#2196F3',
    },
    
    // Cores de fundo
    background: {
      primary: '#FFFFFF',
      secondary: '#F5F5F5',
      card: '#FFFFFF',
      modal: 'rgba(0, 0, 0, 0.5)',
    },
    
    // Cores de texto
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#BDBDBD',
      inverse: '#FFFFFF',
    },
    
    // Cores de borda
    border: {
      light: '#E0E0E0',
      medium: '#BDBDBD',
      dark: '#757575',
    },
  },
  
  // Tipografia
  typography: {
    // Tamanhos de fonte
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 28,
      display: 32,
    },
    
    // Pesos de fonte
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
      extraBold: '800',
    },
    
    // Altura de linha
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
      loose: 1.8,
    },
  },
  
  // Espaçamentos
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
  },
  
  // Raios de borda
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    round: 50,
  },
  
  // Sombras
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 16,
    },
  },
  
  // Dimensões de componentes
  components: {
    // Botões
    button: {
      height: {
        sm: 32,
        md: 40,
        lg: 48,
        xl: 56,
      },
      borderRadius: 8,
    },
    
    // Inputs
    input: {
      height: 48,
      borderRadius: 8,
      borderWidth: 1,
    },
    
    // Cards
    card: {
      borderRadius: 12,
      padding: 16,
    },
    
    // FAB (Floating Action Button)
    fab: {
      size: 56,
      borderRadius: 28,
    },
    
    // Tab Bar
    tabBar: {
      height: 60,
      paddingBottom: 5,
      paddingTop: 5,
    },
    
    // Header
    header: {
      height: 56,
    },
  },
  
  // Animações
  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      easeInOut: 'ease-in-out',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      linear: 'linear',
    },
  },
};

// Função para obter cor baseada na temperatura
export const getTemperatureColor = (temperature) => {
  if (temperature >= 40) return theme.colors.temperature.veryHot;
  if (temperature >= 30) return theme.colors.temperature.hot;
  if (temperature >= 20) return theme.colors.temperature.warm;
  if (temperature >= 10) return theme.colors.temperature.normal;
  if (temperature >= 0) return theme.colors.temperature.cool;
  return theme.colors.temperature.cold;
};

// Função para obter ícone baseado na temperatura
export const getTemperatureIcon = (temperature) => {
  if (temperature >= 40) return 'flame';
  if (temperature >= 30) return 'sunny';
  if (temperature >= 20) return 'partly-sunny';
  if (temperature >= 10) return 'cloudy';
  if (temperature >= 0) return 'rainy';
  return 'snow';
};

// Função para obter status da temperatura
export const getTemperatureStatus = (temperature) => {
  if (temperature >= 40) return { status: 'Muito Quente', color: theme.colors.temperature.veryHot };
  if (temperature >= 30) return { status: 'Quente', color: theme.colors.temperature.hot };
  if (temperature >= 20) return { status: 'Morno', color: theme.colors.temperature.warm };
  if (temperature >= 10) return { status: 'Normal', color: theme.colors.temperature.normal };
  if (temperature >= 0) return { status: 'Frio', color: theme.colors.temperature.cool };
  return { status: 'Muito Frio', color: theme.colors.temperature.cold };
};

// Estilos globais comuns
export const globalStyles = {
  // Container principal
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  
  // Card padrão
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.components.card.borderRadius,
    padding: theme.components.card.padding,
    ...theme.shadows.md,
  },
  
  // Texto de título
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  
  // Texto de subtítulo
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  
  // Texto de corpo
  body: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.normal,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeight.normal,
  },
  
  // Botão primário
  primaryButton: {
    backgroundColor: theme.colors.primary.blue,
    height: theme.components.button.height.lg,
    borderRadius: theme.components.button.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  
  // Texto do botão primário
  primaryButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  
  // Input padrão
  input: {
    height: theme.components.input.height,
    borderRadius: theme.components.input.borderRadius,
    borderWidth: theme.components.input.borderWidth,
    borderColor: theme.colors.border.light,
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  
  // FAB
  fab: {
    width: theme.components.fab.size,
    height: theme.components.fab.size,
    borderRadius: theme.components.fab.borderRadius,
    backgroundColor: theme.colors.primary.blue,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
    ...theme.shadows.lg,
  },
  
  // Estado de loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
  },
  
  // Estado vazio
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xxxl,
  },
  
  // Texto de estado vazio
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.disabled,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  
  // Subtexto de estado vazio
  emptySubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
};

export default theme;

