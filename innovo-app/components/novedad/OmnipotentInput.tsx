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
import { DataOffline } from '@/types/interfaces';
const OmnipotentInput: React.FC<MeterNumberInputProps> = ({
  value,
  onChangeText,
  setDireccion,
  editable,
}) => {
  const { offLine } = useGlobalContext();
  const [flag, setFlag] = useState(false);
  const [filteredData, setFilteredData] = useState(offLine);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (value.trim().length > 0 && !flag) {
      const filtered = offLine.filter((item) => {
        const meterNumberString = item.NumeroMedidor ? item.NumeroMedidor.toString() : '';
        return meterNumberString.includes(value) || item.calle.toLowerCase().includes(value.toLowerCase());
      });
      setFilteredData(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredData([]);
      setShowSuggestions(false);
    }
  }, [value, offLine]);

  const handleSelectSuggestion = (item:DataOffline) => {
    onChangeText(item.NumeroMedidor.toString());
    setDireccion(item.calle || '');
    setFlag(true);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Ingrese número de medidor o dirección"
          keyboardType="default"
          maxLength={100}
          onChangeText={(text) => { onChangeText(text); setFlag(false); }}
          value={value}
          editable={editable}
        />
        {showSuggestions && filteredData.length > 0 && editable && (
          <View style={styles.suggestionContainer}>
            {filteredData.slice(0, 3).map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.suggestionItem}
                onPress={() => handleSelectSuggestion(item)}
              >
                <Text style={styles.suggestionText}>
                  {`${item.NumeroMedidor} - ${item.calle}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default OmnipotentInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    marginBottom: 20,
    position: 'relative',
    zIndex: 1,
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
    borderRadius: 12,
    padding: 10,
    backgroundColor: 'white',
    zIndex: 2,
  },
  suggestionContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 12,
    maxHeight: 200,
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
