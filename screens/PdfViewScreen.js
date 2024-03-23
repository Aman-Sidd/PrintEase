import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Pdf from "react-native-pdf";

const PdfViewScreen = ({ route }) => {
  const { uri } = route.params;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri, cache: true }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
          setTotalPages(numberOfPages);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
          setCurrentPage(page);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
      <View style={styles.pageNumberContainer}>
        <Text style={styles.pageNumberText}>
          Page {currentPage} of {totalPages}
        </Text>
      </View>
    </View>
  );
};

export default PdfViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  pageNumberContainer: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 5,
  },
  pageNumberText: {
    color: "white",
  },
});
