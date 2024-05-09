import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-web";
import LoadingScreen from "../../components/utils/LoadingScreen";

export default function PdfViewScreen({ route }) {
  const { uri } = route.params;
  const [loading, setLoading] = useState(true);
  const handleDownload = () => {
    // For web, create an anchor tag and trigger download
    setLoading(true);
    const link = document.createElement("a");
    link.href = uri;
    link.download = "document.pdf"; // Name of the file to download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setLoading(false);
  };
  useEffect(() => {
    handleDownload();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      {loading ? (
        <LoadingScreen />
      ) : (
        <View>
          <Text style={{ alignSelf: "center", color: "white", fontSize: "25" }}>
            Pdf has been downloaded
          </Text>
        </View>
      )}
    </View>
  );
}
