import React, { forwardRef, useState } from 'react';
import FormField from "./FormField";

const GuestCheckoutForm = forwardRef((props, ref) => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    shippingAddress: '',
    phoneNumber: '',
  });

  const handleFormChange = () => {
    if (props.onFormChange) {
      props.onFormChange(formData); // Notify the parent component about form changes
    }
  };

  const handleInputChange = (e) => {
    if (e && e.target) {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      handleFormChange();
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (props.guestCheckout) {
      props.guestCheckout(formData);
    }
  };

  return (
    <div>
      <form ref={ref} onSubmit={handleSubmit} id="guestCheckoutForm">
        <FormField 
          label="Name"
          name="userName"
          type="text"
          placeholder="Enter your name"
          onChange={handleInputChange}
          value={formData.userName} // Add this line
        />
        <FormField 
          label="Email"
          name="email"
          type="email" 
          placeholder="Enter your email"
          onChange={handleInputChange}
          value={formData.email} // Add this line
        />
        <FormField 
          label="Shipping address"
          name="shippingAddress"
          type="textarea"
          placeholder="Enter your complete address: Street Address, Postal Code, City, and Country. Please include Apartment or Floor Number."
          style={{ width: '100%', height: '8rem', boxSizing: 'border-box', resize: 'none' }} 
          onChange={handleInputChange}
          value={formData.shippingAddress} // Add this line
        />
        <FormField 
          label="Phone number"
          name="phoneNumber"
          type="text"
          placeholder="Enter your country code and number: ex: +1 1234567890 or +44 9876543210  "
          onChange={handleInputChange}
          value={formData.phoneNumber} // Add this line
        />
      </form>
    </div>
  );
});

export default GuestCheckoutForm;
