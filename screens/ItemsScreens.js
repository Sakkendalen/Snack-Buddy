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

export default class ItemsScreens extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      items: this._itemsOfthisCateg(),
      modalVisible: false,
    }
  }

  componentDidMount(){
    this.setState({items: this._itemsOfthisCateg()})
  }

  static navigationOptions = ({ navigation }) => {
        return {
          title: navigation.getParam('category', 'no data')
        };
  };

  _itemsOfthisCateg = () => {
    const { navigation } = this.props;
    let all = navigation.getParam('data', 'not found')
    let correctCateg = []

    for(let item of all){
      if(item.categ == navigation.getParam('category', 'no data')){
        correctCateg.push(item)
      }
    }
    console.log(correctCateg)
    return correctCateg

  }

  _deleteItem =  async (key) => {
    let items = this.state.items
    let notDeletedItems = []
    console.log(key)
    try {
      await AsyncStorage.removeItem(key);
      for(let item of items){
        if (item.key !== key){
          notDeletedItems.push(item)
        }
      }
      this.setState({items: notDeletedItems})
    }
    catch(error) {
      console.log(error)
    }
  }

  _showItemdata =  async (key, visible) => {
    let item = JSON.parse(await AsyncStorage.getItem(""+key))
    this.setState({snackName: item.name, SnackCost: item.cost, snackKey: key, snackCat: item.categ })
    this.setState({modalVisible: visible});
    console.log(item)
  }

  _alterItemData = async (key) => {
    console.log(this.state.itemToAlter)

    var objToSave = new SnackItem(this.state.snackName, this.state.SnackCost, this.state.snackCat, this.state.snackKey)

    await AsyncStorage.setItem(''+this.state.snackKey, JSON.stringify(objToSave))
    this.setState({modalVisible: false});
  }

  Item({ title }) {
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}>
          <View style={styles.modalcont}>
            <View>
            <Text style={styles.buttonText}>Snack Name:</Text>
            <TextInput ref={input => { this.nameinput = input }} 
            value={this.state.snackName}
            onChangeText={(snackName) => this.setState({snackName})}
            style={styles.input}/>

            <Text style={styles.buttonText}>Snack Cost:</Text>
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
          </View>
        </Modal>

        <ScrollView>
          {this.state.items.map((item, index) => {
            return (
                <View key={index} style={styles.listcont}>
                  <Text style={{flex: 1, alignSelf: 'flex-start'}}>Name: {item.name}</Text>
                  <Text style={{flex: 1, alignSelf: 'flex-start'}}>Cost: {item.cost}</Text>
                  <TouchableOpacity onPress={() => this._showItemdata(item.key, true)} style={styles.Btn}>
                    <Text style={styles.buttonText}>Alter</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this._deleteItem(item.key)} style={styles.Btn}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
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
    height: 100, 
    margin: 5,
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: '#ededed',
  },
  modalcont: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    alignItems:'center',
    justifyContent: 'center',
  },
  modalBtn: {
    alignSelf: 'center',
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    backgroundColor: '#ccccff',
    width: 100,
    margin: 10
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
    alignSelf: 'flex-end',
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    backgroundColor: '#ccccff',
    width: 100
  },
  header: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
  },
});