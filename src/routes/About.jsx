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

      <section className="general-info-section">
        <h2>General Information</h2>
        <p>
          Discover the latest trends in fashion, technology, and more at Our E-Commerce Store. 
          We curate a diverse collection of products to cater to your unique needs and preferences.
        </p>
      </section>

      <section className="payment-section">
        <h2>Payment System</h2>
        <p>
          Our E-Commerce Store offers a secure and convenient payment system. 
          We support various payment methods to make your shopping experience smooth and reliable.
        </p>
      </section>

      <section className="shipping-section">
        <h2>Shipping Information</h2>
        <p>
          Enjoy fast and reliable shipping services. We strive to deliver your orders promptly 
          and keep you informed every step of the way. Check out our shipping policies for more details.
        </p>
      </section>

      <section className="returns-section">
        <h2>Returns & Exchanges</h2>
        <p>
          Your satisfaction is our priority. Learn about our hassle-free returns and exchange process 
          to ensure you have a stress-free shopping experience with us.
        </p>
      </section>

      <section className="team-section">
        <h2>Our Team Members</h2>
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
          <h3>Stefanos Tzegay</h3>
        </div>
      </section>
    </div>
  );
}

export default About;
