import React, { useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { point } from "@turf/helpers";
import destination from "@turf/destination";
import { MapScreenNavigationProp, MapScreenRouteProp } from "../../types";

const REGION_ST_TOKYO = {
  latitude: 35.681262,
  longitude: 139.766403,
} as const;

const INITIAL_SCALE = {
  latitudeDelta: 0.00922,
  longitudeDelta: 0.00521,
} as const;

export type TElements = [];

export type Tbox = {
  south: null | number;
  west: null | number;
  north: null | number;
  east: null | number;
};

type Props = {
  navigation: MapScreenNavigationProp;
  route: MapScreenRouteProp;
};

export const MapScreen = ({ navigation }: Props) => {
  const [elements, setElements] = useState<TElements>([]);
  const [bbox, setBbox] = useState<Tbox>({
    south: null,
    west: null,
    north: null,
    east: null,
  });

  const fetchToilet = useCallback(async () => {
    const destinations = `(${bbox.south},${bbox.west},${bbox.north},${bbox.east});`;
    const body = `
    [out:json];
    (
      node
        [amenity=toilets]
        ${destinations}
      node
        ["toilets:wheelchair"=yes]
        ${destinations}
    );
    out;
    `;

    const options = {
      method: "POST",
      body,
    };

    try {
      const url = "https://overpass-api.de/api/interpreter";
      const response = await fetch(url, options);
      const json = (await response.json()) || [];

      setElements(json.elements);
    } catch (error) {
      console.error(error);
    }
  }, [bbox]);

  const handleRegionChange = useCallback((region) => {
    const center = point([region.longitude, region.latitude]);
    const verticalMater = (111 * region.latitudeDelta) / 2;
    const horizonalMater = (111 * region.longitudeDelta) / 2;

    const options = { units: "kilometers" };
    const south = destination(center, verticalMater, 180, options);
    const west = destination(center, horizonalMater, -90, options);
    const north = destination(center, verticalMater, 0, options);
    const east = destination(center, horizonalMater, 90, options);

    const newBbox = {
      south: south.geometry.coordinates[1],
      west: west.geometry.coordinates[0],
      north: north.geometry.coordinates[1],
      east: east.geometry.coordinates[0],
    };

    setBbox(newBbox);
  }, []);

  const handleMoveElementScreen = useCallback((element, title) => {
    navigation.navigate("Element", {
      element,
      title,
    });
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        onRegionChangeComplete={handleRegionChange}
        style={styles.mapView}
        initialRegion={{
          ...REGION_ST_TOKYO,
          ...INITIAL_SCALE,
        }}
      >
        {elements.length ? (
          <>
            {elements.map((elm) => {
              const title = elm?.tags?.["name"] || "トイレ";
              return (
                <Marker
                  key={`id_${elm.id}`}
                  coordinate={{
                    latitude: elm.lat,
                    longitude: elm.lon,
                  }}
                  title={title}
                  onCalloutPress={() => handleMoveElementScreen(elm, title)}
                />
              );
            })}
          </>
        ) : null}
      </MapView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={fetchToilet} style={styles.button}>
          <Text style={styles.buttonItem}>トイレ取得</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  button: {
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  buttonItem: {
    textAlign: "center",
  },
});
