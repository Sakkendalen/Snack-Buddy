import React from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  TouchableOpacity,
  Text,
  AsyncStorage
} from 'react-native';
import AddScreen from './AddScreen';

export default class ViewScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      lastKey: 0,
      keysRounded: false,
      keys: [],
      fetchedItems: []
    }
  }

  async componentDidMount(){
    try{

      const checkkeys =  await AsyncStorage.getAllKeys()
      this.setState({keys: checkkeys, maxKeys: 10})

      if(this.state.keys.length < this.state.maxKeys){
        var initKeys = []
        for(var loop=0; loop < this.state.maxKeys; loop++){
          initKeys.push('Key'+loop)
        }
        this.setState({keys: initKeys})
      }
    } catch (error) {
      console.log('error mounting')
      console.log(error)
    }
  }

  _retrieveData = async () => {
    try {

      const keyvalues = await AsyncStorage.getAllKeys()

      let items = []

      for(var key of keyvalues){
        const item = JSON.parse(await AsyncStorage.getItem(''+key))
        items.push(item)
      }
      items.sort((a,b) => b.score - a.score)
      this.setState({fetchedItems: items})
      //console.log(this.state.fetchedItems)

    } catch (error) {
      console.log('error loading')
      console.log(error)
    }

    // AsyncStorage.getAllKeys().then((keys) => {
    //   return AsyncStorage.multiGet(keys)
    //     .then((result) => {
    //       console.log(result);
    //     }).catch((e) =>{
    //       console.log(e);
    //     });
    // });
  }
    
    // try {
    //   if(this.state.keysRounded){
    //     console.log("Key: " +this.state.keys[maxKeys])
    //     const value = await AsyncStorage.getItem(''+this.state.keys[maxKeys])
    //     this.setState({keysRounded: false})
    //   }
    //   else{
    //     console.log("KeyTest: " +this.state.keys[this.state.lastKey-1])
    //     const value = await AsyncStorage.getItem(''+this.state.keys[this.state.lastKey-1])
    //   }
    // } catch (error) {
    //   console.log('error loading')
    //   console.log(error)
    // }
    //};

  _clearData = async () => {
    console.log('clear clicked')
    try {
      await AsyncStorage.clear()
      this.setState({lastKey: 0, keysRounded: false, fetchedItems: []})
    } catch (error) {
      console.log('error loading')
      console.log(error)
    }
  }

  render(){
    return (
      <View style={styles.container}>
        <View style={styles.list}>
          <ScrollView>

              {this.state.fetchedItems.map((item, index) => {
                return (
                    <View key={index} style={styles.listcont}>
                      <Text style={{flex: 1, alignSelf: 'flex-start'}}>Name: {item.name}</Text>
                      <Text style={{flex: 1, alignSelf: 'center'}}>Cost: {item.cost}</Text>
                      <Text style={{flex: 1, alignSelf: 'flex-end'}}>Category: {item.categ}</Text>
                    </View>
                )
              })}
              
          </ScrollView>
        </View>

        <View style={styles.inputArea}>
          <TouchableOpacity onPress={() => this._retrieveData()} style={styles.Btn}>
          <Text style={styles.buttonText}>Load</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this._clearData()} style={styles.Btn}>
          <Text style={styles.buttonText}>Clear All</Text>
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
  inputArea:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  list:{
    flex:1,
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    alignItems: 'stretch',
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
