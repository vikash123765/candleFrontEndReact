import FormField from "./FormField"

export default function GuestCheckoutForm({guestCheckout}) {
  return (
    <div>
      <form onSubmit={guestCheckout}>
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
        <button>
          Check out
        </button>
      </form>
    </div>
  )
}