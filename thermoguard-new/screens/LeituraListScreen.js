import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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

const LeituraListScreen = ({ navigation }) => {
  const [leituras, setLeituras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadLeituras();
  }, []);

  const loadLeituras = async () => {
    try {
      setIsLoading(true);
      const data = await leituraService.getAllLeituras();
      // Ordenar por data mais recente primeiro
      const sortedData = data.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
      setLeituras(sortedData);
    } catch (error) {
      console.error('Erro ao carregar leituras:', error);
      Alert.alert('Erro', 'Não foi possível carregar as leituras.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadLeituras();
    setIsRefreshing(false);
  };

  const handleDelete = (leitura) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir esta leitura de ${leitura.temperatura}°C?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteLeitura(leitura.id) },
      ]
    );
  };

  const deleteLeitura = async (id) => {
    try {
      await leituraService.deleteLeitura(id);
      setLeituras(leituras.filter(leitura => leitura.id !== id));
      Alert.alert('Sucesso', 'Leitura excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir leitura:', error);
      Alert.alert('Erro', 'Não foi possível excluir a leitura.');
    }
  };

  const getTemperatureIcon = (temperatura) => {
    if (temperatura < 0) return 'snow';
    if (temperatura < 15) return 'partly-sunny';
    if (temperatura < 25) return 'sunny';
    if (temperatura < 35) return 'thermometer';
    return 'flame';
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
        
        <View style={styles.acoes}>
          <TouchableOpacity
            style={styles.botaoAcao}
            onPress={() => navigation.navigate('LeituraForm', { 
              leitura: { ...item, dataHora: item.dataHora.toISOString() } 
            })}
          >
            <Ionicons name="pencil" size={20} color={theme.colors.primary.blue} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.botaoAcao, styles.botaoExcluir]}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash" size={20} color={theme.colors.primary.red} />
          </TouchableOpacity>
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
        <Text style={styles.loadingText}>Carregando leituras...</Text>
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
            <Ionicons name="thermometer-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma leitura encontrada</Text>
            <Text style={styles.emptySubtext}>
              Toque no botão + para adicionar uma nova leitura
            </Text>
          </View>
        }
        contentContainerStyle={leituras.length === 0 ? styles.emptyList : null}
      />
      
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate('LeituraForm')}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
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
  acoes: {
    flexDirection: 'row',
  },
  botaoAcao: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  botaoExcluir: {
    backgroundColor: '#ffebee',
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
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.secondary.green,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default LeituraListScreen;

