import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Profile from "./Profile.jsx";
import PostDetail from "./PostDetail.jsx";
import EditPost from "./EditPost.jsx";
import NewPost from "./NewPost.jsx";
import Suggested from "./Suggested.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile",
    element: <Profile />,
  }, {
    path: "/post/:postId", 
    element: <PostDetail />,
  },{
    path:"/edit-post/:postId" ,
    element: <EditPost />,
  },
  {
    path:"/newpost" ,
    element: <NewPost />,
  },
  {
    path:"/suggested" ,
    element: <Suggested />,
  },
 
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
