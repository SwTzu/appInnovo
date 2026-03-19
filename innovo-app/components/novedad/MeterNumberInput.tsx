import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Text, 
  Keyboard 
} from 'react-native';
import { MeterNumberInputProps } from '@/types/interfaces';
import { useGlobalContext } from '@/contexts/GlobalContext';

const MeterNumberInput: React.FC<MeterNumberInputProps> = ({
  value,
  onChangeText,
  setDireccion,
  editable,
}) => {
  const { offLine } = useGlobalContext();
 const [flag, setFlag] = useState(false);
  // Estado para almacenar los resultados de la búsqueda
  const [filteredData, setFilteredData] = useState(offLine);
  // Controla si se muestran o no las sugerencias
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Cada vez que cambie `value` o `offLine`, volvemos a filtrar
    if (value.trim().length > 0 && !flag) {
      const filtered = offLine.filter((item) => {
        // Si `NumeroMedidor` es nulo o indefinido, lo tratamos como un string vacío
        const meterNumberString = item.NumeroMedidor ? item.NumeroMedidor.toString() : '';
        return meterNumberString.includes(value);
      });
      setFilteredData(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredData([]);
      setShowSuggestions(false);
    }
  }, [value, offLine]);

  // Cuando el usuario selecciona una sugerencia, actualizamos el campo de texto
  const handleSelectSuggestion = (meterNumber: number) => {
    onChangeText(meterNumber.toString());
    setFlag(true);
    setShowSuggestions(false);
    const direccion = offLine.find((item) => item.NumeroMedidor === meterNumber);
    setDireccion(direccion?.calle || '');
    // Opcional: Puedes ocultar el teclado al seleccionar
    Keyboard.dismiss();
    
  };

  return (
    <View style={styles.container}>
      {/* Contenedor para el input y la lista de sugerencias */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Ingrese número de medidor"
          keyboardType="numeric"
          maxLength={12}
          onChangeText={(text) => { onChangeText(text); setFlag(false); }}
          value={value}
          editable={editable}
        />
        {/* Lista de sugerencias */}
        {showSuggestions && filteredData.length > 0 && editable &&(
          <View style={styles.suggestionContainer}>
            {filteredData.slice(0, 3).map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.suggestionItem}
                onPress={() => handleSelectSuggestion(item.NumeroMedidor)}
              >
                <Text style={styles.suggestionText}>
                  {item.NumeroMedidor} - {item.calle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default MeterNumberInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    marginBottom: 20,
    position: 'relative', // Para poder posicionar la lista de sugerencias
    zIndex: 1, // Asegura que las sugerencias se muestren encima de otros elementos
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  input: {
    width: '100%',
    height: '100%',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopRightRadius: 12,
    padding: 10,
    backgroundColor: 'white',
    zIndex: 2,
  },
  searchButton: {
    flex: 0.3,
    backgroundColor: '#0057b7',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionContainer: {
    position: 'absolute',
    top: 50, // Ajusta según la altura del input
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    maxHeight: 200, // Controla la altura máxima de la lista
    zIndex: 3,
  },
  suggestionItem: {
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
});
