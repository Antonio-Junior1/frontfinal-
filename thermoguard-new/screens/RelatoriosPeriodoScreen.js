import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../styles/theme';
import { leituraService } from '../services';

const RelatoriosPeriodoScreen = () => {
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(new Date());
  const [showDatePickerInicio, setShowDatePickerInicio] = useState(false);
  const [showDatePickerFim, setShowDatePickerFim] = useState(false);
  const [leituras, setLeituras] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const handleDateChange = (event, selectedDate, type) => {
    if (type === 'inicio') {
      setShowDatePickerInicio(false);
      if (selectedDate) {
        setDataInicio(selectedDate);
      }
    } else {
      setShowDatePickerFim(false);
      if (selectedDate) {
        setDataFim(selectedDate);
      }
    }
  };

  const generateReport = async () => {
    if (dataInicio > dataFim) {
      Alert.alert('Erro', 'A data de início não pode ser maior que a data de fim.');
      return;
    }

    try {
      setIsLoading(true);
      const data = await leituraService.getLeiturasPorPeriodo(dataInicio, dataFim);
      setLeituras(data);

      if (data.length > 0) {
        const temperaturas = data.map(l => l.temperatura);
        const minTemp = Math.min(...temperaturas);
        const maxTemp = Math.max(...temperaturas);
        const avgTemp = temperaturas.reduce((sum, t) => sum + t, 0) / temperaturas.length;

        setStats({
          minTemp: Math.round(minTemp * 10) / 10,
          maxTemp: Math.round(maxTemp * 10) / 10,
          avgTemp: Math.round(avgTemp * 10) / 10,
          totalLeituras: data.length,
        });
      } else {
        setStats(null);
      }

    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      Alert.alert('Erro', 'Não foi possível gerar o relatório.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Data de Início */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Data de Início</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePickerInicio(true)}
          >
            <Text style={styles.dateText}>
              {dataInicio.toLocaleDateString('pt-BR')}
            </Text>
            <Ionicons name="calendar" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Data de Fim */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Data de Fim</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePickerFim(true)}
          >
            <Text style={styles.dateText}>
              {dataFim.toLocaleDateString('pt-BR')}
            </Text>
            <Ionicons name="calendar" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.generateButton, isLoading && styles.generateButtonDisabled]}
          onPress={generateReport}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text style={styles.generateButtonText}>Gerando...</Text>
          ) : (
            <>
              <Ionicons name="analytics" size={20} color="#fff" />
              <Text style={styles.generateButtonText}>Gerar Relatório</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {stats && (
        <View style={styles.reportSummary}>
          <Text style={styles.summaryTitle}>Resumo do Período</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total de Leituras:</Text>
            <Text style={styles.summaryValue}>{stats.totalLeituras}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Temperatura Mínima:</Text>
            <Text style={styles.summaryValue}>{stats.minTemp}°C</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Temperatura Máxima:</Text>
            <Text style={styles.summaryValue}>{stats.maxTemp}°C</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Temperatura Média:</Text>
            <Text style={styles.summaryValue}>{stats.avgTemp}°C</Text>
          </View>
        </View>
      )}

      {leituras.length > 0 && (
        <View style={styles.reportDetails}>
          <Text style={styles.detailsTitle}>Leituras Detalhadas</Text>
          {leituras.map((item) => (
            <View key={item.id} style={styles.leituraItem}>
              <Text style={styles.leituraText}>
                <Text style={styles.leituraLabel}>Sensor:</Text> {item.nomeSensor}
              </Text>
              <Text style={styles.leituraText}>
                <Text style={styles.leituraLabel}>Data/Hora:</Text> {item.dataHora.toLocaleString('pt-BR')}
              </Text>
              <Text style={styles.leituraText}>
                <Text style={styles.leituraLabel}>Temperatura:</Text> 
                <Text style={{ color: theme.colors.primary.blue, fontWeight: 'bold' }}>
                  {item.temperatura}°C
                </Text>
              </Text>
            </View>
          ))}
        </View>
      )}

      {isLoading && leituras.length === 0 && stats === null && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Gerando relatório...</Text>
        </View>
      )}

      {!isLoading && leituras.length === 0 && stats === null && (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Nenhum relatório gerado</Text>
          <Text style={styles.emptySubtext}>
            Selecione um período e toque em "Gerar Relatório"
          </Text>
        </View>
      )}

      {showDatePickerInicio && (
        <DateTimePicker
          value={dataInicio}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'inicio')}
        />
      )}

      {showDatePickerFim && (
        <DateTimePicker
          value={dataFim}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'fim')}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  generateButton: {
    backgroundColor: theme.colors.secondary.orange,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  generateButtonDisabled: {
    backgroundColor: '#ccc',
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 5,
  },
  reportSummary: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary.blue,
  },
  reportDetails: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  leituraItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leituraText: {
    fontSize: 15,
    marginBottom: 4,
    color: '#333',
  },
  leituraLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default RelatoriosPeriodoScreen;

