import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, SectionList } from 'react-native';
import Constants from 'expo-constants';

export default class ItemsScreens extends React.Component {

  constructor(props){
    super(props)
    const { navigation } = this.props;
    this.state = {
      data : [
          {
            title: 'Items',
            data: [navigation.getParam('category', "not found")],
          }
        ]
  }
  }

  static navigationOptions = ({ navigation }) => {
    console.log(navigation.getParam('osoite', 'no data'))
        return {
          title: navigation.getParam('category', 'no data')
        };
  };

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
        <SectionList
                sections={this.state.data}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => <Text style={ {fontSize: 16, margin: 10} }>{item}</Text>}
                renderSectionHeader={({ section: { title } }) => ( <Text style={ {fontSize: 20, margin: 10} }>{title}</Text>)}
            />
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
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
  },
});