import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ConfigProvider, useConfig } from './context/ConfigContext';

import CadastroDispositivo from './screens/CadastrarDispositivo';
import Cadastro from './screens/Cadastro';
import Login from './screens/Login';
import Dispositivo from './screens/Dispositivo';
import Configuracoes from './screens/Configuracoes';
import TelaInicial from './screens/TelaInicial';
import LoadingScreen from './screens/LoadingScreen'; 
import ConfiguracaoInicial from './screens/ConfiguracaoInicial';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function LogoutScreen({ navigation }) {
    const { config } = useConfig();
    const { modoEscuro } = config;
    const COR_PRINCIPAL = modoEscuro ? '#F4F4F9' : '#2F4550';

    React.useEffect(() => {
        navigation.replace('Login');
    }, [navigation]);

    return (
        <View style={styles.center}>
            <Text style={{ fontSize: 18, color: COR_PRINCIPAL }}>Saindo da conta...</Text>
        </View>
    );
}

const getDrawerScreenOptions = (modoEscuro) => {
    const COR_PRINCIPAL = modoEscuro ? '#F4F4F9' : '#2F4550';
    const COR_DESTAQUE = modoEscuro ? '#586F7C' : '#B8D8D9';
    const COR_FUNDO = modoEscuro ? '#2F4550' : '#F4F4F9';

    return {
        headerShown: false,
        drawerActiveBackgroundColor: modoEscuro ? '#395360' : COR_DESTAQUE,
        drawerActiveTintColor: modoEscuro ? '#F4F4F9' : 'white',
        drawerInactiveTintColor: COR_PRINCIPAL,
        drawerContentStyle: { backgroundColor: COR_FUNDO },
        drawerLabelStyle: { fontFamily: 'Kanit', fontSize: 16 },
    };
};

function DrawerTelaInicial() {
    const { config } = useConfig();
    const { modoEscuro } = config;

    return (
        <Drawer.Navigator initialRouteName="TelaInicial" screenOptions={getDrawerScreenOptions(modoEscuro)}>
            <Drawer.Screen name="TelaInicial" component={TelaInicial} options={{ title: 'Tela Inicial' }} />
            <Drawer.Screen name="Configurações" component={ConfiguracaoInicial} options={{ title: 'Configurações'}} />
            <Drawer.Screen name="Sair" component={LogoutScreen} options={{ title: 'Sair' }} />
        </Drawer.Navigator>
    );
}

function DrawerDispositivo() {
    const { config } = useConfig();
    const { modoEscuro } = config;

    return (
        <Drawer.Navigator initialRouteName="Dispositivo" screenOptions={getDrawerScreenOptions(modoEscuro)}>
            <Drawer.Screen name="Dispositivo" component={Dispositivo} options={{ title: 'Dispositivo' }} />
            <Drawer.Screen name="TelaInicial" component={TelaInicial} options={{ title: 'Tela Inicial' }} />
            <Drawer.Screen name="Configurações" component={Configuracoes} options={{ title: 'Configurações' }} />
            <Drawer.Screen name="Sair" component={LogoutScreen} options={{ title: 'Sair' }} />
        </Drawer.Navigator>
    );
}

export default function App() {
    return (
        <ConfigProvider>
            <NavigationContainer>
                <StatusBar style="auto" />
               <Stack.Navigator initialRouteName="Loading" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Loading" component={LoadingScreen} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Cadastro" component={Cadastro} />
                <Stack.Screen name="CadastroDispositivo" component={CadastroDispositivo} />
                <Stack.Screen name="Main" component={DrawerTelaInicial} />
                <Stack.Screen name="MainDispositivo" component={DrawerDispositivo} />
            </Stack.Navigator>
            </NavigationContainer>
        </ConfigProvider>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
