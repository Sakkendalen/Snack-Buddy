import React from "react";
import { 
  StyleSheet, 
  View, 
  TouchableOpacity,
  Text,
  AsyncStorage,
  Alert
} from 'react-native';
//import AddScreen from './AddScreen';
import itemsScreen from './ItemsScreens'
import { VictoryPie } from 'victory-native';
import { Svg } from 'react-native-svg'
import { NavigationEvents } from 'react-navigation';

/**
 * View-tab view. 
 * View-tab uses VictoryPie to show user pie chart of saved objects in AsyncStorage.
 */
export default class ViewScreen extends React.Component {

  /**
   * Constructor.
   * Unused states: KeysRounded
   * State holds what was latest key to save object in AsyncStorage, all keys, 
   * all items, cost of every category and
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
      CostsbyCateg: [],
      update: false
    }
    this.eleContainsInArray = this.eleContainsInArray.bind(this);
  }

  /**
   * LifeCycle Function.
   * When component mounts call _retrieveData function to get object from AsyncStorage.
   */
  async componentDidMount(){
    this._retrieveData();
  }

  /**
   * LifeCycle Function.
   * If view should update itself call _retrieveData function to get object from AsyncStorage and set 
   * update state to false.
   */
  componentDidUpdate() {
    if(this.state.update){
      this._retrieveData();
      this.setState({update: false})
    }
  }

  /**
   * Function to Fetch object from AsyncStorage.
   * Function fecthes Saved objects from AsyncStorage and initializes categories and 
   * cost of every categories to VictoryPie.
   */
  _retrieveData = async () => {
    try {

      //Get all keys from Async Storage and Exclude categories and firstlaunch.
      const keyvalues = await AsyncStorage.getAllKeys()

      var index = keyvalues.indexOf("categories");
      if (index > -1) {
        keyvalues.splice(index, 1);
      }

      var index2 = keyvalues.indexOf("alreadyLaunched");
      if (index2 > -1) {
        keyvalues.splice(index2, 1);
      }


      let items = []
      let categAdded = []
      let categoryCosts= []
      let categories = 0
      let totalcost = 0

      //get items from asyncstorage and save them to items array
      for(var key of keyvalues){
        const item = JSON.parse(await AsyncStorage.getItem(''+key))
        items.push(item)
      }

      //Go through items and add categories and sum up total cost
      for(var item of items){
        if(!this.eleContainsInArray(categAdded,item.categ)){
          categAdded.push(item.categ)
          categories++
        }
        totalcost += parseFloat(item.cost)
      }

      //go through categories and items and sum up category total cost by percentage
      for(let a = 0; a < categories; a++){

        let categcost = 0

        for(var item of items){
          if(item.categ == categAdded[a]){
            categcost += parseInt(item.cost) 
          }
        }
        categoryCosts.push({x: categAdded[a], y: Math.round(categcost/totalcost*100)})
      }
    
      this.setState({CostsbyCateg: categoryCosts})
      this.setState({fetchedItems: items})


    } catch (error) {
      console.log('error loading')
      console.log(error)
    }
  }

  /**
   * Function to check is element in array.
   * 
   * @param arr array to go through
   * @param element element to check
   * 
   * @returns boolean. True if element is in array if not then false.
   */
  eleContainsInArray(arr,element){
    if(arr != null && arr.length >0){
        for(var i=0;i<arr.length;i++){
            if(arr[i] == element)
                return true;
        }
    }
    return false;
  }

  /**
   * Function to ensure that user wants to clear all items from AsyncStorage.
   * Displays Alert to user to ask is user sure to delete all items in AsyncStorage
   * calls _clearData() function if user is wants to clear AsyncStorage.
   */
  _clearClicked = () => {
    Alert.alert(
      'You are clearing all data!',
      'Do you really want to clear all data?',
      [
        {text: 'Yes', onPress: () => this._clearData()},
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
   * Function to delete all snacks in AsyncStorage.
   * Function gets all keys from AsyncStorage and only includes snack keys
   * to multiremove them from AsyncStorage
   */
  _clearData = async () => {

    try {
      //get all keys
      let keys = await AsyncStorage.getAllKeys()

      //exclude categories and alreadylaunched
      var index = keys.indexOf("categories");
      if (index > -1) {
        keys.splice(index, 1);
      }

      var index2 = keys.indexOf("alreadyLaunched");
      if (index2 > -1) {
        keys.splice(index, 1);
      }

      //multiremove snacks from AsyncStorage and reset states to empty/0.
      await AsyncStorage.multiRemove(keys)
      this.props.navigation.navigate('Add', { update: true })
      this.setState({lastKey: 0, keysRounded: false, fetchedItems: []})
      this._retrieveData();
    } catch (error) {
      console.log('error loading')
      console.log(error)
    }
  }

  /**
   * Unused function to get costs of Categories
   */
  _getSeries = () => {
    return this.state.CostsbyCateg
  }

  /**
   * Function to open ItemsScreen.
   * 
   * Opens ItemsScreen.js view and passes category and all objects to it.
   * 
   * @param catName name of category
   * @param items all snack items
   */
  _openItemsCategory = (catName, items) => {
    this.props.navigation.navigate('Items', {
      category: catName,
      data: items,
      })
  }

  render(){
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <NavigationEvents
        onDidFocus={() => this.setState({ update: this.props.navigation.getParam('data', true) })}
      />
      {
        <View style={styles.PieArea}>
          <Svg>
            <VictoryPie
              data={this.state.CostsbyCateg}
              width={300}
              events={[{
                target: "data",
                eventHandlers: {
                  onPressIn: () => {
                    return [ 
                      {
                        target: "labels",
                        mutation: ({ text }) => this._openItemsCategory(text, this.state.fetchedItems)
                        }
                    ];
                  }
                }
              }]}
            />
          </Svg>
        </View>
      }

        <View style={styles.Btnarea}>

          <TouchableOpacity onPress={() => this._clearClicked()} style={styles.Btn}>
          <Text style={styles.buttonText}>Delete All</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }
}

ViewScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Btnarea:{
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
  PieArea:{
    flex:1,
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listcont: {
    flex: 1,
    flexDirection: 'column',
    height: 50, 
    margin: 5,
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
  },
});