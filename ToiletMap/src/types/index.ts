import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Map: {},
  Element: {
    element: any,
    title: string
  };
};

export type MapScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Map'
>;
export type MapScreenRouteProp = RouteProp<RootStackParamList, 'Map'>;

export type ElementScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Element'
>;
export type ElementScreenRouteProp = RouteProp<RootStackParamList, 'Element'>;
