import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  TextInput,
  Picker,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
  Alert,
} from 'react-native';

import { SnackItem } from '../components/SnackItem.js';
import { NavigationEvents } from 'react-navigation';

/**
 * Add-tab view. 
 * Add-tab uses AsyncStorage and saves SnackItem.js objects to it.
 */
export default class AddScreen extends React.Component {

  /**
   * Constructor.
   * Unused states: KeysRounded, fetchedItems.
   * State holds what was latest key to save object in AsyncStorage, all keys, 
   * Caterogy of snack where object should be saved, is user launching app first time and 
   * should view update itself.
   * 
   * @param props properties of Class
   */
  constructor(props){
    super(props);
    this.state = {
      lastKey: 0,
      keysRounded: false,
      keys: [],
      fetchedItems: [],
      SnackCat: "Chips",
      categories: [],
      firstLaunch: null,
      update: false
    }
  }

  /**
   * Function to get all gategories from AsyncStorage and set those into State.
   */
  _getCategories = async () => {
    let fetchCategories = JSON.parse(await AsyncStorage.getItem('categories'))

    this.setState({categories: fetchCategories});
  }

  /**
   * Function to initialize Gategories to AsyncStorage to state 
   * if user is launching app first time.
   */
  _setCategories = async () => {
    let setupCategories = ["Chips", "Sweets", "Nuts"]
    await AsyncStorage.setItem('categories', JSON.stringify(setupCategories))
    this.setState({categories: setupCategories});
  }

  /**
   * LifeCycle Function.
   * When Components mounts it checks is this first launch and should it get categories or initialize them,
   * after that get's all keys from AsyncStorage and excludes first launch and gategories keys to check what
   * should be next Key to object that is used to save object. 
   */
  async componentDidMount(){

    // Check is this first launch
    try{
      AsyncStorage.getItem("alreadyLaunched").then(value => {
        if(value == null){
          AsyncStorage.setItem('alreadyLaunched', JSON.stringify(true))
          this.setState({firstLaunch: true});
          this._setCategories()
        }
        else{
            this._getCategories()
            this.setState({firstLaunch: false});
        }})
    } catch (error) {
      console.log('error mounting')
      console.log(error)
    }

    //Get all keys and decide what should be next key to save object to asyncStorage
    //Exclude categories and first launch key out of it and call _getCategories
    //unction to update categories Picker.
    try{

      const checkkeys =  await AsyncStorage.getAllKeys()

      var index = checkkeys.indexOf("categories");
      if (index > -1) {
        checkkeys.splice(index, 1);
      }

      var index2 = checkkeys.indexOf("alreadyLaunched");
      if (index2 > -1) {
        checkkeys.splice(index2, 1);
      }


      if(checkkeys[checkkeys.length-1] == 'undefined'){
        this.setState({keys: checkkeys, lastKey: 0})
      }
      else{
        this.setState({keys: checkkeys, lastKey: checkkeys.length})
      }

      this._getCategories()

    } catch (error) {
      console.log('error mounting')
      console.log(error)
    }
  }

  /**
   * LifeCycle Function.
   * If view should update itself check and decide next key to object and call _getCategories
   * function to update categories Picker.
   */
  async componentDidUpdate() {

    if(this.state.update){

      //Get all keys and decide what should be next key to save object to asyncStorage
      //Exclude categories and first launch key out of it and call _getCategories
      //unction to update categories Picker.
      try{
        this.setState({update: false})
        const checkkeys =  await AsyncStorage.getAllKeys()
        var index = checkkeys.indexOf("categories");
        if (index > -1) {
          checkkeys.splice(index, 1);
        }

        var index2 = checkkeys.indexOf("alreadyLaunched");
        if (index2 > -1) {
          checkkeys.splice(index, 1);
        }
        if(checkkeys[checkkeys.length-1] == 'undefined'){
          this.setState({keys: checkkeys, lastKey: 0})
        }
        else{
          this.setState({keys: checkkeys, lastKey: checkkeys.length, SnackCat: this.state.categories[0]})
        }
        
        this._getCategories()

      } catch (error) {
        console.log('error mounting')
        console.log(error)
      }
    }
  }

