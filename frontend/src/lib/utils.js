import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { messaging } from "../context Api/Firebase.jsx";
import { getToken } from "firebase/messaging";
import { useAuthStore } from "../stores/useAuthStore.js";

export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const formatMessageDate = (timestamp) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(timestamp).toLocaleDateString(undefined, options);
};


export async function genOrGetToken() {
  console.log("i am called");
  if (Notification.permission !== "granted") {
    console.log("Not granted, something else")
  }
  try {
    const token = await getToken(messaging, {
      vapidKey: "BHc5pZ9jE-aBO6nSXO7LiGxwCitBhQqpay3yveUMtDC6NfIhA0vHSzpdMNaJyCSWW16nY0tyzDh4ZuMO7HmWZzw",
    });
    console.log("Token generated: ", token);
    localStorage.setItem("notiToken", token);
  } catch (error) {
    console.error("Error generating token:", error);
  }
}


async function requestPermission() {
  console.log("inside requestPermission")

  const permission = await Notification.requestPermission();
  console.log(permission);
  if (permission === "granted") {

    genOrGetToken();
  
  } else if (permission === "denied") {
    alert(
      "You have blocked notifications for this site. You wont get Contest updates. wanna change it? allow notification for this site from browser settings."
    );
    return;
  } 
}
export const notiPermissionOnce = () => {
  console.log("Inside notiPermissionOnce");
  if (Notification.permission === "granted") {
    console.log("status: granted")
    alert("yup, you have already allowed notifications. It will help you get Contest Notifications");
  } else {
    requestPermission();
  }
};


export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
