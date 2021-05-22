/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

//TODO: - add 'undo' toast with button, for undo delete ToDos
//TODO: - add longpress to delete ToDos
//TODO: - add toast with message 'completed task'

import React, {useEffect, useState, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
} from 'react-native';

import {getBoringApi} from './src/api/index.js';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import storage from './src/storage.js';
import ToDoScreen from './src/screens/todo';

const HomeScreen = ({boringData, isLoading, getApi, sendToToDoList}) => {
  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.halfTopContainer}>
        <View style={styles.flex}>
          <Text style={styles.helveticaBold}>The Boring App</Text>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.boringText}>{boringData.activity}</Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={() => getApi()} title="Nope ❌" />
          <Button onPress={() => sendToToDoList()} title="Perhaps ✅" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const Tab = createBottomTabNavigator();

const App = () => {
  const [boringData, setBoringData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [loadedToDoList, setLoadedToDoList] = useState([]);
  const [toDo, setToDo] = useState(loadedToDoList);
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [completedTasks, setCompletedTasks] = useState([]);

  const taskDone = task => {
    let a = toDo;
    let b = completedTasks;
    console.log(`a without deleting`, a);
    b.push(a[task]);
    setCompletedTasks(b);
    a.splice(task, 1);
    console.log('a with deleting', a);
    setToDo(a);
    forceUpdate();
  };

  const getApi = () =>
    getBoringApi()
      .then(r => setBoringData(r))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));

  useEffect(() => {
    getApi();
    storage
      .load({
        key: 'activity',
        autoSync: true,
        syncInBackground: true,
        syncParams: {
          extraFetchOptions: {},
          someFlag: true,
        },
      })
      .then(ret => {
        console.log('ret', ret);
        setLoadedToDoList(ret);
      })
      .catch(err => {
        console.warn(err.message);
        switch (err.name) {
          case 'NotFoundError':
            // TODO;
            break;
          case 'ExpiredError':
            // TODO
            break;
        }
      });
  }, []);
  const sendToToDoList = () => {
    let a = toDo;
    a.push({todo: boringData.activity, done: false});
    setToDo(a);
    storage.save({
      key: 'activity',
      data: toDo,
    });
    getApi();
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused}) => {
            let iconName;
            let fontStyle;
            let fontSize;
            let fontColor;
            let unFocusColor = 'rgba(0, 0, 0, 0.5)';

            let focusSetting = () => {
              fontStyle = focused ? 'Helvetica-Bold' : 'Helvetica';
              fontColor = focused ? 'black' : unFocusColor;
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
          activeTintColor: 'black',
          tabStyle: {
            maxWidth: '100%',
          },
          style: {
            alignItems: 'center',
            paddingRight: '5%',
            backgroundColor: 'white',
            borderTopColor: 'rgba(255, 255, 255, 0.35)',
            borderTopWidth: 0.5,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
          showLabel: false,
        }}>
        <Tab.Screen
          labelStyle={{fontSize: 20, color: 'red'}}
          name="boringScreen">
          {props => (
            <HomeScreen
              {...props}
              boringData={boringData}
              setBoringData={setBoringData}
              isLoading={isLoading}
              setLoading={setLoading}
              getApi={getApi}
              sendToToDoList={sendToToDoList}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="toDoScreen">
          {props => (
            <ToDoScreen
              {...props}
              toDo={toDo}
              isLoading={isLoading}
              styles={styles}
              taskDone={taskDone}
              completedTasks={completedTasks}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1, backgroundColor: 'white', paddingHorizontal: 20},
  halfTopContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
  },
  boringText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 40,
  },
  helveticaBold: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 18,
    textAlign: 'left',
  },
  centeredHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

export default App;
