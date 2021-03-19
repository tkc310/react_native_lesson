import React from "react";
import { ScrollView, FlatList, View, Text, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  ElementScreenNavigationProp,
  ElementScreenRouteProp,
} from "../../types";

type Props = {
  navigation: ElementScreenNavigationProp;
  route: ElementScreenRouteProp;
};

export const ElementScreen = ({ route }: Props) => {
  const { element } = route.params;
  const tagItems = Object.keys(element?.tags || {}).map((key) => {
    return {
      label: key,
      value: element.tags[key],
    };
  });
  const region = {
    latitude: element.lat,
    longitude: element.lon,
  };
  const zoom = {
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00521,
  };

  console.log(tagItems);

  return element ? (
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={{
          ...region,
          ...zoom,
        }}
      >
        <Marker coordinate={region} />
      </MapView>
      <ScrollView style={{ flex: 1 }}>
        <FlatList
          data={tagItems}
          extraData={tagItems}
          renderItem={({ item }) => <TagItem tag={item} />}
          keyExtractor={(item) => `tag_${item.label}`}
        />
      </ScrollView>
    </View>
  ) : null;
};

export default ElementScreen;

type TagItemProps = {
  tag: {
    label: string;
    value: any;
  };
};

const TagItem = ({ tag }: TagItemProps) => {
  return (
    <View style={styles.tagItem}>
      <View style={styles.key}>
        <Text>{tag.label}</Text>
      </View>
      <View style={styles.value}>
        <Text>{tag.value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tagItem: {
    flexDirection: "row",
  },
  key: {
    flex: 1,
  },
  value: {
    flex: 1,
  },
});
