import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();

  return (
    <div className="bg-white p-8 rounded-lg shadow">

      <h2 className="text-3xl font-bold mb-4">
        Welcome to your Dashboard
      </h2>

      <p className="text-gray-600 mb-8">
        You are successfully authenticated.
      </p>

      <div className="flex gap-4">

        <button
          onClick={() => navigate("/sessions")}
          className="bg-gray-800 text-white px-5 py-2 rounded hover:bg-gray-900"
        >
          Active Sessions
        </button>

      </div>

    </div>
  );
}