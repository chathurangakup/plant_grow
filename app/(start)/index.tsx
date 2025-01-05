import { StyleSheet, Dimensions, View, FlatList, SafeAreaView, TouchableOpacity , Text} from "react-native";



import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";


import { router, useLocalSearchParams } from "expo-router";
import CustomButton from "../components/CustomButton";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {


  const [potsNames, setPotArray] = useState<any[]>([]);
   const [isDisableBtn, setIsDisableBtn] = useState(true)





  const getPotNames = async () => {
    const potNames = []; // Array to store the results
    let i = 1; // Counter for dynamic collection names
   
    try {
      while (true) {
        const collectionName = `Pot${String(i).padStart(3, "0")}`; // Generate collection name (e.g., Pot001, Pot002, etc.)
        const querySnapshot = await firestore()
          .collection(collectionName)
          .get();
  
        if (!querySnapshot.empty) {
          // Add the collection info to the array
          potNames.push({ id: i, name: collectionName });
          console.log(`Added ${collectionName} to the array.`);
        } else {
          console.log(`${collectionName} is empty. Stopping the loop.`);
          break; // Stop the loop if the collection is empty
        }
  
        i++; // Increment counter for the next collection
      }
  
      console.log("Final pot names array:", potNames);
      setPotArray(potNames)
      setIsDisableBtn(false)

    } catch (error) {
      console.error("Error fetching collections:", error);
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
    setIsDisableBtn(true)
    getPotNames();
   
  }, []);




  const createNextPotCollection = (potNames: any[]) => {
    if (potNames.length === 0) {
      console.error("No existing pot names found.");
      return;
    }
  
    // Find the latest ID
    const latestId = Math.max(...potNames.map((pot) => pot.id));
  
    // Increment ID and prepare the next collection name
    const nextId = latestId + 1;
    const nextCollectionName = `Pot${String(nextId).padStart(3, "0")}`;
    createCollection(nextCollectionName);
  };

  const handleButtonPress = () => {
    console.log("Button Pressed", "You clicked the button!");
    createNextPotCollection(potsNames)

  };


  const clickPotName = (name: string) => {
    router.push({
      pathname: '/(start)/show-pots-data',
      params: { name },
    });
  }

  const renderItem = ({ item }: any) => (
    <TouchableOpacity onPress={()=>clickPotName(item.name)}>
      <View style={styles.item}>
          <Text style={styles.id}>ID: {item.id}</Text>
          <Text style={styles.name}>Name:  <Text style={styles.nameText}>{item.name}</Text></Text>
        </View>
    </TouchableOpacity>
 
  );

  return (

    <SafeAreaView style={styles.container}>
         <Text style={styles.title}>Smart Pot</Text>
    <FlatList
      data={potsNames}
      keyExtractor={(item) => item.id.toString()} // Unique key for each item
      renderItem={renderItem}
    />

     <CustomButton title="Add new Pot" onPress={()=>handleButtonPress()} disabled={isDisableBtn} />
  </SafeAreaView>
    

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  item: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  id: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  name: {
    fontSize: 14,
    color: "#555",
  },
  nameText:{
    fontSize: 24,
    color: "#555",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 20,
    color: "#333",
  },
});


