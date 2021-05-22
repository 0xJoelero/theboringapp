import React from 'react';
import {SafeAreaView, View, Text, TouchableOpacity} from 'react-native';

const ToDoScreen = ({toDo, _, styles, taskDone, completedTasks}) => {
  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.flex}>
        <Text style={{...styles.boringText, marginBottom: 20}}>todo list:</Text>
        {toDo.length !== 0 || completedTasks.length !== 0 ? (
          <View style={styles.flex}>
            {toDo?.map(a => (
              <TouchableOpacity onPress={() => taskDone(toDo.indexOf(a))}>
                <Text style={styles.helveticaBold}>⭕️ {a.todo}</Text>
              </TouchableOpacity>
            ))}
            <View
              style={{
                height: 1,
                backgroundColor: '#adadad',
                width: '100%',
                marginVertical: 20,
              }}
            />
            {completedTasks?.map(a => (
              <TouchableOpacity>
                <Text
                  style={{
                    ...styles.helveticaBold,
                    color: '#adadad',
                    textDecorationLine: 'line-through',
                  }}>
                  ✅ {a.todo}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.centeredHeader}>
            <Text style={styles.helveticaBold}>Come on do something :(</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ToDoScreen;
