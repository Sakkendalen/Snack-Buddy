import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  AsyncStorage,
  Modal,
  TextInput,
} from 'react-native';
import Constants from 'expo-constants';
import { SnackItem } from '../components/SnackItem.js'

/**
 * Items screen to show items of selected category.
 * 
 * Items screen shows user all items in category and user can edit and delete those objects,
 * show total cost of selected category
 */
export default class ItemsScreens extends React.Component {

  /**
   * Constructor.
   * 
   * state contains information of items that is in this category and should modal that allows
   * user to edit items to be shown.
   * 
   * @param props properties of Class
   */
  constructor(props){
    super(props)
    this.state = {
      items: this._itemsOfthisCateg(),
      modalVisible: false,
    }
  }

  /**
   * LifeCycle Function.
   * When component mounts call _itemsOfthisCateg() to define items of this category and get category name from
   * navigation.
   */
  componentDidMount(){
    this.setState({items: this._itemsOfthisCateg(), category: this.props.navigation.getParam('category', 'no data')})
  }

  /**
   * navigationOptions to define header bar title.
   * 
   * Shows user name of this category and total cost of this category items.
   * Fetches information from navigation.
   */
  static navigationOptions = ({ navigation }) => {
        return {
          title: navigation.getParam('category', 'no data') + ' ' + navigation.getParam('cost', '') + '€'
        };
  };

  /**
   * Function to define objects that should be showed to user.
   * 
   * Gets all items from navigaion and goes through them and if item category is same as 
   * this category pushes it to array that is returned and same time sums up those items costs
   * and sets total to navigation parameters.
   * 
   * @returns Array of items that should be shown.
   */
  _itemsOfthisCateg = () => {
    const { navigation } = this.props;
    let all = navigation.getParam('data', 'not found')
    let correctCateg = []
    let totalCost = 0

    //go thorugh all items and add item to array that should be shown.
    for(let item of all){
      if(item.categ == navigation.getParam('category', 'no data')){
        correctCateg.push(item)
        totalCost += parseFloat(item.cost.replace(",", "."))
      }
    }

    navigation.setParams({ cost: totalCost })

    return correctCateg

  }

  /**
   * Function to delete item from AsyncStorage.
   * 
   * Function deletes item from AsyncStorage and updates state of showed items and totalcost of this category.
   * 
   * @param key key of item that should be deleted.
   */
  _deleteItem =  async (key) => {
    const { navigation } = this.props;
    let totalCost = parseFloat(navigation.getParam('cost', ''))

    let items = this.state.items
    let notDeletedItems = []
    //remove item from AsyncStorage and set not deleted items to new array that is setted to this state.
    try {
      await AsyncStorage.removeItem(key);
      for(let item of items){
        if (item.key !== key){
          notDeletedItems.push(item)
        }
        else {
          totalCost -= parseFloat(item.cost.replace(",", "."))
        }
      }
      this.setState({items: notDeletedItems})
    }
    catch(error) {
      console.log(error)
    }
    navigation.setParams({ cost: totalCost })
  }

  /**
   * Function to show modal of 1 item that user want to edit.
   * 
   * Function fetches all object from asyncStorage and sets it variables to state that allows
   * user to edit them.
   * 
   * @param key of item to be altered
   * @param visible boolean of should modal be shown to user
   */
  _showItemdata =  async (key, visible) => {
    let item = JSON.parse(await AsyncStorage.getItem(""+key))
    this.setState({snackName: item.name, SnackCost: item.cost, snackKey: key, snackCat: item.categ })
    this.setState({modalVisible: visible});
  }

  /**
   * Function to save altered item to AsyncStorage
   * 
   * Function creates new SnackItem that is saved to AsyncStorage to overWrite item that user
   * wants to edit.
   * 
   * @param key of item to be altered
   */
  _alterItemData = async (key) => {

    var objToSave = new SnackItem(this.state.snackName, this.state.SnackCost, this.state.snackCat, this.state.snackKey)

    await AsyncStorage.setItem(''+this.state.snackKey, JSON.stringify(objToSave))
    this.setState({modalVisible: false});
  }

  /**
   * Unused function to generate items to List Element
   * 
   * @param title of item 
   */
  Item({ title }) {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  }

  /**
   * Unused function to get cost of this category
   */
  _getTotalCost = () => {

    return this.state.cost
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}>
          <View style={styles.modalcont}>
            <Text style={styles.buttonText}>Item:</Text>
            <TextInput ref={input => { this.nameinput = input }} 
            value={this.state.snackName}
            onChangeText={(snackName) => this.setState({snackName})}
            style={styles.input}/>

            <Text style={styles.buttonText}>Cost:</Text>
            <TextInput ref={input => { this.costinput = input }}
            value={this.state.SnackCost}
            keyboardType='decimal-pad'
            onChangeText={(SnackCost) => this.setState({SnackCost})}
            style={styles.input}/>

            <TouchableOpacity
              onPress={() => this._alterItemData()}
              style={styles.modalBtn}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.setState({modalVisible: !this.state.modalVisible});
              }} 
              style={styles.modalBtn}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <ScrollView>
          {this.state.items.map((item, index) => {
            return (
                <View key={index} style={styles.listcont}>
                  <View style={styles.listRow}>
                  <Text style={{flex: 1, fontSize: 20, color: 'black'}}>Item: {item.name}</Text>
                  <TouchableOpacity onPress={() => this._showItemdata(item.key, true)} style={styles.Btn}>
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  </View>

                  <View style={styles.listRow}>
                  <Text style={{flex: 1, fontSize: 20, color: 'black'}}>Cost: {item.cost}</Text>
                  <TouchableOpacity onPress={() => this._deleteItem(item.key)} style={styles.Btn}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                  </View>
                </View>
            )
          })}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    marginHorizontal: 16,
  },
  listcont: {
    flex: 1,
    flexDirection: 'column',
    height: 75, 
    margin: 5,
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: '#ededed',
  },
  listRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'center',
  },
  modalcont: {
    flex: 1,
    flexDirection: 'column',
    margin: 5,
    alignItems:'center',
    justifyContent: 'center',
  },
  modalBtn: {
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
  buttonText: {
    fontSize: 20,
    color: 'black',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  Btn: {
    flex: 1,
    alignItems:'center',
    justifyContent: 'center',
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    backgroundColor: '#ccccff',
    margin: 5,
    width: 100
  },
  header: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
  },
});