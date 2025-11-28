import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, Text, View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useConfig } from '../context/ConfigContext'; 

export default function Cadastro() {
    const navigation = useNavigation();
    const { config } = useConfig();
    const { modoEscuro = true } = config || {};
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [fontsLoaded] = useFonts({
        'Kanit': require('../assets/fontes/Kanit-Regular.ttf'),
    });

    const COR_FUNDO = modoEscuro ? '#1C2E3A' : '#F4F4F9';
    const COR_PRINCIPAL = modoEscuro ? '#F4F4F9' : '#2F4550'; 
    const COR_DESTAQUE = modoEscuro ? '#586F7C' : '#B8D8D9'; 
    const COR_INPUT_FUNDO = modoEscuro ? '#395360' : '#f5f5f5'; 
    const COR_INPUT_BORDA = COR_DESTAQUE;
    const COR_INPUT_TEXTO = modoEscuro ? '#F4F4F9' : '#000000'; 
    const COR_PLACEHOLDER = modoEscuro ? 'rgba(244, 244, 249, 0.4)' : 'rgba(0, 0, 0, 0.22)';
    const COR_TEXTO_SECUNDARIO = modoEscuro ? '#B0C1C8' : 'rgba(0, 0, 0, 0.22)'; 
    const COR_LINK = COR_DESTAQUE; 

    if (!fontsLoaded) {
        return <Text style={{ color: COR_PRINCIPAL }}>Carregando fontes...</Text>;
    }

    const handleCadastroUsuario = async () => {
        if (!nome || !email || !senha) {
            Alert.alert('Atenção', 'Preencha todos os campos!');
            return;
        }

        const novoUsuario = { nome, email, senha };
        await AsyncStorage.setItem('usuario', JSON.stringify(novoUsuario));
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        navigation.navigate('Login');
    };

    const handleNavigateToLogin = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={[styles.container, { backgroundColor: COR_FUNDO }]}>
            <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={[styles.cadastrar, { color: COR_PRINCIPAL }]}>Cadastrar-se</Text>

            <TextInput
                placeholder='Nome:'
                placeholderTextColor={COR_PLACEHOLDER}
                style={[
                    styles.input, 
                    { 
                        backgroundColor: COR_INPUT_FUNDO, 
                        borderColor: COR_INPUT_BORDA,
                        color: COR_INPUT_TEXTO
                    }
                ]}
                onChangeText={setNome}
                value={nome}
            />
            <TextInput
                placeholder='Email:'
                placeholderTextColor={COR_PLACEHOLDER}
                style={[
                    styles.input, 
                    { 
                        backgroundColor: COR_INPUT_FUNDO, 
                        borderColor: COR_INPUT_BORDA,
                        color: COR_INPUT_TEXTO
                    }
                ]}
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                placeholder='Senha:'
                placeholderTextColor={COR_PLACEHOLDER}
                style={[
                    styles.input, 
                    { 
                        backgroundColor: COR_INPUT_FUNDO, 
                        borderColor: COR_INPUT_BORDA,
                        color: COR_INPUT_TEXTO
                    }
                ]}
                secureTextEntry
                onChangeText={setSenha}
                value={senha}
            />

            <TouchableOpacity 
                style={[styles.botao, { backgroundColor: COR_DESTAQUE }]}
                onPress={handleCadastroUsuario}
            >
                <Text style={styles.botaoText}>Cadastrar</Text>
            </TouchableOpacity>

            <View style={styles.jaTem}>
                <Text style={[styles.texto, { color: COR_TEXTO_SECUNDARIO }]}>Já tem conta?</Text>
                <TouchableOpacity onPress={handleNavigateToLogin}>
                    <Text style={[styles.entrar, { color: COR_LINK }]}>Entrar</Text>
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
        backgroundColor: '#F4F4F9'
    },
    logo: {
        width: 200,
        height: 200,
    },
    cadastrar: {
        fontFamily: 'Kanit',
        fontWeight: '400',
        fontSize: 20,
        marginTop: 20,
        marginBottom: 50,
    },
    input: {
        width: 307,
        borderColor: '#B8D8D9',
        borderWidth: 2,
        borderRadius: 16,
        marginBottom: 20,
        backgroundColor: '#f5f5f5ff',
        paddingLeft: 10,
        fontSize: 16
    },
    botao: {
        backgroundColor: '#B8D8D9',
        width: 307,
        height: 40,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    botaoText: {
        fontFamily: 'Kanit',
        fontSize: 15,
        color: 'white'
    },
    jaTem: {
        flexDirection: 'row',  
        justifyContent: 'center',
        marginTop: 20,
    },
    texto: {
        fontFamily: 'Kanit',
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.22)'
    },
    entrar: {
        fontFamily: 'Kanit',
        fontSize: 16,
        color: '#586F7C', 
        marginLeft: 5,
    }
});
