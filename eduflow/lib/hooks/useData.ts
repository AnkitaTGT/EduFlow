import { useState, useEffect } from 'react';
import { MOCK_STUDENTS, MOCK_COURSES, MOCK_QUIZZES } from '../mock/mock-data';
import { Student, Course, Quiz } from '../types';
import { db } from '../firebase/config';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';

const useMockData = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const useStudents = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            if (useMockData) {
                setStudents(MOCK_STUDENTS.slice(0, 20));
            } else {
                try {
                    const q = query(collection(db, "students"), orderBy("name"), limit(20));
                    const snapshot = await getDocs(q);
                    const data = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Student));
                    setStudents(data);
                } catch(e) {
                    console.error("Failed to fetch students", e);
                }
            }
            setLoading(false);
        }
        fetchStudents();
    }, []);

    return { students, loading };
};

export const useCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            if (useMockData) {
                setCourses(MOCK_COURSES);
            } else {
                try {
                    const snapshot = await getDocs(collection(db, "courses"));
                    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
                    setCourses(data);
                } catch(e) {
                    console.error("Failed to fetch courses", e);
                }
            }
            setLoading(false);
        }
        fetchCourses();
    }, []);

    return { courses, loading };
};

export const useQuizzes = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            if (useMockData) {
                setQuizzes(MOCK_QUIZZES);
            } else {
                // Fetch from Firestore
            }
            setLoading(false);
        }
        fetchQuizzes();
    }, []);

    return { quizzes, setQuizzes, loading };
}
