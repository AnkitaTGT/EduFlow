import { MOCK_STUDENTS, MOCK_COURSES, MOCK_QUIZZES } from './mock-data';
// In a real scenario, this file would use firebase-admin to push these records
// to a Firestore database via batch writes.

console.log("Seeding Database...");
console.log(`Seeding ${MOCK_STUDENTS.length} students...`);
console.log(`Seeding ${MOCK_COURSES.length} courses...`);
console.log(`Seeding ${MOCK_QUIZZES.length} quizzes...`);

// Example snippet of how it would look:
/*
import * as admin from 'firebase-admin';
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const batch = db.batch();
MOCK_STUDENTS.forEach(student => {
    const ref = db.collection('students').doc(student.uid);
    batch.set(ref, student);
});
await batch.commit();
*/
console.log("Seeding complete! (Mock script executed)");
