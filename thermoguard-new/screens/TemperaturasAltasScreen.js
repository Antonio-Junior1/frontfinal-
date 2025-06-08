import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { getTemperatureColor } from '../config';
import { leituraService } from '../services';

const TemperaturasAltasScreen = () => {
  const [leituras, setLeituras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadTemperaturasAltas();
  }, []);

  const loadTemperaturasAltas = async () => {
    try {
      setIsLoading(true);
      const data = await leituraService.getTemperaturasAltas();
      // Ordenar por data mais recente primeiro
      const sortedData = data.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
      setLeituras(sortedData);
    } catch (error) {
      console.error('Erro ao carregar temperaturas altas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as temperaturas altas.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadTemperaturasAltas();
    setIsRefreshing(false);
  };

  const getTemperatureIcon = (temperatura) => {
    if (temperatura > 40) return 'flame';
    return 'thermometer';
  };

  const renderLeituraItem = ({ item }) => (
    <View style={styles.leituraCard}>
      <View style={styles.leituraHeader}>
        <View style={styles.temperaturaContainer}>
          <Ionicons 
            name={getTemperatureIcon(item.temperatura)} 
            size={24} 
            color={getTemperatureColor(item.temperatura)} 
          />
          <Text style={[
            styles.temperatura,
            { color: getTemperatureColor(item.temperatura) }
          ]}>
            {item.temperatura}°C
          </Text>
        </View>
      </View>
      
      <View style={styles.leituraInfo}>
        <Text style={styles.sensorNome}>{item.nomeSensor}</Text>
        <Text style={styles.dataHora}>
          {item.dataHora.toLocaleString('pt-BR')}
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando temperaturas altas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={leituras}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderLeituraItem}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="warning-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma temperatura alta registrada</Text>
            <Text style={styles.emptySubtext}>
              Monitore seus sensores para identificar anomalias
            </Text>
          </View>
        }
        contentContainerStyle={leituras.length === 0 ? styles.emptyList : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  leituraCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leituraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  temperaturaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperatura: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  leituraInfo: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  sensorNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  dataHora: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default TemperaturasAltasScreen;

