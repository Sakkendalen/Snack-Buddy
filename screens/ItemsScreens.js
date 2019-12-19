import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  AsyncStorage 
} from 'react-native';
import Constants from 'expo-constants';

export default class ItemsScreens extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      data : [
          {
            title: 'Items',
          }
        ],
      items: this._itemsOfthisCateg(),
    }
    console.log(this.state.data2)
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

    return correctCateg

  }

  _deleteItem =  async (key) => {
    console.log(key)
    let items = this.state.items
    let notDeletedItems = []
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
        <ScrollView>
          {this.state.items.map((item, index) => {
            return (
                <View key={index} style={styles.listcont}>
                  <Text style={{flex: 1, alignSelf: 'flex-start'}}>Name: {item.name}</Text>
                  <Text style={{flex: 1, alignSelf: 'flex-start'}}>Cost: {item.cost}</Text>
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
    marginHorizontal: 10,
    marginVertical: 10,
    width: 100
  },
  header: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
  },
});