import React, { useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

// @see https://rmap.ekispert.jp/playground/
const API_KEY = "2jr5nchcswemrfjj67jvjaqu" as const;
// const WEB_API_KEY = "LE_q3DF5TEmxKZn3" as const;
// @ see https://github.com/EkispertWebService/GUI
const WEB_API_KEY = "rnwfzKX4rvNVZYat" as const;
const WEB_ENTRY_POINT = "http://api.ekispert.jp/v1/json/search/course/extreme" as const;

const MODE = {
  start: "start",
  via: "via",
} as const;
type TMODE = typeof MODE[keyof typeof MODE];

type TStation = {
  name: string;
  code: null | string;
};

const obj2arr = (obj: object) => {
  return !Array.isArray(obj) ? [obj] : obj;
};

export default function App() {
  const webviewRef = useRef<WebView>(null);
  const [startStation, setStartStation] = useState<TStation>({
    name: "",
    code: null,
  });
  const [viaStation, setViaStation] = useState<TStation>({
    name: "",
    code: null,
  });
  const [selectMode, setSelectMode] = useState<TMODE>(MODE.start);

  const handleHtmlLoaded = () => {
    if (webviewRef.current) {
      const data = {
        type: "init_map",
        api_key: API_KEY,
      };
      webviewRef.current.postMessage(JSON.stringify(data));
    }
  };

  const handleReceiveMsg = (event: WebViewMessageEvent) => {
    try {
      const value = JSON.parse(event.nativeEvent.data);
      const { name, code } = value;
      if (name && code) {
        if (selectMode === MODE.start) {
          setStartStation({ name, code });
          setSelectMode(MODE.via);
        } else {
          setViaStation({ name, code });
          setSelectMode(MODE.start);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    if (!startStation.code || !viaStation.code) {
      return;
    }

    const params = [
      `?key=${WEB_API_KEY}`,
      `viaList=${startStation.code}:${viaStation.code}`,
      "addOperationLinePattern=true",
    ].join("&");
    const url = `${WEB_ENTRY_POINT}${params}`;

    try {
      const response = await fetch(url);
      const json = await response.json();

      if (!json?.ResultSet?.Course?.[0]) {
        return;
      }

      webviewRef.current?.postMessage(JSON.stringify({ type: "clear_all" }));

      const operationLinePatterns = obj2arr(
        json?.ResultSet.Course?.[0]?.OperationLinePattern
      );
      let stations: any[] = [];
      operationLinePatterns.forEach((item) => {
        const lines = obj2arr(item.Line);
        const points = obj2arr(item.Point);

        lines.forEach((_, idx) => {
          const line_code = lines[idx].code;
          const station_code1 = points[idx].Station.code;
          const station_code2 = points[idx + 1].Station.code;
          stations.push(station_code1);
          stations.push(station_code2);

          webviewRef.current?.postMessage(
            JSON.stringify({
              type: "highlight_section",
              line_code,
              station_code1,
              station_code2,
            })
          );
        });

        console.log({
          lines,
          points,
        });
      });

      stations = stations.filter((value, idx, self) => {
        return self.indexOf(value) === idx;
      });
      webviewRef.current?.postMessage(
        JSON.stringify({
          type: "set_station_markers",
          stations,
        })
      );

      console.log({
        stations,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 12 }}>
        <WebView
          source={require("./public/index.html")}
          ref={webviewRef}
          onLoadEnd={handleHtmlLoaded}
          onMessage={handleReceiveMsg}
        />
      </View>
      <View style={styles.stationNameAndButtonContainer}>
        <View style={styles.stationName}>
          <Text>出発駅: {startStation.name}</Text>
        </View>
        <View style={styles.stationName}>
          <Text>到着駅: {viaStation.name}</Text>
        </View>
        <View style={styles.button}>
          <TouchableOpacity onPress={handleSearch}>
            <Text>検索</Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  stationNameAndButtonContainer: {
    flex: 2,
    flexDirection: "row",
  },
  stationNameLines: {
    flex: 3,
  },
  stationName: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
