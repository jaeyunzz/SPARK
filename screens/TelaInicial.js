import React, { useState, useEffect } from 'react';  
import { Image, Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import { Ionicons } from '@expo/vector-icons'; 
import { useConfig } from '../context/ConfigContext'; 

export default function TelaInicial() {
    const navigation = useNavigation();
    const route = useRoute(); 
    const { config } = useConfig();
    const { modoEscuro = true } = config || {};
    const { dispositivos, adicionarDispositivo, atualizarDispositivo, removerDispositivo } = useConfig();

    const [fontsLoaded] = useFonts({
        'Kanit': require('../assets/fontes/Kanit-Regular.ttf'),
    });

    const COR_FUNDO = modoEscuro ? '#1C2E3A' : '#F4F4F9';
    const COR_PRINCIPAL = modoEscuro ? '#F4F4F9' : '#2F4550'; 
    const COR_DESTAQUE = modoEscuro ? '#586F7C' : '#B8D8D9'; 

    useEffect(() => {
        if (route.params?.novoDispositivo) {
            navigation.setParams({ novoDispositivo: undefined }); 
        }
        if (route.params?.dispositivoEditado) {
            const { id, novoNome } = route.params.dispositivoEditado;
            atualizarDispositivo(id, novoNome);
            navigation.setParams({ dispositivoEditado: undefined }); 
        }
        if (route.params?.dispositivoExcluido === true && route.params?.dispositivoIdExcluido) {
            removerDispositivo(route.params.dispositivoIdExcluido);
            navigation.setParams({ dispositivoExcluido: undefined, dispositivoIdExcluido: undefined }); 
        }
    }, [route.params?.novoDispositivo, route.params?.dispositivoEditado, route.params?.dispositivoExcluido, route.params?.dispositivoIdExcluido]); 

    if (!fontsLoaded) {
        return <Text style={{ color: COR_PRINCIPAL }}>Carregando fontes...</Text>;
    }

    const handleNavigateToCadastro = () => {
        navigation.navigate('CadastroDispositivo'); 
    };

    const handleAbrirDispositivo = (dispositivo) => {
        navigation.navigate('MainDispositivo', { 
            screen: 'Dispositivo', 
            params: { 
                nomeDispositivo: dispositivo.nome,
                dispositivoId: dispositivo.id,
                tensao: dispositivo.tensao,
                potencia: dispositivo.potencia
            } 
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: COR_FUNDO }]}>
            <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
                <Ionicons name="menu" size={32} color={COR_PRINCIPAL} />
            </TouchableOpacity>

            <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <View style={styles.dispositivoContainer}>
                <Text style={[styles.informacoes, { color: COR_PRINCIPAL }]}>Meus Dispositivos</Text>

                <ScrollView 
                    style={styles.listaDispositivos}
                    contentContainerStyle={styles.listaDispositivosContent}
                    showsVerticalScrollIndicator={false}
                >
                    {Array.isArray(dispositivos) && dispositivos.length > 0 ? (
                        dispositivos.map((dispositivo) => (
                            <TouchableOpacity 
                                key={dispositivo.id}
                                style={[styles.botaoDispositivo, { backgroundColor: COR_DESTAQUE }]}
                                onPress={() => handleAbrirDispositivo(dispositivo)}
                            >
                                <Text style={[styles.nomeDispositivoText, { color: modoEscuro ? COR_PRINCIPAL : 'white' }]}>
                                    {dispositivo.nome || 'Dispositivo'}
                                </Text>
                            </TouchableOpacity>
                        ))
                    ) : null}
                </ScrollView>

                <TouchableOpacity 
                    style={[styles.botaoAdicionar, { backgroundColor: COR_DESTAQUE }]}
                    onPress={handleNavigateToCadastro}
                >
                    <Text style={styles.botaoText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50,
        backgroundColor: '#F4F4F9',
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
    dispositivoContainer: {
        flexDirection: 'column',   
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 30,
        flex: 1,
        width: '100%',
    },
    listaDispositivos: {
        maxHeight: 400,
        width: '100%',
    },
    listaDispositivosContent: {
        alignItems: 'center',
        paddingBottom: 10,
    },
    botaoDispositivo: {
        width: 150, 
        height: 65,
        backgroundColor: '#B8D8D9',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginBottom: 10,
    },
    botaoAdicionar: {
        width: 65, 
        height: 65,
        backgroundColor: '#B8D8D9',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    botaoText: {
        fontFamily: 'Kanit',
        color: 'white',
        fontSize: 40,
    },
    nomeDispositivoText: { 
        fontFamily: 'Kanit',
        color: 'white',
        fontSize: 18, 
        textAlign: 'center',
        paddingHorizontal: 5,
    },
    informacoes: {
        fontFamily: 'Kanit',
        fontSize: 30,
        marginBottom: 10, 
    },
});
