import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";

import firestore from "@react-native-firebase/firestore";
import { LineChart } from "react-native-chart-kit";
import { useLocalSearchParams } from "expo-router";

const ShowPotsHistory = () => {
  const { name }: any = useLocalSearchParams();
  const [collections, setCollections] = useState([]);
  const [timestamp, setTimestamp] = useState<any[]>([]);
  const [waterLevel, setWaterLevel] = useState<any[]>([]);
  type ChartData = {
    labels: string[]; // Array of strings for the labels
    datasets: {
      data: number[]; // Array of numbers for the dataset values
    }[];
  };


  const data = {
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  }
  const [humidityData, setHumidityData] = useState<ChartData>(data);

  const [waterLevelData, setWaterLevelData] = useState<ChartData>(data);

  const [lightLevelData, setLightLevelData] = useState<ChartData>(data);

  const [temperatureData, setTemperatureData] = useState<ChartData>(data);

  const [tdsData, setTdsData] = useState<ChartData>(data);

  const [waterLevelDataFetched, setWaterLevelDataFetched] =
    useState<boolean>(false);

  const screenWidth = Dimensions.get("window").width;

  const fetchAllDocument = async () => {
    const Humidity: any[] = [];
    const LightLevel: any[] = [];
    const TDS: any[] = [];
    const Temperature: any[] = [];
    const Timestamp: any[] = [];
    const WaterLevel: any[] = [];

    try {
      const firstQuerySnapshot = await firestore()
        .collection(name)
        .orderBy("Timestamp", "desc") // Order in descending order (newest first)
        .limit(10)
        .get();

      // Get the last document from the first query
      const lastDocument =
        firstQuerySnapshot.docs[firstQuerySnapshot.docs.length - 1];

      // Now fetch the next 10 items starting after the last document from the first query
      const querySnapshot = await firestore()
        .collection(name)
        .orderBy("Timestamp", "asc") // Order in ascending order (oldest first)

        .limit(10) // Limit the result to the next 10 documents
        .get();
        console.log('querySnapshot:', querySnapshot.empty);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc: { data: () => any }) => {
          const data = doc.data(); // Extract the document data

          // Extract values from '_data'
          Humidity.push(data["Humidity (%)"]);
          LightLevel.push(data["Light Level (lux)"]);
          TDS.push(data["TDS (mg/L)"]);
          Temperature.push(data["Temperature (°C)"]);

          const firestoreTimestamp = data["Timestamp"]; // Assuming Timestamp can be a single object or array

          if (Array.isArray(firestoreTimestamp)) {
            // If it's an array, map over the items
            const formattedTimestamps = firestoreTimestamp.map((timestamp) => {
              const date = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
              const localeString = date.toLocaleString("en-US", {
                timeZone: "Asia/Kolkata", // Adjust this if needed
                hourCycle: "h23", // Use 24-hour format
              });

              // Remove seconds and the space after the comma
              return localeString.replace(/:\d{2}$/, "").replace(", ", ",");
            });
            Timestamp.push(formattedTimestamps);
          } else {
            // If it's a single object, just format it
            const date = new Date(firestoreTimestamp.seconds * 1000);
            const formattedTimestamp = date
              .toLocaleString("en-US", {
                timeZone: "Asia/Kolkata",
                hourCycle: "h23", // Use 24-hour format
              })
              .replace(/:\d{2}$/, "")
              .replace(", ", ",");

            Timestamp.push(formattedTimestamp); // Push it as an array for consistency
          }

          WaterLevel.push(data["Water Level (cm)"]);
        });

        // Now you have arrays for each field
        console.log('Humidity:', Humidity);
        console.log('LightLevel:', LightLevel);
        console.log('TDS:', TDS);
        console.log('Temperature:', Temperature);

        console.log('WaterLevel:', WaterLevel);

        setTimestamp(Timestamp);
        setWaterLevel(WaterLevel);

        setWaterLevelData({
          labels: Timestamp,
          datasets: [
            {
              data: WaterLevel,
            },
          ],
        });

        setHumidityData({
            labels: Timestamp,
            datasets: [
              {
                data: Humidity,
              },
            ],
          });

          setLightLevelData({
            labels: Timestamp,
            datasets: [
              {
                data: LightLevel,
              },
            ],
          });

          setTemperatureData({
            labels: Timestamp,
            datasets: [
              {
                data: Temperature,
              },
            ],
          });

          setTdsData({
            labels: Timestamp,
            datasets: [
              {
                data: TDS,
              },
            ],
          });



        setWaterLevelDataFetched(true);
        // You can now use these arrays to render graphs, etc.
      } else {
        console.log("No documents found.");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchAllDocument();

    console.log(waterLevelData);
  }, [waterLevelData]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <Text style={styles.title}>Water Level</Text>
      {waterLevelDataFetched ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false} // Optional: Hide scroll indicator
          style={{ flex: 1, padding: 10 }}
        >
          <LineChart
            data={waterLevelData}
            width={screenWidth * 3}
            height={220}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </ScrollView>
      ) : null}

<Text style={styles.title}>Humidity</Text>
      {waterLevelDataFetched ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false} // Optional: Hide scroll indicator
          style={{ flex: 1, padding: 10 }}
        >
          <LineChart
            data={humidityData}
            width={screenWidth * 3}
            height={220}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </ScrollView>
      ) : null}


<Text style={styles.title}>LightLevel</Text>
      {waterLevelDataFetched ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false} // Optional: Hide scroll indicator
          style={{ flex: 1, padding: 10 }}
        >
          <LineChart
            data={lightLevelData}
            width={screenWidth * 3}
            height={220}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </ScrollView>
      ) : null}

<Text style={styles.title}>Temperature</Text>
      {waterLevelDataFetched ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false} // Optional: Hide scroll indicator
          style={{ flex: 1, padding: 10 }}
        >
          <LineChart
            data={temperatureData}
            width={screenWidth * 3}
            height={220}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </ScrollView>
      ) : null}

<Text style={styles.title}>TDS</Text>
      {waterLevelDataFetched ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false} // Optional: Hide scroll indicator
          style={{ flex: 1, padding: 10 }}
        >
          <LineChart
            data={tdsData}
            width={screenWidth * 3}
            height={220}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </ScrollView>
      ) : null}
    </ScrollView>
  );
};

export default ShowPotsHistory;

const styles = StyleSheet.create({

    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        paddingTop: 20
      },
});
