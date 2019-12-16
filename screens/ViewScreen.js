import React from "react";
import { 
  StyleSheet, 
  View, 
  TouchableOpacity,
  Text,
  AsyncStorage
} from 'react-native';
import AddScreen from './AddScreen';
import { VictoryPie } from 'victory-native';
import { Svg } from 'react-native-svg'

export default class ViewScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      lastKey: 0,
      keysRounded: false,
      keys: [],
      fetchedItems: [],
      CostsbyCateg: []
    }
    this.eleContainsInArray = this.eleContainsInArray.bind(this);
  }

  async componentDidMount(){
    this._retrieveData();
  }

  _retrieveData = async () => {
    try {

      const keyvalues = await AsyncStorage.getAllKeys()

      let items = []
      let categAdded = []
      let categoryCosts= []
      let categories = 0
      let totalcost = 0

      //console.log(keyvalues)

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
      // console.log(categoryCosts)
    
      this.setState({CostsbyCateg: categoryCosts})
      this.setState({fetchedItems: items})


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

  eleContainsInArray(arr,element){
    if(arr != null && arr.length >0){
        for(var i=0;i<arr.length;i++){
            if(arr[i] == element)
                return true;
        }
    }
    return false;
  } 

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

  _getSeries = () => {
    return this.state.CostsbyCateg
  }

  render(){
    return (
      <View style={styles.container}>

        <View style={styles.list}>
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
                        target: "data",
                        mutation: ({ style }) => {
                          return style.fill === "#c43a31" ? null : { style: { fill: "#c43a31" } };
                        }
                      }, {
                        target: "labels",
                        mutation: ({ text }) => {
                          return text === "clicked" ? null : { text: "clicked" };
                        }
                      }
                    ];
                  }
                }
              }]}
            />
          </Svg>
        </View>

        <View style={styles.inputArea}>
          <TouchableOpacity onPress={() => this._retrieveData()} style={styles.Btn}>
          <Text style={styles.buttonText}>Refresh</Text>
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
    justifyContent: 'flex-end',
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
  Btnyel: {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'yellow',
    marginHorizontal: 10,
    marginVertical: 10,
    width: 100
  },
  Btngre: {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'green',
    marginHorizontal: 10,
    marginVertical: 10,
    width: 100
  },
  Btnora: {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'orange',
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
    alignItems: 'center',
    justifyContent: 'flex-end',
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


/*
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
*/