  /**
   * Function to save object to AsyncStorage.
   * 
   * Checks that user have given input to TextInputs and saves object to AsyncStorage
   * and increases state lastKey by one that is used to next object. Clears TextInputs
   * and sets state where they refer to empty string.
   * 
   * @param name name of object that should be saved 
   * @param cost cost of object that should be saved 
   * @param cat category of object that should be saved 
   */
  _storeData = async (name, cost, cat) => {

    //Chekc does user have given input if not -> Alert
    if(name == undefined || cost == undefined || cat == undefined || name == "" || cost == "" || cat == ""){
      Alert.alert(
        'More Information needed',
        'Please check input boxes',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
    }
    //else save object.
    else{
      try {
        if(this.state.lastKey == 0){
  
          var objToSave = new SnackItem(name, cost, cat, 'Key'+this.state.lastKey)
  
          await AsyncStorage.setItem('Key'+this.state.lastKey, JSON.stringify(objToSave))
          this.setState({lastKey: this.state.lastKey+1})
          this.props.navigation.navigate('View', { update: true })
        }
        else{
  
          var objToSave = new SnackItem(name, cost, cat, 'Key'+this.state.lastKey)
  
          await AsyncStorage.setItem('Key'+this.state.lastKey, JSON.stringify(objToSave))
          this.setState({lastKey: this.state.lastKey+1})
          this.props.navigation.navigate('View', { update: true })
        }
        this.nameinput.clear()
        this.costinput.clear()
        this.setState({snackName: "", SnackCost: "", SnackCat: this.state.categories[0]})
        
      } catch (error) {
        console.log('error saving')
        console.log(error)
      }
    }
  }

  /**
   * Debug Function to check all keys and last key of AsyncStorage.
   * 
   * Not Used.
   */
  _checkKeys = async () => {

    try{
      const checkkeys =  await AsyncStorage.getAllKeys()
      console.log(checkkeys)
      console.log(checkkeys[checkkeys.length-1])
    } catch (error) {
      console.log('error mounting')
      console.log(error)
    }
  }

  render(){

    //Generate items to Picker Element from state Category
    let pickerItems = this.state.categories.map( (s, i) => {
      return <Picker.Item key={i} value={s} label={s} />
    });

    return (
      <View style={styles.container}>
        <NavigationEvents
        onDidFocus={() => this.setState({ update: this.props.navigation.getParam('data', true) })}
      />
      { }

        <Text style={styles.buttonText}>Snack Name:</Text>
        <TextInput ref={input => { this.nameinput = input }} 
        onChangeText={(snackName) => this.setState({snackName})}
        style={styles.input}/>

        <Text style={styles.buttonText}>Snack Cost:</Text>
        <TextInput ref={input => { this.costinput = input }}
        keyboardType='decimal-pad'
        onChangeText={(SnackCost) => this.setState({SnackCost})}
        style={styles.input}/>

        <Text style={styles.buttonText}>Snack Category:</Text>
        <Picker
          selectedValue={this.state.SnackCat}
          style={styles.input}
          onValueChange={(SnackCat) => this.setState({SnackCat})}>
          {pickerItems}
        </Picker>

        <TouchableOpacity onPress={() => this._storeData(this.state.snackName, this.state.SnackCost, this.state.SnackCat)} style={styles.Btn}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

      </View>

      
    );
  }
}

AddScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Btn: {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#ccccff',
    marginHorizontal: 10,
    marginVertical: 10,
    width: 100
  },
  buttonText: {
    fontSize: 20,
    color: 'black',
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#ededed',
    height: 40,
    width: 200
  },
});