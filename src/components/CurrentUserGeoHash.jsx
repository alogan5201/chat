import React from "react";
import {
  auth,
  signInWithGoogle,
  signOutWithGoogle,
} from "../services/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export const CurrentUserGeoHash = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }
  if (user) {
    return (
      <div>
        <p>Current User: {user.email}</p>
        <button onClick={signOutWithGoogle}>Log out</button>
      </div>
    );
  }
  return <button onClick={signInWithGoogle}>Log in</button>;
};
