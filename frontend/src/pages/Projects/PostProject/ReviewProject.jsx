import React, { useEffect, useState } from "react";
import { getProjectFromFB } from "./services";

export const ReviewProject = (props) => {
  const projectId = props.projectDetails.projectId;
  const [project, setProject] = useState({});
  useEffect(() => {
    getProjectFromFB(projectId).then((project) => {
      setProject(project);
    });
  }, []);
  return <div>Done</div>;
};
