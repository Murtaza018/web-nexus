import "./home.css";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import CollectionsIcon from '@mui/icons-material/Collections';
import BookIcon from '@mui/icons-material/Book';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import Navbar from "../navbar/navbar";
const Home = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUsername(parsedUser.username);
    }
  }, []);
  
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(true);
  const latestPosts = [
    {
      id: "1",
      title: "Homemade Pizza",
      description: "Classic homemade pizza with a crispy crust and fresh toppings.",
      image: "/images/pizza.jpg",  // Correct path for local images inside the public folder
      prepTime: "20 mins",
      cookTime: "15 mins",
      ingredients: [
        "2 1/2 cups all-purpose flour",
        "1 teaspoon salt",
        "1 teaspoon sugar",
        "1 tablespoon active dry yeast",
        "1 cup warm water",
        "2 tablespoons olive oil",
        "1/2 cup tomato sauce",
        "2 cups shredded mozzarella cheese",
        "Toppings of your choice",
      ],
      instructions: [
        "In a large bowl, combine flour, salt, sugar, and yeast.",
        "Add warm water and olive oil, then mix until a dough forms.",
        "Knead the dough on a floured surface for about 5 minutes.",
        "Place in a greased bowl, cover, and let rise for 30 minutes.",
        "Preheat oven to 450°F (230°C).",
        "Roll out the dough on a floured surface to your desired thickness.",
        "Transfer to a baking sheet or pizza stone.",
        "Spread tomato sauce over the dough, leaving a small border for the crust.",
        "Sprinkle with cheese and add your favorite toppings.",
        "Bake for 12-15 minutes or until the crust is golden and the cheese is bubbly.",
      ],
    },
    {
      id: "2",
      title: "Chocolate Chip Cookies",
      description: "Soft and chewy chocolate chip cookies that are perfect for any occasion.",
      image: "/images/cookies.jpg",  // Correct path for local images inside the public folder
      prepTime: "15 mins",
      cookTime: "10 mins",
      ingredients: [
        "1 cup butter, softened",
        "1 cup white sugar",
        "1 cup packed brown sugar",
        "2 eggs",
        "2 teaspoons vanilla extract",
        "3 cups all-purpose flour",
        "1 teaspoon baking soda",
        "2 teaspoons hot water",
        "1/2 teaspoon salt",
        "2 cups semisweet chocolate chips",
      ],
      instructions: [
        "Preheat oven to 350°F (175°C).",
        "Cream together the butter, white sugar, and brown sugar until smooth.",
        "Beat in the eggs one at a time, then stir in the vanilla.",
        "Dissolve baking soda in hot water. Add to batter along with salt.",
        "Stir in flour and chocolate chips.",
        "Drop by large spoonfuls onto ungreased pans.",
        "Bake for about 10 minutes or until edges are nicely browned.",
      ],
    },
    {
      id: "3",
      title: "Vegetable Stir Fry",
      description: "Quick and healthy vegetable stir fry with a savory sauce.",
      image: "/images/stirfry.jpg",  // Correct path for local images inside the public folder
      prepTime: "10 mins",
      cookTime: "15 mins",
      ingredients: [
        "2 tablespoons vegetable oil",
        "1 onion, sliced",
        "2 bell peppers, sliced",
        "2 carrots, julienned",
        "1 cup broccoli florets",
        "1 cup snap peas",
        "2 cloves garlic, minced",
        "1 tablespoon ginger, minced",
        "3 tablespoons soy sauce",
        "1 tablespoon honey",
        "1 teaspoon sesame oil",
        "1 tablespoon cornstarch mixed with 2 tablespoons water",
      ],
      instructions: [
        "Heat vegetable oil in a large wok or skillet over high heat.",
        "Add onion and stir-fry for 1 minute.",
        "Add bell peppers, carrots, broccoli, and snap peas. Stir-fry for 3-4 minutes.",
        "Add garlic and ginger, stir-fry for 30 seconds until fragrant.",
        "In a small bowl, mix soy sauce, honey, and sesame oil.",
        "Pour sauce over vegetables and toss to coat.",
        "Add cornstarch mixture and stir until sauce thickens, about 1 minute.",
        "Serve hot over rice or noodles.",
      ],
    },
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const Logout = () => {
    localStorage.removeItem("user")
    localStorage.setItem("loggedIn", false)
    window.location.reload();
  }

  return (
    <div className="home-page">
      <Navbar/>
      {/* Toggle Button for showing/hiding navbar */}
      <button
        className={`menu-toggle-button ${menuOpen ? 'menu-open' : ''}`}
        onClick={toggleMenu}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <main className={`home-content ${!menuOpen ? 'menu-closed' : ''}`}>
        <div className="welcome-banner">
          <h1 className="welcome-banner-title">
          {username ? `Welcome ${username}` : "Please sign in first"}
            </h1>
          <p className="welcome-banner-subtitle">Capture memories, share recipes, and document your journey</p>
        </div>

        <section className="updates-section">
          <h2 className="section-title">Recent Updates</h2>
          <div className="updates-container">
            {latestPosts.map(post => (
              <div key={post.id} className="update-card">
                <img className="update-card-image" src={post.image} alt={post.title} />
                <div className="update-card-content">
                  <h3 className="update-card-title">{post.title}</h3>
                  <p className="update-card-date">{post.date}</p>
                  <span className="update-card-badge">{post.type}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="nav-cards-section">
          <h2 className="section-title">Explore</h2>
          <div className="cards-grid">
            <div className="nav-card" onClick={() => {
              if (localStorage.getItem("loggedIn")) { navigate("/Gallery") } else {
                window.alert("Sign Up/Sign In first")
              }
            }}>
              <CollectionsIcon className="nav-card-icon" />
              <h3 className="nav-card-title">Gallery</h3>
              <p className="nav-card-description">Browse your photo collections</p>
            </div>

            <div className="nav-card" onClick={() => {
              if (localStorage.getItem("loggedIn")) { navigate("/Blog") } else {
                window.alert("Sign Up/Sign In first")
              }
            }}>
              <BookIcon className="nav-card-icon" />
              <h3 className="nav-card-title">Blog</h3>
              <p className="nav-card-description">Read your journal entries</p>
            </div>

            <div className="nav-card" onClick={() => {
              if (localStorage.getItem("loggedIn")) { navigate("/Recipe") } else {
                window.alert("Sign Up/Sign In first")
              }
            }}>
              <MenuBookIcon className="nav-card-icon" />
              <h3 className="nav-card-title">Recipe Book</h3>
              <p className="nav-card-description">View your favorite recipes</p>
            </div>

            <div className="nav-card" onClick={() => {
              if (localStorage.getItem("loggedIn")) { navigate("/Contact") } else {
                window.alert("Sign Up/Sign In first")
              }
            }}>
              <LocalPhoneIcon className="nav-card-icon" />
              <h3 className="nav-card-title">Contact</h3>
              <p className="nav-card-description">Get in touch with us</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={`home-footer ${!menuOpen ? 'menu-closed' : ''}`}>
        <p>&copy; Team AAL</p>
      </footer>
    </div>
  );
};

export default Home;