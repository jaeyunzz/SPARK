import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView, Alert, TextInput, Modal } from 'react-native'; 
import { useFonts } from 'expo-font';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useConfig } from '../context/ConfigContext';


export default function Dispositivo() {
  const navigation = useNavigation();
  const route = useRoute();
  const nomeDoDispositivo = route.params?.nomeDispositivo || 'Dispositivo';
  const dispositivoId = route.params?.dispositivoId || nomeDoDispositivo; 
  const { config, atualizarDispositivo } = useConfig();
  const { 
    modoEscuro = true, 
    mostrarTensao = true, 
    mostrarCorrente = true, 
    mostrarConsumo = true, 
    mostrarConta = true 
  } = config || {};
  const [nomeEditavel, setNomeEditavel] = useState(nomeDoDispositivo || 'Dispositivo');

  const [modalVisible, setModalVisible] = useState(false);
  const [novoNomeTemporario, setNovoNomeTemporario] = useState(nomeDoDispositivo || 'Dispositivo'); 

  const COR_FUNDO = modoEscuro ? '#1C2E3A' : '#F4F4F9';
  const COR_PRINCIPAL = modoEscuro ? '#F4F4F9' : '#2F4550';
  const COR_SECUNDARIA = modoEscuro ? '#B8D8D9' : '#586F7C';
  const COR_DESTAQUE = modoEscuro ? '#586F7C' : '#B8D8D9';
  const COR_TEXTO_VALOR = modoEscuro ? '#ffffff' : '#000000';

  const [dados, setDados] = useState({
    tensao: 0,
    corrente: 0,
    potencia: 0,
    energia: 0,
    custo: 0,
  });

  const [correnteData, setCorrenteData] = useState([]);
  const [erroFetch, setErroFetch] = useState(null);
  const maxPontos = 20;

  const [fontsLoaded] = useFonts({
    'Kanit': require('../assets/fontes/Kanit-Regular.ttf'),
  });

  useEffect(() => {
    const nome = nomeDoDispositivo || 'Dispositivo';
    setNomeEditavel(nome);
    setNovoNomeTemporario(nome);
  }, [nomeDoDispositivo]);

  useEffect(() => {
    const IP_ESP32 = 'http://10.52.3.38'; 

    const enviarConfiguracoes = async () => {
      const tensao = route.params?.tensao ? route.params.tensao.replace('V', '') : '';
      const potencia = route.params?.potencia ? route.params.potencia : '';

      if (tensao !== '' || potencia !== '') {
        try {
          const url = `${IP_ESP32}/setConfig?tensao=${tensao}&potencia=${potencia}`;
          console.log('Enviando configuração ao ESP32:', url);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const resposta = await fetch(url, {
            signal: controller.signal,
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          clearTimeout(timeoutId);
          
          if (resposta.ok) {
            console.log('Configurações manuais enviadas com sucesso.');
          } else {
            console.warn('Falha ao enviar configuração:', resposta.status);
          }
        } catch (erro) {
          if (erro.name === 'AbortError') {
            console.warn('Timeout ao enviar configuração ao ESP32. Verifique se o dispositivo está na mesma rede.');
          } else if (erro.message?.includes('Network request failed') || erro.message?.includes('Failed to fetch')) {
            console.warn('Não foi possível conectar ao ESP32. Verifique se o dispositivo está na mesma rede e o IP está correto.');
          } else {
            console.error('Erro ao enviar configuração manual:', erro.message || erro);
          }
        }
      }
    };

    enviarConfiguracoes();

    const fetchDados = async () => {
      try {
        const resposta = await fetch(`${IP_ESP32}/dados`, { cache: 'no-store' });
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
        const json = await resposta.json();

        setDados(json);
        setErroFetch(null);

        setCorrenteData(prev => {
          const novos = [...prev, json.corrente];
          return novos.length > maxPontos ? novos.slice(novos.length - maxPontos) : novos;
        });
      } catch (erro) {
        setErroFetch(erro.message);
      }
    };

    fetchDados();
    const intervalo = setInterval(fetchDados, 1000);
    return () => clearInterval(intervalo);
  }, [route.params]);

  if (!fontsLoaded) return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COR_FUNDO }}>
            <Text style={{ color: COR_PRINCIPAL }}>Carregando fontes...</Text>
        </View>
    );

  const consumoMedioData = correnteData.length
    ? correnteData.map((_, i, arr) => arr.slice(0, i + 1).reduce((a, b) => a + b, 0) / (i + 1))
    : [0];

  const consumoMedioAtual = consumoMedioData.length > 0 ? consumoMedioData[consumoMedioData.length - 1] : 0;

  const gerarRelatorio = async () => {
    if (!correnteData.length) {
      Alert.alert('Aviso', 'Não há dados para gerar o relatório.');
      return;
    }

    try {
      let csv = 'Tempo (s),Corrente (A)\n';
      correnteData.forEach((c, i) => {
        csv += `${i + 1},${c.toFixed(3)}\n`;
      });
      csv += `\nDados Totais Mais Recentes:\nEnergia Consumida (kWh),Estimativa da Conta (R$)\n`;
      csv += `${dados.energia?.toFixed(6) ?? '0.000000'},${dados.custo?.toFixed(4) ?? '0.0000'}\n`;

      const caminhoArquivo = FileSystem.documentDirectory + 'relatorio.csv';
      await FileSystem.writeAsStringAsync(caminhoArquivo, csv, { encoding: 'utf8' });

      const info = await FileSystem.getInfoAsync(caminhoArquivo);
      if (!info.exists) throw new Error('Arquivo não foi criado corretamente.');

      await Sharing.shareAsync(caminhoArquivo, {
        mimeType: 'text/csv',
        dialogTitle: 'Compartilhar Relatório',
      });
    } catch (erro) {
      console.error('Erro ao gerar relatório:', erro);
      Alert.alert('Erro', 'Não foi possível gerar o relatório:\n' + erro.message);
    }
  };

  const iniciarEdicao = () => {
    setNovoNomeTemporario(nomeEditavel);
    setModalVisible(true);
  };

  const salvarNovoNome = async () => {
    const nomeAjustado = novoNomeTemporario.trim();

    if (!nomeAjustado) {
      Alert.alert('Aviso', 'O nome não pode ser vazio.');
      return;
    }
    
    setModalVisible(false);
    setNomeEditavel(nomeAjustado); 

    await atualizarDispositivo(dispositivoId, nomeAjustado);

    navigation.dispatch(
      CommonActions.setParams({ 
        dispositivoEditado: {
          id: dispositivoId,
          novoNome: nomeAjustado
        }
      }, 'TelaInicial') 
    );
    navigation.setParams({ nomeDispositivo: nomeAjustado });

    Alert.alert('Sucesso', `Nome alterado para "${nomeAjustado}"`);
  };

  const excluirDispositivo = () => {
    Alert.alert(
      'Excluir Dispositivo',
      `Tem certeza que deseja excluir "${nomeEditavel}"?`, 
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',onPress: () => {
            navigation.dispatch(
              CommonActions.navigate({
                name: 'Main',
                params: {
                  screen: 'TelaInicial',
                  params: {
                    dispositivoExcluido: true,
                    dispositivoIdExcluido: dispositivoId
                  },
                },
              })
            );
          },
        },
      ]
    );
  };

  const itensInformacao = [
    { titulo: 'Tensão Elétrica', valor: `${dados.tensao?.toFixed(2) ?? '0.00'} V`, visivel: mostrarTensao },
    { titulo: 'Consumo da Corrente', valor: `${dados.corrente?.toFixed(3) ?? '0.000'} A`, visivel: mostrarCorrente },
    { titulo: 'Consumo Médio', valor: `${consumoMedioAtual.toFixed(3)} A`, visivel: mostrarConsumo },
    { titulo: 'Consumo da Potência', valor: `${dados.potencia?.toFixed(1) ?? '0.0'} W`, visivel: mostrarConsumo },
    { titulo: 'Energia Consumida', valor: `${dados.energia?.toFixed(6) ?? '0.000000'} kWh`, visivel: mostrarConsumo },
    { titulo: 'Estimativa da Conta', valor: `R$ ${dados.custo?.toFixed(4) ?? '0.0000'}`, visivel: mostrarConta },
  ];

  return (
    <ScrollView style={[styles.scrollContainer, { backgroundColor: COR_FUNDO }]}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: COR_FUNDO, borderColor: COR_DESTAQUE }]}>
            <Text style={[styles.modalTitle, { color: COR_PRINCIPAL }]}>Editar Nome do Dispositivo</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  borderColor: COR_DESTAQUE,
                  color: COR_PRINCIPAL,
                  backgroundColor: modoEscuro ? '#2F4550' : '#E8F0F2' 
                }
              ]}
              onChangeText={setNovoNomeTemporario}
              value={novoNomeTemporario}
              placeholder="Novo nome"
              placeholderTextColor={COR_SECUNDARIA}
              autoFocus={true}
              onSubmitEditing={salvarNovoNome}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#999' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: COR_DESTAQUE }]}
                onPress={salvarNovoNome}
              >
                <Text style={[styles.modalButtonText, { color: modoEscuro ? COR_PRINCIPAL : 'white' }]}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={[styles.container, { backgroundColor: COR_FUNDO }]}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={32} color={COR_PRINCIPAL} />
        </TouchableOpacity>

        <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />

        <Text style={[styles.informacoes, { color: COR_PRINCIPAL }]}>Informações</Text>

        <View style={[styles.dispositivoContainer, { backgroundColor: COR_FUNDO }]}>
          <Text style={[styles.dispositivo, { color: COR_DESTAQUE }]}>{nomeEditavel || 'Dispositivo'}</Text>
          <TouchableOpacity style={styles.botaoEditarIcon} onPress={iniciarEdicao}>
            <Ionicons name="pencil" size={28} color={COR_PRINCIPAL} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.botaoExcluirIcon} onPress={excluirDispositivo}>
            <Ionicons name="trash" size={28} color="red" />
          </TouchableOpacity>
        </View>

        {erroFetch && (
          <Text style={{ color: 'red', marginLeft: 30, marginBottom: 10, fontFamily: 'Kanit' }}>
            Erro ao buscar dados: {erroFetch}. Confirme se o celular está na mesma rede do ESP32.
          </Text>
        )}

        {itensInformacao.map((item, index) => 
          item.visivel ? (
            <View key={index} style={{ marginTop: 10, width: '90%' }}>
              <Text style={[styles.informacaoTitulo, { color: COR_SECUNDARIA }]}>{item.titulo || ''}</Text>
              <Text style={[styles.informacaoValor, { color: COR_TEXTO_VALOR }]}>{item.valor || ''}</Text>
            </View>
          ) : null
        )}

        <Text style={[styles.informacoes, { marginTop: 40, color: COR_PRINCIPAL }]}>Gráfico do Consumo Médio (A)</Text>

        <LineChart
          data={{
            labels: Array(consumoMedioData.length).fill(''),
            datasets: [{ data: consumoMedioData }],
          }}
          width={Dimensions.get('window').width - 30}
          height={220}
          yAxisSuffix="A"
          chartConfig={{
            backgroundColor: COR_DESTAQUE,
            backgroundGradientFrom: modoEscuro ? '#395360' : '#E8F0F2',
            backgroundGradientTo: COR_DESTAQUE,
            decimalPlaces: 3,
            color: (opacity = 1) => modoEscuro ? `rgba(255, 255, 255, ${opacity})` : `rgba(47, 69, 80, ${opacity})`,
            labelColor: (opacity = 1) => modoEscuro ? `rgba(255, 255, 255, ${opacity})` : `rgba(47, 69, 80, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '4', strokeWidth: '2', stroke: modoEscuro ? '#F4F4F9' : '#2F4550' },
          }}
          bezier
          style={{ marginVertical: 20, borderRadius: 16 }}
        />

        <TouchableOpacity style={[styles.botao, { backgroundColor: COR_DESTAQUE }]} activeOpacity={0.7} onPress={gerarRelatorio}>
          <Text style={[styles.botaoText, { color: modoEscuro ? COR_PRINCIPAL : 'white' }]}>Gerar Relatório</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
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
  logo: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  informacoes: {
    fontFamily: 'Kanit',
    fontSize: 30,
  },
  dispositivo: {
    fontFamily: 'Kanit',
    fontSize: 30,
  },
  informacaoTitulo: {
    fontSize: 15,
    fontFamily: 'Kanit',
    alignSelf: 'flex-start',
    marginLeft: 30,
  },
  informacaoValor: {
    fontSize: 15,
    fontFamily: 'Kanit',
    alignSelf: 'flex-start',
    marginLeft: 30,
  },
  botao: {
    width: 200,
    height: 50,
    backgroundColor: '#B8D8D9', 
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 50,
  },
  botaoText: {
    fontFamily: 'Kanit',
    color: 'white',
    fontSize: 20,
  },
  dispositivoContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 40,
    marginBottom: 20,
    justifyContent: 'center', 
  },
  botaoEditarIcon: {
    marginLeft: 10,
    marginRight: 5,
  },
  botaoExcluirIcon: {
    marginLeft: 10, 
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%',
    borderWidth: 2,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Kanit',
    fontSize: 22,
  },
  input: {
    height: 50,
    width: '100%',
    marginBottom: 25,
    borderWidth: 2,
    padding: 12,
    borderRadius: 12,
    fontFamily: 'Kanit',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 15,
  },
  modalButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    flex: 1,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontFamily: 'Kanit',
    fontSize: 16,
    textAlign: 'center',
  },
});