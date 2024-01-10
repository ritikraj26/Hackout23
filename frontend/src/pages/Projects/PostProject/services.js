import { addDoc, getDoc, doc, collection, updateDoc } from "firebase/firestore/lite";
import { db } from "../../../firebase/firebase";

export async function createProjectInFB(projectDetails) {
  try {
    const docRef = await addDoc(collection(db, "projects"), projectDetails);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (er) {
    console.log("Error creating project in firebase: ", er);
  }
}

export async function getProjectFromFB(id) {
  try {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        return {id: id, ...docSnap.data()};
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
  } catch (er) {
    console.log("Error getting project from firebase: ", er);
  }
}

export async function updateProjectInFB(id, newdata){
  try {
    const docRef = doc(db, "projects", id);
    await updateDoc(docRef, newdata);
    console.log("Document updated");
  } catch (er) {
    console.log("Error updating project in firebase: ", er);
  }
}
