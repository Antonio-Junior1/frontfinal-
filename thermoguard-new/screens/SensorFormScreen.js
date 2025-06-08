import React, { useState } from 'react';
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
import { theme } from '../styles/theme';
import { sensorService } from '../services';
import { validateSensorData } from '../config';

const SensorFormScreen = ({ navigation, route }) => {
  const sensor = route.params?.sensor;
  const isEditing = !!sensor;

  const [formData, setFormData] = useState({
    nome: sensor?.nome || '',
    localizacao: sensor?.localizacao || '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const validation = validateSensorData(formData);
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
      
      if (isEditing) {
        await sensorService.updateSensor(sensor.id, formData);
        Alert.alert('Sucesso', 'Sensor atualizado com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await sensorService.createSensor(formData);
        Alert.alert('Sucesso', 'Sensor criado com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Erro ao salvar sensor:', error);
      Alert.alert('Erro', error.message || 'Não foi possível salvar o sensor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Campo Nome */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome do Sensor *</Text>
            <TextInput
              style={[styles.input, errors.nome && styles.inputError]}
              value={formData.nome}
              onChangeText={(value) => handleInputChange('nome', value)}
              placeholder="Ex: Sensor Sala Principal"
              placeholderTextColor="#999"
              maxLength={100}
            />
            {errors.nome && (
              <Text style={styles.errorText}>{errors.nome}</Text>
            )}
          </View>

          {/* Campo Localização */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Localização *</Text>
            <TextInput
              style={[styles.input, errors.localizacao && styles.inputError]}
              value={formData.localizacao}
              onChangeText={(value) => handleInputChange('localizacao', value)}
              placeholder="Ex: Sala de Servidores - Andar 2"
              placeholderTextColor="#999"
              maxLength={200}
              multiline
              numberOfLines={3}
            />
            {errors.localizacao && (
              <Text style={styles.errorText}>{errors.localizacao}</Text>
            )}
          </View>

          {/* Informações adicionais */}
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={16} color={theme.colors.secondary.orange} />
              <Text style={styles.infoText}>
                Campos marcados com * são obrigatórios
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
    backgroundColor: theme.colors.primary.blue,
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

export default SensorFormScreen;

