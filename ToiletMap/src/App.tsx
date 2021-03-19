import React from "react";
import MapScreen from "./screens/MapScreen";
import ElementScreen from "./screens/ElementScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Map">
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ title: "トイレマップ" }}
      />
      <Stack.Screen
        name="Element"
        component={ElementScreen}
        options={({ route }) => ({
          title: route.params.title || "トイレ",
        })}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
