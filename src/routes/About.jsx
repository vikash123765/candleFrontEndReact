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
        <h2>Our team members</h2>
        <div className="team-member">
             <p>CEO</p>
          <h3>Vikash Kosaraju</h3>
       
        </div>
        <div className="team-member">
            <p>Co-founder</p>
          <h3>Tural Noori</h3>
        
        </div>
        <div className="team-member">
          <p>Co-Founder</p>
          <h3>Stefanos tzegay</h3>
          
        </div>
      </section>
    </div>
  );
}

export default About;
