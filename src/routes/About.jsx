import React from 'react';
import '../style/About.css';

const About = () => {
  return (
    <div className="about-container">
      <section className="about-section">
        <h2>Welcome to Our E-Commerce Store</h2>
        <p>
          At Our E-Commerce Store, we are dedicated to providing an exceptional online shopping experience. 
          Our mission is to offer high-quality products, excellent customer service, and a seamless 
          purchasing journey for every customer.
        </p>
      </section>

      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-member">
          <img src="team-member1.jpg" alt="Team Member 1" />
          <h3>John Doe</h3>
          <p>Co-founder</p>
        </div>
        <div className="team-member">
          <img src="team-member2.jpg" alt="Team Member 2" />
          <h3>Jane Smith</h3>
          <p>Product Manager</p>
        </div>
      </section>
    </div>
  );
}

export default About;
