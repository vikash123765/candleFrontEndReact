import { useAtom } from "jotai";
import { storeAtom } from '../lib/store.js';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from "../components/FormField";


export default function Contact() {
  const [store, setStore] = useAtom(storeAtom);
  const [formState, setFormState] = useState({
    subject: "",
    email: "",
    message: "",
  });

  const navigate = useNavigate(); // Use useNavigate hook

  useEffect(() => {
    // Fetch user's email if logged in
    if (store.loggedIn && store.user && store.user.email) {
      setFormState((prev) => ({ ...prev, email: store.user.email }));
    }
  }, [store.loggedIn, store.user]);

  const handleInputChange = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formState.message) {
      alert("Please provide a message");
      return;
    }

    // Depending on the login status, call the appropriate API
    if (store.loggedIn) {
      // Call the API for logged-in users
      const response = await fetch(`http://localhost:8080/user/loggedIn/customerService/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": store.token, // Assuming you have a token in your store,
          "senderEmail": formState.email,
        },
        body: JSON.stringify({
          message: formState.message,
          subject: formState.subject,
          email: formState.email
        }),
      });

      if (response.ok) {
        alert("Message sent successfully");
        // You can redirect the user to another page or do other actions
        navigate('/');
      } else {
        alert("Error sending message");
        console.error(response);
      }
    } else {
      // Call the API for guest users
      const response = await fetch(`http://localhost:8080/guest/customerService/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "subject": formState.subject,
          "senderEmail": formState.email,
        },
        body: JSON.stringify({
          message: formState.message,
          subject: formState.subject,
          email: formState.email
        }),
      });

      if (response.ok) {
        alert("Message sent successfully");
        // You can redirect the user to another page or do other actions
        navigate('/');
      } else {
        alert("Error sending message");
        console.error(response);
      }
    }
  };

  return (
    <>
      <section id="contact">
        <form onSubmit={handleSubmit}>
          <FormField
            label="Subject"
            name="subject"
            onChange={(value) => handleInputChange("subject", value)}
          />
          {!store.loggedIn && (
            <FormField
              label="Your email"
              name="email"
              value={formState.email}
              onChange={(value) => handleInputChange("email", value)}
            />
          )}
          <FormField
            label="Message"
            type="textarea"
            name="message"
            onChange={(value) => handleInputChange("message", value)}
          />
          <button type="submit">
            Submit
          </button>
        </form>
      </section>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero consequatur voluptatem, <span>possimus</span> saepe deleniti voluptas explicabo dolore ducimus, maxime aperiam neque perferendis obcaecati voluptate <span>nisi</span> impedit maiores molestiae ipsam provident?</p>
    </>
  );
}
