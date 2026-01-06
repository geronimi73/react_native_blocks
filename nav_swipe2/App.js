import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Link } from '@react-navigation/native';
import { Button } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';

import { styles } from './styles';

function HomeScreen() {
  return (
    <ScrollView
      contentContainerStyle={styles.HomeScreen}
      bounces={true} // Enables the rubber-band effect
      alwaysBounceVertical={true} // Ensures bounce even if content is shorter than the container
    >
      <View style={styles.HomeScreen}>
        <Button screen="Details1" color="#ed6e87">
          Go to Details Red
        </Button>
        <Button screen="Details2" color="#9fcbdf">
          Go to Details Blue
        </Button>
      </View>
    </ScrollView>
  );
}

function Details1Screen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

function Details2Screen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}

const RootStack = createNativeStackNavigator(
  {
    screens: {
      Home: {
        screen: HomeScreen,
        options: {
          title: "Home",
        }
      },
      Details1: {
        screen: Details1Screen,
        options: {
          title: "Details One",
          headerStyle: {
            backgroundColor: '#ed6e87',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }
      },
      Details2: {
        screen: Details2Screen,
        options: {
          title: "Details Two",
          headerStyle: {
            backgroundColor: '#9fcbdf',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }
      },
    }
  },
  {
    initialRouteName: 'Home'
  }
);

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}