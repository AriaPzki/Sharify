import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import ShareVideo from "../assets/share.mp4";
import Logo from "../assets/logowhite.png";
import jwt_decode from "jwt-decode";
import { client } from "../client";

export default function Login() {
  const navigate = useNavigate();
  const responseGoogle = (response) => {
    const decoded = jwt_decode(response.credential); // We Used JSON Web Token to convert credential
    // to details of the person logged in
    console.log(decoded);
    const user_decoded = [decoded.name, decoded.sub, decoded.picture];
    const user = {
      _id: user_decoded[1], // "_" is used to tell which document we are creating (user)
      _type: "user",
      userName: user_decoded[0],
      image: user_decoded[2],
    };
    localStorage.setItem("user", JSON.stringify(user));
    client.createIfNotExists(user).then(() => {
      navigate("/", { replace: true });
    });
    console.log(user);
  };
  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={ShareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={Logo} alt="Logo" width="150px" />
          </div>
          <div className="shadow-2xl">
            <GoogleOAuthProvider
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
            >
              <GoogleLogin
                render={(renderProps) => (
                  <button
                    type="button"
                    className="bg-mainColor flex justify-center items-center p-3rounded-lg cursor-pointer outline-none"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <FcGoogle className="mr-4" />
                    Sign in with Google
                  </button>
                )}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy="single-host-origin"
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
