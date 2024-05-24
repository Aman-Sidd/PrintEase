import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-web";

import { Document, Page } from "react-pdf";
import { useDispatch } from "react-redux";
import { setNoOfPages, setPdfName, setPdfUri } from "../../redux/OrderSlice";
import CancelSelectButtons from "../../components/utils/CancelSelectButton";
import { useNavigation } from "@react-navigation/native";

// export default function PdfViewScreen({ route }) {
//   const { uri } = route.params;
//   const [loading, setLoading] = useState(true);
//   const handleDownload = () => {
//     // For web, create an anchor tag and trigger download
//     setLoading(true);
//     const link = document.createElement("a");
//     link.href = uri;
//     link.download = "document.pdf"; // Name of the file to download
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     setLoading(false);
//   };
//   useEffect(() => {
//     handleDownload();
//   }, []);
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "black",
//       }}
//     >
//       {loading ? (
//         <LoadingScreen />
//       ) : (
//         <View>
//           <Text style={{ alignSelf: "center", color: "white", fontSize: "25" }}>
//             Pdf has been downloaded
//           </Text>
//         </View>
//       )}
//     </View>
//   );
// }

export default function PdfViewScreen({ route }) {
  const { uri, showButtons } = route.params;
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  function onDocumentLoadSuccess({ numPages }) {
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
        {/* {Array.apply(null, Array(numPages))
            .map((data, index) => index + 1)
            .map((page) => {
              console.log(page);

              return (
                <Page
                  key={page}
                  pageNumber={page}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              );
            })} */}
        {numPages !== null && (
          <Text style={{ fontSize: 20, color: "white" }}>
            Total pages: {numPages}
          </Text>
        )}
      </Document>
      {showButtons && (
        <CancelSelectButtons
          containerStyle={{ gap: 20 }}
          onCancelPress={onCancelPress}
          onSelectPress={onSelectPress}
        />
      )}
    </View>
  );
}
