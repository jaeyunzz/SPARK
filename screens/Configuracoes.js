import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, SafeAreaView } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useConfig } from '../context/ConfigContext'; 

export default function Configuracoes() {
  const navigation = useNavigation();
  const { config, atualizarConfig } = useConfig();
  const { 
    modoEscuro = true, 
    mostrarTensao = true, 
    mostrarCorrente = true, 
    mostrarConsumo = true, 
    mostrarConta = true 
  } = config || {};

  const [fontsLoaded] = useFonts({
    Kanit: require('../assets/fontes/Kanit-Regular.ttf'),
  });
  if (!fontsLoaded) return null;

  const opcoes = [
    { key: 'tensao', label: 'Mostrar tensão elétrica', value: mostrarTensao ?? true, configKey: 'mostrarTensao' },
    { key: 'corrente', label: 'Mostrar Corrente', value: mostrarCorrente ?? true, configKey: 'mostrarCorrente' },
    { key: 'consumo', label: 'Mostrar Consumo', value: mostrarConsumo ?? true, configKey: 'mostrarConsumo' },
    { key: 'conta', label: 'Mostrar Conta', value: mostrarConta ?? true, configKey: 'mostrarConta' },
  ];

  const atualizarSwitch = (configKey, val) => {
    atualizarConfig({ [configKey]: val });
  };

  const bgColor = modoEscuro ? '#2F4550' : '#F4F4F9';
  const primaryColor = modoEscuro ? '#F4F4F9' : '#2F4550';
  const secondaryColor = modoEscuro ? '#B0C1C8' : '#586F7C';
  const trackColorTrue = modoEscuro ? '#586F7C' : '#6f8b91';


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={28} color={primaryColor} />
      </TouchableOpacity>

      <Text style={[styles.titulo, { color: primaryColor }]}>Configurações</Text>

      <View style={styles.content}>
        {opcoes.map(op => (
          <View key={op.key} style={styles.row}>
            <Text style={[styles.opcoes, { color: secondaryColor }]}>{op.label}</Text>
            <Switch
              value={op.value}
              onValueChange={val => atualizarSwitch(op.configKey, val)} 
              ios_backgroundColor="#d1d8dd"
              trackColor={{ false: '#cfd8de', true: trackColorTrue }}
              thumbColor={op.value ? '#ffffff' : '#f7f7f7'}
              style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50,
    },
    menuButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
    },
    titulo: {
        fontFamily: 'Kanit',
        fontSize: 30,
        marginRight: 170,
        marginTop: 80,
    },
    content: {
        marginTop: 26,
        paddingHorizontal: 28,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start', 
        paddingVertical: 18,
        borderBottomWidth: 0, 
    },
    opcoes: {
        fontSize: 15,
        fontFamily: 'Kanit',
        alignSelf: 'flex-start',
        marginLeft: -16,
        marginRight: 90,
        width: 190, 
    },
});
