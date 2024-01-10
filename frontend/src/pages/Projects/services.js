import { addDoc, collection, getDocs } from "firebase/firestore/lite";
import { db } from "../../firebase/firebase";

export async function getAllProjects() {
  try {
    const projectCol = collection(db, "projects");
    const projectSnapshot = await getDocs(projectCol);

    const projects = projectSnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    return projects;
  } catch (er) {
    console.log("Failed to fetch all projects", er);
  }
}

export async function addParticipantToFB(participant, projectId, note, address) {
  try {
    // fetch all participants
    const projectCol = collection(db, "projects", projectId, "participants");
    const projectSnapshot = await getDocs(projectCol);
    const participants = projectSnapshot.docs.map((doc) => {
      return doc.data().participant;
    });

    // check if participant is already in the project
    if (participants.includes(participant)) {
      console.log("Participant already in project");
      return "You have already applied";
    }

    const docRef = await addDoc(
      collection(db, "projects", projectId, "participants"),
      { participant, alloted: false, projectId, note, address }
    );
    console.log("Document written with ID: ", docRef.id);
    // console.log(note);
    return "Your request has been added to the project!";
  } catch (er) {
    console.log("Failed to fetch all projects", er);
  }
}
