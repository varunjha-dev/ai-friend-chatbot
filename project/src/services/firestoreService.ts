import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export interface UserProfile {
  gfName: string;
  gfNickname: string;
  userName: string;
  userNickname: string;
  gfInterests: string;
  userInterests: string;
  gfPersonality: string;
  createdAt: Timestamp;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Timestamp;
}

export const saveUserProfile = async (userId: string, profile: Omit<UserProfile, 'createdAt'>) => {
  try {
    const userDoc = doc(db, 'users', userId);
    await setDoc(userDoc, {
      ...profile,
      createdAt: Timestamp.now()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const saveChatMessage = async (userId: string, message: Omit<ChatMessage, 'timestamp'>) => {
  try {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, {
      chatHistory: arrayUnion({
        ...message,
        timestamp: Timestamp.now()
      })
    });
  } catch (error) {
    console.error('Error saving chat message:', error);
    throw error;
  }
};

export const getChatHistory = async (userId: string): Promise<ChatMessage[]> => {
  try {
    const userDoc = doc(db, 'users', userId);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.chatHistory || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
};

export const clearChatHistory = async (userId: string) => {
  try {
    const userDoc = doc(db, 'users', userId);
    await updateDoc(userDoc, {
      chatHistory: []
    });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
};