import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';
import CustomButton from '../components/CustomButton';

type DocumentData = {
  [key: string]: string | number | { seconds: number; nanoseconds: number };
};

const ShowPotsData = () => {
  const { name }: any = useLocalSearchParams();
  const [lastDocumentData, setLastDocumentData] = useState<DocumentData | null>(null);
  const [isDataEmpty, setIsDataEmpty] = useState(false);
  const [nameData, setNameData] = useState(name);
  const [isDisableBtn, setIsDisableBtn] = useState(true)

  useEffect(() => {

    const fetchLastDocument = async () => {
      setIsDisableBtn(true)
      try {
        const querySnapshot = await firestore()
          .collection(name)
          .orderBy('Timestamp', 'desc') // Replace with your timestamp field
          .limit(1)
          .get();

        if (!querySnapshot.empty) {
          const lastDocumentData = querySnapshot.docs[0].data();
          setLastDocumentData(lastDocumentData as DocumentData);
          setIsDataEmpty(false); // Reset empty state if data is found
          setIsDisableBtn(false)
        } else {
          console.log('No documents found.');
          setIsDataEmpty(true); // Mark data as empty
          setIsDisableBtn(false)
        }
      } catch (error) {
        console.error('Error fetching the last document:', error);
        setIsDataEmpty(true); // Handle error as "no data"
      }
    };

    fetchLastDocument();
    setNameData(name)
  }, [name]);


  const clickShowPotHistory = (name: string) => {
     router.push({
         pathname: '/(start)/show-pots-history',
         params: { name },
       });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Last Pot Data:</Text>
        {isDataEmpty ? (
          <Text style={styles.noDataText}>No documents found.</Text>
        ) : lastDocumentData ? (
          Object.entries(lastDocumentData).map(([key, value]) => (
            <View key={key} style={styles.dataRow}>
              <Text style={styles.dataKey}>{key}:</Text>
              <Text style={styles.dataValue}>
                {key === 'Timestamp' && typeof value === 'object'
                  ? new Date(value.seconds * 1000).toLocaleString() // Format timestamp
                  : value?.toString()} {/* Convert value to string */}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.loadingText}>Loading data...</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton title="Show Pot History" onPress={() => clickShowPotHistory(nameData)}  disabled={isDisableBtn}/>
      </View>
    </SafeAreaView>
  );
};

export default ShowPotsData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  dataKey: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dataValue: {
    fontSize: 16,
    color: '#555',
  },
  loadingText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#888',
  },
  noDataText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'red',
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: '#fff', // Optional: makes the button stand out
    borderTopWidth: 1,
    borderColor: '#ddd', // Optional: for a clean separator
  },
});
