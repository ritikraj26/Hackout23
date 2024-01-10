import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore/lite";
import { db } from "../../../firebase/firebase";
import { getProjectFromFB } from "../PostProject/services";

export async function getAllProjectsByUser(username) {
  try {
    const q = query(
      collection(db, "projects"),
      where("username", "==", username)
    );

    const querySnapshot = await getDocs(q);
    let projects = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      projects.push({ id: doc.id, ...doc.data() });
    });
    return projects;
  } catch (er) {
    console.log("Failed to fetch all projects", er);
  }
}

export async function getParticipantsOfProject(projectId) {
  try {
    // fetch all participants
    const projectCol = collection(db, "projects", projectId, "participants");
    const projectSnapshot = await getDocs(projectCol);
    const participants = projectSnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    console.log(participants);
    return participants;
  } catch (er) {
    console.log("Error fetching applicants list", er);
  }
}

export async function assignProjectOnFb(
  participantId,
  projectId,
  username,
  address
) {
  try {
    console.log(
      "Project marked as assigned",
      participantId,
      projectId,
      username
    );
    // set participant 'alloted' as true
    await updateDoc(
      doc(db, "projects", projectId, "participants", participantId),
      {
        alloted: true,
      }
    );
    console.log("Participant alloted set to true");
    // set project as 'assigned' : true && assignee
    await updateDoc(doc(db, "projects", projectId), {
      assigned: true,
      assignee: username,
      cryptolancerAddress: address,
    });
    console.log(
      "Project marked as assigned",
      participantId,
      projectId,
      username
    );
    return;
  } catch (er) {
    console.log("Error assigning project", er);
  }
}

export async function finishMilestoneInFb(milestoneId, projectId) {
  try {
    // Get the project document reference
    const projectRef = doc(db, "projects", projectId);

    // Get the project data
    const projectSnapshot = await getDoc(projectRef);

    // Get the milestones array from the project data
    const milestones = projectSnapshot.data().milestones;

    console.log(milestones);
    // Find the index of the milestone with the given milestoneId
    const milestoneIndex = milestones.findIndex(
      (milestone) => milestone.milestoneId === milestoneId
    );

    // Update the milestone by adding the 'finished' property
    const updatedMilestones = [...milestones];
    updatedMilestones[milestoneIndex] = {
      ...updatedMilestones[milestoneIndex],
      finished: true,
    };

    // Update the entire project document with the modified milestones array
    await updateDoc(projectRef, { milestones: updatedMilestones });
  } catch (er) {
    console.error("Error marking milestone as finished", er);
  }
}

export async function getProjectsByParticipant(username) {
  try {
    const q = query(
      collectionGroup(db, "participants"),
      where("participant", "==", username)
    );

    const querySnapshot = await getDocs(q);
    let projectIds = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      projectIds.push(doc.data().projectId);
    });
    let projects = [];

    for (const id of projectIds) {
      let project = await getProjectFromFB(id);
      projects.push(project);
    }
    return projects;
  } catch (er) {
    console.error("Error fetching projects by participants.", er);
  }
}

export async function claimMilestoneInFb(milestoneId, projectId) {
  try {
    // Get the project document reference
    const projectRef = doc(db, "projects", projectId);

    // Get the project data
    const projectSnapshot = await getDoc(projectRef);

    // Get the milestones array from the project data
    const milestones = projectSnapshot.data().milestones;

    console.log(milestones);
    // Find the index of the milestone with the given milestoneId
    const milestoneIndex = milestones.findIndex(
      (milestone) => milestone.milestoneId === milestoneId
    );

    // Update the milestone by adding the 'finished' property
    const updatedMilestones = [...milestones];
    updatedMilestones[milestoneIndex] = {
      ...updatedMilestones[milestoneIndex],
      claimed: true,
    };

    // Update the entire project document with the modified milestones array
    await updateDoc(projectRef, { milestones: updatedMilestones });
  } catch (er) {
    console.error("Error marking milestone as finished", er);
  }
}
