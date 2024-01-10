import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { CLIENT_ID, SECRET_ID } from "../../config";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

export const HandleCallback = () => {
  const navigate = useNavigate();
  const {updateData} = useContext(AuthContext)

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  useEffect(() => {
    axios
      .post("http://localhost:8000/api/login", {
        data: {
          client_id: CLIENT_ID,
          client_secret: SECRET_ID,
          code: code,
        },
      })
      .then((res) => {
        console.log(res.data);
        sessionStorage.setItem("githubToken", res.data.access_token);
        sessionStorage.setItem("cryptoLancerUser", JSON.stringify(res.data.user));
        updateData(res.data.user)
        navigate("/");
      });
  }, []);
  return (
    <>
      <div>Please wait...</div>
    </>
  );
};
