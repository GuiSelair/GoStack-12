import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from '../pages/Dashboard';
import CreateAppoinment from '../pages/CreateAppoinment';
import Profile from '../pages/Profile';
import AppointmentCreated from '../pages/AppointmentCreated';

const App = createStackNavigator();

const AppRoutes: React.FC = () => (
  <App.Navigator
    screenOptions={{
      // headerShown: false,
      cardStyle: {
        backgroundColor: '#312e38',
      },
    }}
  >
    <App.Screen name="Dashboard" component={Dashboard} />
    <App.Screen name="CreateAppoinment" component={CreateAppoinment} />
    <App.Screen name="AppointmentCreated" component={AppointmentCreated} />

    <App.Screen name="Profile" component={Profile} />
  </App.Navigator>
);

export default AppRoutes;
