/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Button,
    ActivityIndicator,
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {getBoringApi} from './src/api/index.js';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
function HomeScreen(
    helveticaBold,
    boringData,
    setBoringData,
    isLoading,
    setLoading,
    getApi,
    sendToToDoList,
) {
    return (
        <SafeAreaView style={styles.flex}>
            <View style={styles.halfTopContainer}>
                <View style={styles.flex}>
                    <Text style={helveticaBold}>The Boring App</Text>
                    {isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <Text style={styles.boringText}>
                            {boringData.activity}
                        </Text>
                    )}
                </View>
                <View style={styles.buttonContainer}>
                    <Button onPress={() => getApi()} title="❌" />
                    <Button onPress={() => sendToToDoList()} title="✅" />
                </View>
            </View>
        </SafeAreaView>
    );
}

function ToDoScreen() {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Settings!</Text>
        </View>
    );
}
const Tab = createBottomTabNavigator();

const App: () => Node = () => {
    const [boringData, setBoringData] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const [toDo, setToDo] = useState({});
    const helveticaBold = {
        fontFamily: 'Helvetica-Bold',
        fontSize: 18,
        textAlign: 'left',
    };

    const getApi = () =>
        getBoringApi()
            .then(r => setBoringData(r))
            .catch(error => console.error(error))
            .finally(() => setLoading(false));

    useEffect(() => {
        getApi();
    }, []);
    const sendToToDoList = () => {};
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({route}) => ({
                    tabBarIcon: ({focused}) => {
                        let iconName;
                        let fontStyle;
                        let fontSize;
                        let fontColor;
                        let unFocusColor = 'rgba(255, 255, 255, 0.5)';

                        let focusSetting = () => {
                            fontStyle = focused
                                ? 'Helvetica-Bold'
                                : 'Helvetica';
                            fontColor = focused ? 'white' : unFocusColor;
                            fontSize = focused ? 18 : 17;
                        };

                        if (route.name === 'boringScreen') {
                            iconName = 'Boring';
                            focusSetting();
                        } else if (route.name === 'toDoScreen') {
                            iconName = 'To Do';
                            focusSetting();
                        }
                        return (
                            <Text
                                style={{
                                    fontFamily: fontStyle,
                                    fontSize: fontSize,
                                    color: fontColor,
                                    textAlign: 'center',
                                }}>
                                {iconName}
                            </Text>
                        );
                    },
                })}
                tabBarOptions={{
                    activeTintColor: 'white',
                    tabStyle: {
                        maxWidth: '100%',
                    },
                    style: {
                        alignItems: 'center',
                        paddingRight: '5%',
                        backgroundColor: 'black',
                        borderTopColor: 'rgba(255, 255, 255, 0.35)',
                        borderTopWidth: 0.5,
                    },
                    showLabel: false,
                }}>
                <Tab.Screen
                    labelStyle={{fontSize: 20, color: 'red'}}
                    name="boringScreen"
                    component={() =>
                        HomeScreen(
                            helveticaBold,
                            boringData,
                            setBoringData,
                            isLoading,
                            setLoading,
                            getApi,
                            sendToToDoList,
                        )
                    }
                />
                <Tab.Screen name="toDoScreen" component={ToDoScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    flex: {flex: 1},
    halfTopContainer: {flex: 1, paddingHorizontal: 20},
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'row',
        backgroundColor: '#e1e1e1',
        padding: 10,
        borderRadius: 100,
        marginBottom: 10,
    },
    boringText: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 40,
    },
});

export default App;
