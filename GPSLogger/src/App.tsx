import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system";
import * as MailComposer from "expo-mail-composer";
import MapView, { Polyline } from "react-native-maps";
import { lineString } from "@turf/helpers";

const ZOOM = {
  latitudeDelta: 0.00922,
  longitudeDelta: 0.00521,
} as const;

type TLatLon = {
  latitude: null | number;
  longitude: null | number;
};

export default function App() {
  const [region, setRegion] = useState<TLatLon>({
    latitude: null,
    longitude: null,
  });
  const [message, setMessage] = useState<string>("位置情報取得中");
  const [logs, setLogs] = useState<TLatLon[]>([]);
  const [subscription, setSubscription] = useState<{} | null>(null);
  const [status, setStatus] = useState<string>("stop");

  useEffect(() => {
    if (Platform.OS === "android" && !Constants.isDevice) {
      setMessage("Andoridエミュレータでは動作しません。実機を使いましょう。");
    } else {
      syncLoacation();
    }
  }, []);

  const syncLoacation = useCallback(async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== "granted") {
      setMessage("位置情報のパーミッション取得に失敗しました。");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    () => {
      stopLogging();
    };
  }, []);

  const startLogging = useCallback(async () => {
    if (subscription) {
      return;
    }
    const newSubscription = await Location.watchPositionAsync(
      {
        accuracy: 6,
        distanceInterval: 1,
      },
      loggingPosition
    );
    setLogs([]);
    setSubscription(newSubscription);
    setStatus("logging");
  }, [subscription]);

  const stopLogging = useCallback(() => {
    if (subscription) {
      subscription.remove(loggingPosition);
    }
    setSubscription(null);
    setStatus("stop");
  }, [subscription]);

  const loggingPosition = useCallback(
    ({ coords, timestamp }) => {
      if (coords.accuracy) {
        const newLogs = [
          ...logs,
          {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        ];
        setLogs(newLogs);
      }
    },
    [logs]
  );

  const sendEmail = useCallback(async () => {
    if (status !== "stop" || logs.length < 2) {
      return;
    }

    const newLogs = [...logs];
    const locations = newLogs.map((log) => [log.latitude, log.longitude]);
    const geoJson = JSON.stringify(lineString(locations));
    const uri = FileSystem.cacheDirectory + "gpslog.geojson";
    await FileSystem.writeAsStringAsync(uri, geoJson);

    const result = await MailComposer.composeAsync({ attachments: [uri] });
    if (result?.status === "sent") {
      console.log("sent mail");
    }
  }, [status, logs]);

  return (
    <>
      {region.latitude && region.longitude ? (
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={startLogging}>
              <Text>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={stopLogging}>
              <Text>Stop</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={sendEmail}>
              <Text>Email</Text>
            </TouchableOpacity>
          </View>
          <Text>{status}</Text>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              ...region,
              ...ZOOM,
            }}
            showsUserLocation
          >
            {logs.length > 1 ? (
              <Polyline
                coordinates={logs}
                strokeColor="#00008b"
                strokeWidth={6}
              />
            ) : null}
          </MapView>
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>{message}</Text>
        </View>
      )}

      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  buttonContainer: {
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
