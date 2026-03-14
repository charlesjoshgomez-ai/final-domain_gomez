import { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from './firebaseConfig'; // your Firebase config file
const db = getFirestore(app);
export default function BooksScreen() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const q = query(collection(db, "books"), where("available", "==", true));
        const querySnapshot = await getDocs(q);
        const booksList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBooks(booksList);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Available Books</Text>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text>{item.title} by {item.author}</Text>
          </View>
        )}
      />
    </View>
  );
}
