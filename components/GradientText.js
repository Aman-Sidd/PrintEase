import React from "react";
import { Text } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

const GradientText = (props) => {
  return (
    <MaskedView maskElement={<Text style={[props.style]}>{props.text}</Text>}>
      <LinearGradient
        colors={["#8AD4EC", "#EF96FF", "#FF56A9", "#FFAA6C"]}
        start={{ x: 0, y: 0 }}
      >
        <Text style={[props.style, { opacity: 0 }]}>{props.text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
