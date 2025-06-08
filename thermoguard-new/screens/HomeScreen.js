import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { getTemperatureColor } from '../config';
import { sensorService, leituraService } from '../services';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [stats, setStats] = useState({
    totalSensores: 0,
    totalLeituras: 0,
    temperaturasAltas: 0,
    temperaturaMedia: 0,
    ultimaLeitura: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      
      // Carregar dados dos sensores e leituras
      const [sensores, leituras, temperaturasAltas] = await Promise.all([
        sensorService.getAllSensores(),
        leituraService.getAllLeituras(),
        leituraService.getTemperaturasAltas(),
      ]);

      // Calcular estatísticas
      const temperaturaMedia = leituras.length > 0 
        ? leituras.reduce((sum, leitura) => sum + leitura.temperatura, 0) / leituras.length
        : 0;

      // Encontrar última leitura
      const ultimaLeitura = leituras.length > 0 
        ? leituras.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora))[0]
        : null;

      setStats({
        totalSensores: sensores.length,
        totalLeituras: leituras.length,
        temperaturasAltas: temperaturasAltas.length,
        temperaturaMedia: Math.round(temperaturaMedia * 10) / 10,
        ultimaLeitura,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as estatísticas.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando estatísticas...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bem-vindo ao ThermoGuard</Text>
        <Text style={styles.headerSubtitle}>
          Sistema de Monitoramento de Temperaturas
        </Text>
      </View>

      {/* Estatísticas principais */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="hardware-chip" size={24} color={theme.colors.primary.blue} />
            <Text style={styles.statValue}>{stats.totalSensores}</Text>
            <Text style={styles.statLabel}>Sensores</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="thermometer" size={24} color={theme.colors.secondary.green} />
            <Text style={styles.statValue}>{stats.totalLeituras}</Text>
            <Text style={styles.statLabel}>Leituras</Text>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="warning" size={24} color={theme.colors.primary.red} />
            <Text style={[styles.statValue, { color: theme.colors.primary.red }]}>
              {stats.temperaturasAltas}
            </Text>
            <Text style={styles.statLabel}>Temp. Altas</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="analytics" size={24} color={getTemperatureColor(stats.temperaturaMedia)} />
            <Text style={[
              styles.statValue, 
              { color: getTemperatureColor(stats.temperaturaMedia) }
            ]}>
              {stats.temperaturaMedia}°C
            </Text>
            <Text style={styles.statLabel}>Temp. Média</Text>
          </View>
        </View>
      </View>

      {/* Última leitura */}
      {stats.ultimaLeitura && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Última Leitura</Text>
          <View style={styles.ultimaLeituraCard}>
            <View style={styles.ultimaLeituraHeader}>
              <Text style={styles.ultimaLeituraSensor}>
                {stats.ultimaLeitura.nomeSensor}
              </Text>
              <Text style={[
                styles.ultimaLeituraTemp,
                { color: getTemperatureColor(stats.ultimaLeitura.temperatura) }
              ]}>
                {stats.ultimaLeitura.temperatura}°C
              </Text>
            </View>
            <Text style={styles.ultimaLeituraData}>
              {stats.ultimaLeitura.dataHora.toLocaleString('pt-BR')}
            </Text>
          </View>
        </View>
      )}

      {/* Acesso rápido */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        
        <TouchableOpacity 
          style={styles.quickAccessButton}
          onPress={() => navigation.navigate('Sensores')}
        >
          <View style={styles.quickAccessContent}>
            <Ionicons name="hardware-chip" size={24} color="#fff" />
            <Text style={styles.quickAccessText}>Gerenciar Sensores</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.quickAccessButton, { backgroundColor: theme.colors.secondary.green }]}
          onPress={() => navigation.navigate('Leituras')}
        >
          <View style={styles.quickAccessContent}>
            <Ionicons name="thermometer" size={24} color="#fff" />
            <Text style={styles.quickAccessText}>Ver Leituras</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>
        
        
      </View>

      {/* Botão de atualizar */}
      <View style={styles.refreshContainer}>
        <TouchableOpacity style={styles.refreshButton} onPress={loadStats}>
          <Ionicons name="refresh" size={20} color={theme.colors.primary.blue} />
          <Text style={styles.refreshText}>Atualizar Dados</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  ultimaLeituraCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ultimaLeituraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ultimaLeituraSensor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  ultimaLeituraTemp: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ultimaLeituraData: {
    fontSize: 14,
    color: '#666',
  },
  quickAccessButton: {
    backgroundColor: theme.colors.primary.blue,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickAccessContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickAccessText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  refreshContainer: {
    padding: 20,
    alignItems: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  refreshText: {
    color: theme.colors.primary.blue,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default HomeScreen;
