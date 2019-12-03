import React from 'react';
import {StyleSheet, View, Text } from 'react-native';

export default class CategoryScreen extends React.Component {

  constructor(props){
    super(props);
  }

  render(){
    return (
      <View style={styles.container}>
        <Text>Tänne kategoriat</Text>
      </View>
    );
  }
}

CategoryScreen.navigationOptions = {
  title: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
