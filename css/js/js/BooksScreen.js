import { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { app } from './firebaseConfig';

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

  const borrowBook = async (bookId, userId) => {
    try {
      const now = new Date();
      const dueDate = new Date(now);
      dueDate.setDate(now.getDate() + 7);

      const bookRef = doc(db, "books", bookId);
      await updateDoc(bookRef, {
        available: false,
        borrowedBy: userId,
        dueDate: dueDate
      });

      await addDoc(collection(db, "transactions"), {
        bookId: bookId,
        userId: userId,
        borrowDate: serverTimestamp(),
        returnDate: null
      });

      console.log("Book borrowed successfully!");
    } catch (error) {
      console.error("Error borrowing book:", error);
    }
  };

  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Available Books</Text>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text>{item.title} by {item.author}</Text>
            <Button 
              title="Borrow" 
              onPress={() => borrowBook(item.id, "oQahlXZAwcLNx4GtU5Gm")} 
            />
          </View>
        )}
      />
    </View>
  );
}
