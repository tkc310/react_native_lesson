import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import CalcButton from "./components/CalcButton";

const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBar.currentHeight;

type TOperations = "+" | "-" | "*" | "/";

export default function App() {
  const { width, height } = Dimensions.get("window");
  const getOrientation = useCallback((width, height) => {
    return width < height ? "portrait" : "landscape";
  }, []);

  const [results, setResults] = useState<number[]>([]);
  const [current, setCurrent] = useState("0");
  const [hasDot, setHasDot] = useState(false);
  const [afterValue, setAfterValue] = useState(false);
  const [forceReRender, setForceReRender] = useState(false);
  const [orientation, setOrientation] = useState(getOrientation(width, height));

  const changeOrientation = ({ window }) => {
    const _orientation = getOrientation(window.width, window.height);
    setOrientation(_orientation);
  };

  useEffect(() => {
    Dimensions.addEventListener("change", changeOrientation);
    return () => {
      Dimensions.removeEventListener("change", changeOrientation);
    };
  }, []);

  const reset = useCallback((withResults?: boolean) => {
    if (withResults) {
      setResults([]);
    }
    setCurrent("0");
    setHasDot(false);
    setAfterValue(false);
  }, []);

  const handleAllClear = useCallback(() => {
    reset(true);
  }, []);

  const handleClear = useCallback(() => {
    reset();
  }, []);

  const handleEnter = useCallback(() => {
    let _value = NaN;
    if (hasDot) {
      _value = parseFloat(current);
    } else {
      _value = parseInt(current);
    }

    if (isNaN(_value)) {
      return;
    }

    let _results = results;
    _results.push(_value);

    setResults(_results);
    reset();
  }, [hasDot, current, results]);

  const handleOperate = useCallback(
    (type: TOperations) => {
      if (results.length < 2) {
        return;
      }

      if (afterValue) {
        return;
      }

      let _results = results;
      let _value = null;
      const target2 = _results.pop();
      const target1 = _results.pop();

      const safeCalc = (t1: number, t2: number, op: TOperations) => {
        const lastDivision = ["*", "/"].includes(op) ? 100 : 10;
        const exp = `(${t1} * 10 ${op} ${t2} * 10) / ${lastDivision}`;
        return eval(exp).toString();
      };

      switch (type) {
        case "+":
          _value = safeCalc(target1, target2, "+");
          break;
        case "-":
          _value = safeCalc(target1, target2, "-");
          break;
        case "*":
          _value = safeCalc(target1, target2, "*");
          break;
        case "/":
          _value = safeCalc(target1, target2, "/");
          if (!isFinite(_value)) {
            _value = null;
          }
          break;
        default:
          break;
      }

      if (_value === null) {
        return;
      }

      _results.push(_value);

      setResults(_results);
      setForceReRender(!forceReRender);
      reset();
    },
    [afterValue, results]
  );

  const handleValue = useCallback(
    (value: string) => {
      let _current = current;
      let _hasDot = hasDot;
      if (value === ".") {
        if (!hasDot) {
          _current += value;
          _hasDot = true;
        }
      } else if (_current === "0") {
        _current = value;
      } else {
        _current += value;
      }

      setCurrent(_current);
      setHasDot(_hasDot);
      setAfterValue(true);
    },
    [current, hasDot]
  );

  const buttons = [
    [
      { label: "AC", flex: 2, onPress: handleAllClear },
      { label: "C", onPress: handleClear },
      { label: "+", onPress: () => handleOperate("+") },
    ],
    [
      { label: "7", onPress: () => handleValue("7") },
      { label: "8", onPress: () => handleValue("8") },
      { label: "9", onPress: () => handleValue("9") },
      { label: "-", onPress: () => handleOperate("-") },
    ],
    [
      { label: "4", onPress: () => handleValue("4") },
      { label: "5", onPress: () => handleValue("5") },
      { label: "6", onPress: () => handleValue("6") },
      { label: "*", onPress: () => handleOperate("*") },
    ],
    [
      { label: "1", onPress: () => handleValue("1") },
      { label: "2", onPress: () => handleValue("2") },
      { label: "3", onPress: () => handleValue("3") },
    ],
    [
      { label: "0", onPress: () => handleValue("0") },
      { label: ".", onPress: () => handleValue(".") },
      { label: "/", onPress: () => handleOperate("/") },
    ],
    [{ label: "Enter", onPress: handleEnter }],
  ];

  const showValue = useCallback(
    (idx) => {
      let _idx = idx;
      if (afterValue || results.length === 0) {
        _idx -= 1;
      }

      if (_idx === -1) {
        return current;
      }

      if (results.length > _idx) {
        return results[results.length - 1 - _idx];
      }

      return "";
    },
    [current, afterValue, results]
  );

  let resultFlex = 3;
  if (orientation === "landscape") {
    resultFlex = 1;
  }

  const resultValues = useMemo(() => [...Array(resultFlex).keys()].reverse(), [
    orientation,
  ]);

  return (
    <View style={styles.container}>
      <View style={[styles.results, { flex: resultFlex }]}>
        {resultValues.map((idx) => {
          return (
            <View style={styles.resultLine} key={`result_${idx}`}>
              <Text>{showValue(idx)}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.buttons}>
        <View style={styles.buttonsLine}>
          {buttons[0].map(({ label, flex, onPress }) => (
            <CalcButton
              label={label}
              flex={flex}
              onPress={onPress}
              key={label}
            />
          ))}
        </View>
        <View style={styles.buttonsLine}>
          {buttons[1].map(({ label, flex, onPress }) => (
            <CalcButton
              label={label}
              flex={flex}
              onPress={onPress}
              key={label}
            />
          ))}
        </View>
        <View style={styles.buttonsLine}>
          {buttons[2].map(({ label, flex, onPress }) => (
            <CalcButton
              label={label}
              flex={flex}
              onPress={onPress}
              key={label}
            />
          ))}
        </View>

        <View style={styles.lastButtonLinesContainer}>
          <View style={styles.twoButtonLines}>
            <View style={styles.buttonsLine}>
              {buttons[3].map(({ label, flex, onPress }) => (
                <CalcButton
                  label={label}
                  flex={flex}
                  onPress={onPress}
                  key={label}
                />
              ))}
            </View>
            <View style={styles.buttonsLine}>
              {buttons[4].map(({ label, flex, onPress }) => (
                <CalcButton
                  label={label}
                  flex={flex}
                  onPress={onPress}
                  key={label}
                />
              ))}
            </View>
          </View>
          <View style={styles.enterButtonContainer}>
            {buttons[5].map(({ label, flex, onPress }) => (
              <CalcButton
                label={label}
                flex={flex}
                onPress={onPress}
                key={label}
              />
            ))}
          </View>
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
    paddingTop: STATUSBAR_HEIGHT,
  },
  results: {
    flex: 3,
    backgroundColor: "#fff",
  },
  resultLine: {
    flex: 1,
    borderBottomWidth: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  buttons: {
    flex: 5,
  },
  buttonsLine: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    alignItems: "center",
    borderWidth: 1,
  },
  lastButtonLinesContainer: {
    flex: 2,
    flexDirection: "row",
  },
  twoButtonLines: {
    flex: 3,
  },
  enterButtonContainer: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
  },
});
