import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
} from 'react-native';

export default class AddScreen extends React.Component {

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

  _storeData = async (name) => {
    try {
      if(this.state.username != ""){
        if(this.state.lastKey == this.state.maxKeys-1){
          await AsyncStorage.setItem(''+this.state.keys[this.state.lastKey], ''+name)
          this.setState({lastKey: 0, keysRounded: true})
        }
        else{
          if(this.state.keysRounded){
            this.setState({keysRounded: false})
          }
          await AsyncStorage.setItem(''+this.state.keys[this.state.lastKey], ''+name)
          this.setState({lastKey: this.state.lastKey+1})
        }
        this.textInput.clear()
        this.setState({username: ""})
      }
    } catch (error) {
      console.log('error saving')
      console.log(error)
    }
  };


  render(){
    return (
      <View style={styles.container}>
        <TextInput ref={input => { this.textInput = input }} 
        onChangeText={(username) => this.setState({username})}
        style={styles.txtInp}/>

        <TouchableOpacity onPress={() => this._storeData(this.state.username)} style={styles.Btn}>
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
  txtInp: {
    backgroundColor: '#ededed',
    height: 40,
    width: 200
  },
});


/*
function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/development-mode/'
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
  );
}

 developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
 */