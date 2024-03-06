import React, { forwardRef } from 'react';
import FormField from "./FormField";

const GuestCheckoutForm = forwardRef((props, ref) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    props.guestCheckout(e);
  };

  return (
    <div>
      <form ref={ref} onSubmit={handleSubmit} id="guestCheckoutForm">
        <FormField 
          label="Name"
          name="userName"
          type="text"
          placeholder="Enter your name"
        />
        <FormField 
          label="Email"
          name="email"
          type="email" 
          placeholder="Enter your email"
        />
        <FormField 
          label="Shipping address"
          name="shippingAddress"
          type="textarea"
          placeholder="Enter your complete address: Street Address, Postal Code, City, and Country. Please include Apartment or Floor Number."
          style={{ width: '100%', height: '8rem', boxSizing: 'border-box', resize: 'none' }} 
        />
        <FormField 
          label="Phone number"
          name="phoneNumber"
          type="text"
          placeholder="Enter your country code and number: ex: +1 1234567890 or +44 9876543210  "
        />
      </form>
    </div>
  );
});

export default GuestCheckoutForm;

