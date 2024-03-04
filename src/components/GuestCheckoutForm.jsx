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
        />
        <FormField 
          label="Email"
          name="email"
          type="email"
        />
        <FormField 
          label="Shipping address"
          name="shippingAddress"
          type="text"
        />
        <FormField 
          label="Phone number"
          name="phoneNumber"
          type="text"
        />
       
      </form>
    </div>
  );
});

export default GuestCheckoutForm;
