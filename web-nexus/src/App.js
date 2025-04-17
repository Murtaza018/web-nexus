import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/home";
import SignUp from "./pages/authentication/signUp";
import Gallery from "./pages/gallery/gallery";
import Contact from "./pages/contact/contact";
import Blog from "./pages/blog/blog";
import SignIn from "./pages/authentication/signIn";
import Recipe from "./pages/recipe/recipe";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="SignUp">
              <Route index element={<SignUp />} />
            </Route>
            <Route path="SignIn">
              <Route index element={<SignIn />} />
            </Route>
            <Route path="Gallery">
              <Route index element={<Gallery />} />
            </Route>
            <Route path="Contact">
              <Route index element={<Contact />} />
            </Route>
            <Route path="Blog">
              <Route index element={<Blog />} />
            </Route>
            <Route path="Recipe">
              <Route index element={<Recipe />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
