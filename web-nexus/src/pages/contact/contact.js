import { useEffect, useState } from "react";
import "./contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const [currentUser, setCurrentUser] = useState({
    firstname: "Dad",
    lastname: "Raza",
    username: "araza-29",
    password: "aloomian",
  });
  useEffect(() => {
    const storedUserDataString = localStorage.getItem("user");
    let userData = null;
    if (storedUserDataString) {
      try {
        userData = JSON.parse(storedUserDataString);
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
    alert("Message sent successfully!");
    setFormData({ name: "", message: "" });
  };

  return (
    <div className="container-CP">
      <div className="contact-wrapper-CP">
        <h1 className="title-CP">Contact Us</h1>

        <form className="form-CP" onSubmit={handleSubmit}>
          <div className="form-group-CP">
            <label htmlFor="name" className="label-CP">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-CP"
              required
            />
          </div>

          <div className="form-group-CP">
            <label htmlFor="message" className="label-CP">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="textarea-CP"
              rows={5}
              required
            />
          </div>

          <button type="submit" className="button-CP">
            Send Message
          </button>
        </form>

        <div className="family-email-CP">
          <p>Need to contact our family group?</p>
          <a
            href={`mailto:${currentUser.username}@gmail.com`}
            className="email-link-CP"
          >
            {currentUser.username}@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
