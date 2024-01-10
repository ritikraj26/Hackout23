import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { HandleCallback } from "./pages/HandleCallback/HandleCallback";
import { Auth } from "./pages/Auth";
import { useState } from "react";
import AuthContext from "./context/AuthContext";
import { Projects } from "./pages/Projects/Projects";
import { Toaster } from "react-hot-toast";
import { PostProject } from "./pages/Projects/PostProject/PostProject";
import { ViewProject } from "./pages/Projects/ViewProject/ViewProject";
import { MyProjects } from "./pages/Projects/MyProjectsAndApplications/MyProjects/MyProjects";
import { MyApplications } from "./pages/Projects/MyProjectsAndApplications/MyApplications/MyApplications";
import { ManageProject } from "./pages/Projects/MyProjectsAndApplications/MyProjects/ManageProject";
import { ManageApplication } from "./pages/Projects/MyProjectsAndApplications/MyApplications/ManageApplication";

function App() {
  const [data, setData] = useState("");

  const updateData = (newData) => {
    setData(newData);
  };

  return (
    <>
      <AuthContext.Provider value={{ data, updateData }}>
        <Toaster />
        <BrowserRouter>
          <Auth />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/view-project/:projectId" element={<ViewProject />} />
            <Route path="/post-a-project" element={<PostProject />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/callback" element={<HandleCallback />} />
            <Route path="/my-projects" element={<MyProjects />} />
            <Route
              path="/my-projects/manage-project/:projectId"
              element={<ManageProject />}
            />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route
              path="/my-applications/manage-application/:projectId"
              element={<ManageApplication />}
            />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </>
  );
}

export default App;
