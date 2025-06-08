import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../styles/theme';
import { leituraService, sensorService } from '../services';
import { validateLeituraData } from '../config';

const LeituraFormScreen = ({ navigation, route }) => {
  const leitura = route.params?.leitura;
  const isEditing = !!leitura;

  const [formData, setFormData] = useState({
    dataHora: leitura?.dataHora ? new Date(leitura.dataHora) : new Date(),
    temperatura: leitura?.temperatura?.toString() || '',
    sensorId: leitura?.sensorId || '',
  });
  const [sensores, setSensores] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadSensores();
  }, []);

  const loadSensores = async () => {
    try {
      const data = await sensorService.getAllSensores();
      setSensores(data);
    } catch (error) {
      console.error('Erro ao carregar sensores:', error);
      Alert.alert('Erro', 'Não foi possível carregar os sensores.');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(formData.dataHora);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      handleInputChange('dataHora', newDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(formData.dataHora);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      handleInputChange('dataHora', newDate);
    }
  };

  const validateForm = () => {
    const validation = validateLeituraData({
      ...formData,
      temperatura: parseFloat(formData.temperatura),
      sensorId: parseInt(formData.sensorId),
    });
    setErrors(validation.errors);
    return validation.isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Erro de Validação', 'Por favor, corrija os erros antes de continuar.');
      return;
    }

    try {
      setIsLoading(true);
      
      const leituraData = {
        dataHora: formData.dataHora,
        temperatura: parseFloat(formData.temperatura),
        sensorId: parseInt(formData.sensorId),
      };

      if (isEditing) {
        await leituraService.updateLeitura(leitura.id, leituraData);
        Alert.alert('Sucesso', 'Leitura atualizada com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await leituraService.createLeitura(leituraData);
        Alert.alert('Sucesso', 'Leitura criada com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Erro ao salvar leitura:', error);
      Alert.alert('Erro', error.message || 'Não foi possível salvar a leitura.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSensorNome = (sensorId) => {
    const sensor = sensores.find(s => s.id === parseInt(sensorId));
    return sensor ? sensor.nome : 'Selecione um sensor';
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Campo Data */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Data *</Text>
            <TouchableOpacity
              style={[styles.input, styles.dateInput, errors.dataHora && styles.inputError]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formData.dataHora.toLocaleDateString('pt-BR')}
              </Text>
              <Ionicons name="calendar" size={20} color="#666" />
            </TouchableOpacity>
            {errors.dataHora && (
              <Text style={styles.errorText}>{errors.dataHora}</Text>
            )}
          </View>

          {/* Campo Hora */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Hora *</Text>
            <TouchableOpacity
              style={[styles.input, styles.dateInput]}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.dateText}>
                {formData.dataHora.toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
              <Ionicons name="time" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Campo Temperatura */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Temperatura (°C) *</Text>
            <TextInput
              style={[styles.input, errors.temperatura && styles.inputError]}
              value={formData.temperatura}
              onChangeText={(value) => handleInputChange('temperatura', value)}
              placeholder="Ex: 25.5"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
            {errors.temperatura && (
              <Text style={styles.errorText}>{errors.temperatura}</Text>
            )}
          </View>

          {/* Campo Sensor */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Sensor *</Text>
            <View style={[styles.input, styles.pickerContainer, errors.sensorId && styles.inputError]}>
              <Picker
                selectedValue={formData.sensorId}
                onValueChange={(value) => handleInputChange('sensorId', value)}
                style={styles.picker}
              >
                <Picker.Item label="Selecione um sensor" value="" />
                {sensores.map(sensor => (
                  <Picker.Item 
                    key={sensor.id} 
                    label={`${sensor.nome} - ${sensor.localizacao}`} 
                    value={sensor.id} 
                  />
                ))}
              </Picker>
            </View>
            {errors.sensorId && (
              <Text style={styles.errorText}>{errors.sensorId}</Text>
            )}
          </View>

          {/* Informações adicionais */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={16} color={theme.colors.secondary.orange} />
              <Text style={styles.infoText}>
                Temperatura deve estar entre -50°C e 100°C
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botões de ação */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text style={styles.saveButtonText}>Salvando...</Text>
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>
                {isEditing ? 'Atualizar' : 'Salvar'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Date/Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.dataHora}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={formData.dataHora}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: theme.colors.primary.red,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    padding: 0,
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
  },
  errorText: {
    color: theme.colors.primary.red,
    fontSize: 14,
    marginTop: 4,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    backgroundColor: theme.colors.secondary.green,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 5,
  },
});

export default LeituraFormScreen;

