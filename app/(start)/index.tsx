import { Image, StyleSheet, Platform, Dimensions } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const [collections, setCollections] = useState([]);
  const [timestamp, setTimestamp] = useState<any[]>([]);
  const [waterlevel, setWaterLevel] = useState<any[]>([]);

  const fetchLastDocument = async () => {
    try {
      const querySnapshot = await firestore()
        .collection("Pot001")
        .orderBy("Timestamp", "desc") // Replace with your timestamp field
        .limit(1)
        .get();

      if (!querySnapshot.empty) {
        const lastDocumentData = querySnapshot.docs[0].data();
        console.log("Last document:", lastDocumentData);
      } else {
        console.log("No documents found.");
      }
    } catch (error) {
      console.error("Error fetching the last document:", error);
    }
  };

  // const fetchAllDocument = async () => {
  //   try {
  //     const querySnapshot = await firestore()
  //       .collection('Pot001')
  //       .get();

  //     if (!querySnapshot.empty) {
  //       const lastDocumentData = querySnapshot.docs;
  //       console.log('All document:', lastDocumentData);
  //     } else {
  //       console.log('No documents found.');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching the last document:', error);
  //   }
  // };

  const fetchAllDocument = async () => {
    const Humidity: any[] = [];
    const LightLevel: any[] = [];
    const TDS: any[] = [];
    const Temperature: any[] = [];
    const Timestamp: any[] = [];
    const WaterLevel: any[] = [];

    try {
      const querySnapshot = await firestore().collection("Pot001").get();

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const data = doc.data(); // Extract the document data

          // Extract values from '_data'
          Humidity.push(data["Humidity (%)"]);
          LightLevel.push(data["Light Level (lux)"]);
          TDS.push(data["TDS (mg/L)"]);
          Temperature.push(data["Temperature (°C)"]);

          // Handle both single and array timestamps
          const firestoreTimestamp = data["Timestamp"]; // Assuming Timestamp can be a single object or array

          if (Array.isArray(firestoreTimestamp)) {
            // If it's an array, map over the items
            const formattedTimestamps = firestoreTimestamp.map((timestamp) => {
              const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
              return date.toLocaleString("en-US", {
                timeZone: "Asia/Kolkata", // Adjust this if you want a different time zone
                timeZoneName: "short",
              });
            });
            Timestamp.push(formattedTimestamps);
          } else {
            // If it's a single object, just format it
            const date = new Date(firestoreTimestamp.seconds * 1000);
            const formattedTimestamp = date.toLocaleString("en-US", {
              timeZone: "Asia/Kolkata",
              timeZoneName: "short",
            });
            Timestamp.push(formattedTimestamp); // Push it as an array for consistency
          }

          WaterLevel.push(data["Water Level (cm)"]);
        });

        // Now you have arrays for each field
        // console.log('Humidity:', Humidity);
        // console.log('LightLevel:', LightLevel);
        // console.log('TDS:', TDS);
        // console.log('Temperature:', Temperature);

        // console.log('WaterLevel:', WaterLevel);

        setTimestamp(Timestamp);
        setWaterLevel(WaterLevel);

        // You can now use these arrays to render graphs, etc.
      } else {
        console.log("No documents found.");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const createCollection = async (collectionName: string) => {
    try {
      // Add a temporary document to create the collection
      await firestore()
        .collection(collectionName)
        .doc("_placeholder") // Temporary document ID
        .set({}); // Empty document data

      console.log(`Collection '${collectionName}' created successfully!`);
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };
  useEffect(() => {
    // fetchLastDocument();
  //   fetchAllDocument();
  // console.log("timestamp", timestamp)
  // console.log("waterlevel", waterlevel)

  }, []);

  const data = {
    labels: ["8/3/2024, 5:30:00 AM GMT+5:30", "8/3/2024, 6:30:00 AM GMT+5:30", "8/3/2024, 7:30:00 AM GMT+5:30", "8/3/2024, 8:30:00 AM GMT+5:30", "8/3/2024, 9:30:00 AM GMT+5:30", "8/3/2024, 10:30:00 AM GMT+5:30", "8/3/2024, 11:30:00 AM GMT+5:30", "8/3/2024, 12:30:00 PM GMT+5:30", "8/3/2024, 1:30:00 PM GMT+5:30"],
    datasets: [
      {
        data: [20, 19.97, 19.92, 19.87, 19.83, 19.8, 19.77, 19.72, 19.66, 19.62],
      }
    ],
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}></ThemedView>
      {/* <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
      </ThemedView> */}

 <LineChart
  data={data}
  width={screenWidth}
  height={220}
  chartConfig={{
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726"
    }
  }}
/> 
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
