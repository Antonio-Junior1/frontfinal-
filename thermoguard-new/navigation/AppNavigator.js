import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Importar telas
import SensorListScreen from '../screens/SensorListScreen';
import SensorFormScreen from '../screens/SensorFormScreen';
import LeituraListScreen from '../screens/LeituraListScreen';
import LeituraFormScreen from '../screens/LeituraFormScreen';
import TemperaturasAltasScreen from '../screens/TemperaturasAltasScreen';
import RelatoriosPeriodoScreen from '../screens/RelatoriosPeriodoScreen';
import HomeScreen from '../screens/HomeScreen';

// Importar tema
import { theme } from '../styles/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator para Sensores
const SensorStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary.blue,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="SensorList" 
      component={SensorListScreen}
      options={{ title: 'Sensores' }}
    />
    <Stack.Screen 
      name="SensorForm" 
      component={SensorFormScreen}
      options={({ route }) => ({
        title: route.params?.sensor ? 'Editar Sensor' : 'Novo Sensor'
      })}
    />
  </Stack.Navigator>
);

// Stack Navigator para Leituras
const LeituraStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary.blue,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="LeituraList" 
      component={LeituraListScreen}
      options={{ title: 'Leituras' }}
    />
    <Stack.Screen 
      name="LeituraForm" 
      component={LeituraFormScreen}
      options={({ route }) => ({
        title: route.params?.leitura ? 'Editar Leitura' : 'Nova Leitura'
      })}
    />
  </Stack.Navigator>
);

// Stack Navigator para Temperaturas Altas
const TemperaturasAltasStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary.red,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="TemperaturasAltasList" 
      component={TemperaturasAltasScreen}
      options={{ title: 'Temperaturas Altas' }}
    />
  </Stack.Navigator>
);

// Stack Navigator para Relatórios
const RelatoriosStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.secondary.orange,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="RelatoriosPeriodoList" 
      component={RelatoriosPeriodoScreen}
      options={{ title: 'Relatórios por Período' }}
    />
  </Stack.Navigator>
);

// Stack Navigator para Home
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary.blue,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen 
      name="HomeMain" 
      component={HomeScreen}
      options={{ title: 'ThermoGuard' }}
    />
  </Stack.Navigator>
);

// Tab Navigator principal
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Sensores':
                iconName = focused ? 'hardware-chip' : 'hardware-chip-outline';
                break;
              case 'Leituras':
                iconName = focused ? 'thermometer' : 'thermometer-outline';
                break;
              case 'Temperaturas Altas':
                iconName = focused ? 'warning' : 'warning-outline';
                break;
              case 'Relatórios':
                iconName = focused ? 'analytics' : 'analytics-outline';
                break;
              default:
                iconName = 'circle';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.colors.primary.blue,
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack}
          options={{
            tabBarLabel: 'Início',
          }}
        />
        <Tab.Screen 
          name="Sensores" 
          component={SensorStack}
          options={{
            tabBarLabel: 'Sensores',
          }}
        />
        <Tab.Screen 
          name="Leituras" 
          component={LeituraStack}
          options={{
            tabBarLabel: 'Leituras',
          }}
        />
        <Tab.Screen 
          name="Temperaturas Altas" 
          component={TemperaturasAltasStack}
          options={{
            tabBarLabel: 'Alertas',
          }}
        />
        <Tab.Screen 
          name="Relatórios" 
          component={RelatoriosStack}
          options={{
            tabBarLabel: 'Relatórios',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

