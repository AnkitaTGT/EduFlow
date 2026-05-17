import { useEffect } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthStore } from '../store/authStore';
import { User } from '../types';
import { MOCK_USERS } from '../mock/mock-data';

export const useAuth = () => {
  const { user, loading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
      // Mock Auth State - simulate logged out unless explicitly set elsewhere for testing
      // Or auto-login as admin for mock testing
      const mockAdmin = MOCK_USERS[0] as User;
      setUser(mockAdmin);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({ uid: firebaseUser.uid, ...userDoc.data() } as User);
          } else {
            console.error("User document not found in Firestore");
            setUser(null);
          }
        } catch (error) {
           console.error("Error fetching user data:", error);
           setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  const signOut = async () => {
    if (process.env.NEXT_PUBLIC_USE_MOCK !== "true") {
      await firebaseSignOut(auth);
    }
    setUser(null);
    // Remove mock session cookie if any
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = '/login';
  };

  return { user, loading, signOut };
};
