import React from 'react';
import {
  StyleSheet, 
  View, 
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  AsyncStorage
} from 'react-native';

import Constants from 'expo-constants';
import { NavigationEvents } from 'react-navigation';

export default class CategoryScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      categories: []

    }
  }

  async componentDidMount(){
    let items = JSON.parse(await AsyncStorage.getItem('categories'))
    this.setState({ categories: items})
  }

  async componentDidUpdate() {
    if(this.state.update){
      let items = JSON.parse(await AsyncStorage.getItem('categories'))
      this.setState({update: false, categories: items})
    }
  }

  _deleteClick = (item) => {
    Alert.alert(
      'You are deleting category!',
      'Category items will still stay. Are you sure?',
      [
        {text: 'Yes', onPress: () => this._deleteCategory(item)},
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  }

  _deleteCategory = async (item) => {

    let newList = this.state.categories

    var index = newList.indexOf(item);
    if (index >= 0) {
      newList.splice(index, 1);
      if (index == 0){
        Alert.alert(
          'You have deleted all categories!',
          'Remember to add more!',
          [
            {
              text: 'Ok',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
          ],
          {cancelable: true},
        );
      }
    }

    this.setState({categories: newList})


    try {

      await AsyncStorage.setItem('categories', JSON.stringify(newList))

      this.nameinput.clear()

    } catch (error) {
      console.log('error loading')
      console.log(error)
    }

  }

  _addCategory = async (name) => {
    if(name == undefined ||  name == "" ){
      Alert.alert(
        'More Information needed',
        'Please check input boxes',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
    }else{
      try {
        let newList = this.state.categories
        newList.push(name)
        await AsyncStorage.setItem('categories', JSON.stringify(newList))
        this.setState({categories: newList})
        this.nameinput.clear()
    } catch (error) {
      console.log('error loading')
      console.log(error)
    }
    }
  }

  render(){
    return (
      <View style={styles.container}>
      <NavigationEvents
        onDidFocus={() => this.setState({ update: this.props.navigation.getParam('data', true) })}
      />

      <View style={styles.listArea}>
        <ScrollView>
          {this.state.categories.map((item, index) => {
            return (
                <View key={index} style={styles.listcont}>
                  <Text style={{flex: 1, fontSize: 15, color: 'black', fontWeight: 'bold'}}>Category: {item}</Text>

                  <TouchableOpacity onPress={() => this._deleteClick(item)} style={styles.listBtn}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
            )
          })}
        </ScrollView>
        </View>

        <View style={styles.addArea}>
          <Text style={styles.buttonText}>New Category</Text>
          <TextInput ref={input => { this.nameinput = input }} 
          onChangeText={(newCategory) => this.setState({newCategory})}
          style={styles.input}/>

          <TouchableOpacity onPress={() => this._addCategory(this.state.newCategory)} style={styles.addBtn}>
          <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>

        </View>

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
    marginTop: Constants.statusBarHeight,
    marginHorizontal: 16,
  },
  listArea: {
    flex: 3,
  },
  addArea: {
    flex: 1,
    flexDirection: 'column',
    alignItems:'center',
    justifyContent: 'center',
  },
  listcont: {
    flex: 1,
    flexDirection: 'row',
    height: 50, 
    marginTop: 5,
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: '#ededed',
  },
  listBtn: {
    flex: 1,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    backgroundColor: '#ccccff',
    margin: 5,
    width: 100
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#ededed',
    height: 40,
    width: 200
  },
  addBtn: {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#ccccff',
    marginHorizontal: 10,
    marginVertical: 10,
    width: 100
  },
  Btn: {
    flex: 1, 
    alignSelf: 'flex-end',
    alignItems:'center',
    justifyContent: 'center',
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    backgroundColor: '#ccccff',
    margin: 5,
    width: 100
  },
  buttonText: {
    fontSize: 20,
    color: 'black',
  },
});
