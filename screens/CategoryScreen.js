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

/**
 * Category-tab view. 
 * Category-tab shows user categories where user can save objects and user can
 * delete them or add more.
 */
export default class CategoryScreen extends React.Component {

  /**
   * Constructor.
   * 
   * State categories to save defined categories in AsyncStorage.
   * 
   * @param props properties of Class
   */
  constructor(props){
    super(props);
    this.state = {
      categories: []

    }
  }

  /**
   * LifeCycle Function.
   * When component mounts fetch all categories from AsyncStorage and set them to state.
   */
  async componentDidMount(){
    let items = JSON.parse(await AsyncStorage.getItem('categories'))
    this.setState({ categories: items})
  }

  /**
   * LifeCycle Function.
   * If view should update itself fetch all categories from AsyncStorage and set them to state and
   * update state to false.
   */
  async componentDidUpdate() {
    if(this.state.update){
      let items = JSON.parse(await AsyncStorage.getItem('categories'))
      this.setState({update: false, categories: items})
    }
  }

  /**
   * Function to ensure that user wants to delete category from AsyncStorage.
   * Displays Alert to user to ask is user sure to deleting Category from AsyncStorage
   * calls _deleteCategory() function if user is wants to delete category from AsyncStorage.
   */
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

  /**
   * Function to delete category from AsyncStorage
   * 
   * Function gets all categories from state and removes selected category from array, 
   * then saves that array to state and to Asyncstorage.
   * 
   * @param item name of category to be deleted
   */
  _deleteCategory = async (item) => {

    //get all gatecories and remove selected item from there
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


    //save new array that doesn't contain deleted category to AsyncStorage
    try {

      await AsyncStorage.setItem('categories', JSON.stringify(newList))

      this.nameinput.clear()

    } catch (error) {
      console.log('error loading')
      console.log(error)
    }

  }

  /**
   * Function to save category to AsyncStorage
   * 
   * Function gets all categories from state and save new category from array, 
   * then saves that array to state and to Asyncstorage.
   * 
   * @param item name of category to be saved
   */
  _addCategory = async (name) => {

    //check user input
    if(name == undefined ||  name == "" ){
      Alert.alert(
        'More Information needed',
        'Please check input boxes',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
    }
    //get gategories from state and add new category then save it to state and AsynStorage
    else{
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
