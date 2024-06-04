import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-web";

import { Document, Page } from "react-pdf";
import { useDispatch } from "react-redux";
import { setNoOfPages, setPdfName, setPdfUri } from "../../redux/OrderSlice";
import CancelSelectButtons from "../../components/utils/CancelSelectButton";
import { useNavigation } from "@react-navigation/native";
import LoadingScreen from "../../components/utils/LoadingScreen";

export default function PdfViewScreen({ route }) {
  const { uri, showButtons } = route.params;
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  async function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    dispatch(setNoOfPages({ noOfPages: numPages }));
  }
  const onCancelPress = () => {
    dispatch(setPdfName({ pdfName: null }));
    dispatch(setPdfUri({ pdfUri: null }));
    navigation.pop();
  };
  const onSelectPress = () => {
    navigation.pop();
  };
  return (
    <View
      style={{
        margin: 20,
        padding: 20,
        flex: 1,
        backgroundColor: "black",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Document
        file={uri}
        onLoadSuccess={onDocumentLoadSuccess}
        renderTextLayer={false}
        renderAnnotationLayer={false}
      >
        {numPages && (
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 20, color: "white" }}>
              Pdf Has Been{" "}
              <Text style={{ color: "rgb(18 135 16)", fontWeight: "bold" }}>
                Selected
              </Text>
            </Text>
            <Text style={{ fontSize: 16, color: "grey" }}>with</Text>
            <Text style={{ fontSize: 18, color: "white" }}>
              Total Pages: {numPages}
            </Text>
          </View>
        )}
      </Document>
      {showButtons && (
        <CancelSelectButtons
          containerStyle={{ gap: 20 }}
          onCancelPress={onCancelPress}
          onSelectPress={onSelectPress}
          selectButtonText={"Continue"}
        />
      )}
    </View>
  );
}
