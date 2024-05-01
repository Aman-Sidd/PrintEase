import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Pdf from "react-native-pdf";
import { setNoOfPages, setPdfName, setPdfUri } from "../../redux/OrderSlice";
import { useDispatch, useSelector } from "react-redux";
import CancelSelectButtons from "../../components/utils/CancelSelectButton";

const PdfViewScreen = ({ navigation, route }) => {
  const { uri, showButtons } = route.params;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useSelector((state) => state.order.noOfPages);
  const dispatch = useDispatch();

  const onCancelPress = () => {
    dispatch(setPdfName({ pdfName: null }));
    dispatch(setPdfUri({ pdfUri: null }));
    navigation.pop();
  };
  const onSelectPress = () => {
    navigation.pop();
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Pdf
          trustAllCerts={false}
          source={{ uri, cache: true }}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
            dispatch(setNoOfPages({ noOfPages: numberOfPages }));
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
      {showButtons && (
        <CancelSelectButtons
          onCancelPress={onCancelPress}
          onSelectPress={onSelectPress}
        />
      )}
    </View>
  );
};

export default PdfViewScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 15,
    paddingTop: 20,
    marginTop: 20,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "black",
  },
  pdf: {
    flex: 1,
    // width: Dimensions.get("window").width,
    // height: Dimensions.get("window").height,
    width: "100%",
    height: "100",
    alignSelf: "center",
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
