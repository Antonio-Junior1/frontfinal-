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
import { sensorService } from '../services';

const SensorListScreen = ({ navigation }) => {
  const [sensores, setSensores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadSensores();
    }, [])
  );

  const loadSensores = async () => {
    try {
      setIsLoading(true);
      const data = await sensorService.getAllSensores();
      setSensores(data);
    } catch (error) {
      console.error('Erro ao carregar sensores:', error);
      Alert.alert('Erro', 'Não foi possível carregar os sensores.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadSensores();
    setIsRefreshing(false);
  };

  const handleDelete = (sensor) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir o sensor "${sensor.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteSensor(sensor.id) },
      ]
    );
  };

  const deleteSensor = async (id) => {
    try {
      await sensorService.deleteSensor(id);
      setSensores(sensores.filter(sensor => sensor.id !== id));
      Alert.alert('Sucesso', 'Sensor excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir sensor:', error);
      Alert.alert('Erro', 'Não foi possível excluir o sensor.');
    }
  };

  const renderSensorItem = ({ item }) => (
    <View style={styles.sensorCard}>
      <View style={styles.sensorInfo}>
        <Text style={styles.sensorNome}>{item.nome}</Text>
        <Text style={styles.sensorLocalizacao}>{item.localizacao}</Text>
      </View>
      
      <View style={styles.acoes}>
        <TouchableOpacity
          style={styles.botaoAcao}
          onPress={() => navigation.navigate('SensorForm', { sensor: item })}
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
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando sensores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sensores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSensorItem}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="hardware-chip-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum sensor encontrado</Text>
            <Text style={styles.emptySubtext}>
              Toque no botão + para adicionar um novo sensor
            </Text>
          </View>
        }
        contentContainerStyle={sensores.length === 0 ? styles.emptyList : null}
      />
      
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => navigation.navigate('SensorForm')}
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
  sensorCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sensorInfo: {
    flex: 1,
  },
  sensorNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sensorLocalizacao: {
    fontSize: 14,
    color: '#666',
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
    backgroundColor: theme.colors.primary.blue,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default SensorListScreen;

