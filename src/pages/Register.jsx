import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

import {
  GoogleLogin
} from "@react-oauth/google";


export default function Register() {

  const navigate = useNavigate();


  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);



  // Normal register

  const handleRegister = async(e)=>{

    e.preventDefault();

    setError("");
    setLoading(true);


    try{

      const response = await api.post(
        "/auth/register",
        {
          email,
          password
        }
      );


      localStorage.setItem(
        "access_token",
        response.data.access_token
      );


      localStorage.setItem(
        "refresh_token",
        response.data.refresh_token
      );


      navigate("/dashboard");


    }catch(err){

      const detail = err.response?.data?.detail;


      if(Array.isArray(detail)){
        setError(detail.join(", "));
      }
      else{
        setError(
          detail ||
          "Registration failed"
        );
      }


    }finally{

      setLoading(false);

    }

  };



  // Google Register

  const handleGoogleRegister = async(response)=>{


    try{


      const googleToken = response.credential;


      const result = await api.post(
        "/auth/google-login",
        {
          token: googleToken
        }
      );


      localStorage.setItem(
        "access_token",
        result.data.access_token
      );


      navigate("/dashboard");


    }catch(err){

      setError(
        "Google registration failed"
      );

    }

  };



  return (

    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">


      <h2 className="text-2xl font-bold mb-6 text-center">
        Create Account
      </h2>



      {
        error && (

          <p className="mb-4 text-red-500 text-sm text-center">
            {error}
          </p>

        )
      }



      <form
        onSubmit={handleRegister}
        className="space-y-4"
      >


        <div>

          <label className="block text-sm font-medium">
            Email
          </label>


          <input
            type="email"
            value={email}
            onChange={
              (e)=>setEmail(e.target.value)
            }
            required
            className="w-full mt-1 p-2 border rounded"
          />

        </div>




        <div>

          <label className="block text-sm font-medium">
            Password
          </label>


          <input

            type="password"

            value={password}

            onChange={
              (e)=>setPassword(e.target.value)
            }

            required

            className="w-full mt-1 p-2 border rounded"

          />

        </div>




        <button

          type="submit"

          disabled={loading}

          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"

        >

          {
            loading
            ? "Creating Account..."
            : "Register"
          }


        </button>


      </form>



      <div className="my-5 text-center text-gray-500">

        OR

      </div>




      <div className="flex justify-center">


        <GoogleLogin

          onSuccess={handleGoogleRegister}

          onError={()=>{

            setError(
              "Google registration failed"
            )

          }}

        />


      </div>




      <p className="mt-4 text-center text-sm text-gray-600">


        Already have an account?{" "}


        <Link

          to="/login"

          className="text-blue-600 underline"

        >

          Sign In

        </Link>


      </p>


    </div>

  );
}