import { firestore } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

const getCollectionRef = (collectionName) => {
  return collection(firestore, collectionName);
};

const getCollection = async (collectionName) => {
  const querySnapshot = await getDocs(getCollectionRef(collectionName));
  const data = [];
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
};

const getDocument = async (collectionName, id) => {
  const q = query(getCollectionRef(collectionName), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    throw new Error('Document does not exist');
  }
};

const getCollectionWithCondition = async (collectionName, field, operator, value) => {
  const q = query(getCollectionRef(collectionName), where(field, operator, value));
  const querySnapshot = await getDocs(q);
  const data = [];
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
};

const addDocument = async (collectionName, data) => {
  const docRef = await addDoc(getCollectionRef(collectionName), data);
  return { id: docRef.id, ...data };
};

const updateDocument = async (collectionName, id, data) => {
  const q = query(getCollectionRef(collectionName), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    await updateDoc(docSnap.ref, data);
    return { id, ...data };
  } else {
    throw new Error('Document does not exist');
  }
};

const deleteDocument = async (collectionName, id) => {
  const q = query(getCollectionRef(collectionName), where('id', '==', id));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    await deleteDoc(docSnap.ref);
  } else {
    throw new Error('Document does not exist');
  }
};

export { getCollection, getDocument, getCollectionWithCondition, addDocument, updateDocument, deleteDocument };
