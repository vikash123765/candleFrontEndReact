import React, { useState } from "react";
import '../style/Admin.css';

const Admin = () => {
  const [adminEmail, setAdminEmail] = useState(""); // Input for admin email (authentication)
  const [authToken, setAuthToken] = useState(""); // Input for authentication token
  const [orderNrCancel, setOrderNrCancel] = useState(""); // Input for order number to cancel
  const [orderNrSent, setOrderNrSent] = useState(""); // Input for order number to mark as sent
  const [trackingId, setTrackingId] = useState(""); // Input for tracking ID when marking as sent
  const [orderNrDelivered, setOrderNrDelivered] = useState(""); // Input for order number to mark as delivered

  const handleCancelOrder = async () => {
    try {
      const response = await fetch(`http://localhost:8080/order/${orderNrCancel}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'email': adminEmail, // Use the provided admin email for authentication
          'x-auth-token': authToken,
        }
        
      });

      if (response.ok) {
        console.log(`Order ${orderNrCancel} canceled successfully`);
        alert("order was cancelled !")
      } else {
        console.error(`Failed to cancel order ${orderNrCancel}`);
        alert("failed to cancel order please tryagain  !")


      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleLogout = async () => {
    try {
        console.log("Admin Email:", adminEmail);
        console.log("Auth Token:", authToken);

        const response = await fetch("http://localhost:8080/admin/signOut", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'email': adminEmail,
                'x-auth-token': authToken,
            },
        });

        if (response.ok) {
            console.log("Admin logged out successfully");
            // Redirect to the login page or another appropriate page
            window.location.href = '/login'; // Example: Redirect to the login page
        } else {
            console.error("Failed to log out admin");
            // You can show an error message or handle it as needed
        }
    } catch (error) {
        console.error("Error during log out:", error);
    }
};


  const handleMarkSent = async () => {
    try {
      const queryParams = trackingId !== "" ? `?trackingId=${trackingId}` : "";
      const url = `http://localhost:8080/order/sent/${orderNrSent}/${queryParams}`;
  
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'email': adminEmail,
          'x-auth-token': authToken,
        },
      });
  
      if (response.ok) {
        console.log(`Order ${orderNrSent} marked as sent successfully`);
      } else {
        console.error(`Failed to mark order ${orderNrSent} as sent`);
        alert(`Failed to mark order ${orderNrSent} as sent`)
      }
    } catch (error) {
      console.error("Error:", error);
      alert("something went wring please try agaim")
    }
  };
  

  const handleMarkDelivered = async () => {
    try {
      const response = await fetch(`http://localhost:8080/order/delivered/${orderNrDelivered}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'email': adminEmail, // Use the provided admin email for authentication
          'x-auth-token': authToken,
        },
      });

      if (response.ok) {
        console.log(`Order ${orderNrDelivered} marked as delivered successfully`);
      } else {
        console.error(`Failed to mark order ${orderNrDelivered} as delivered`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h1>Welcome, Admin!</h1>

      {/* Authentication */}
      <div className="admin-authentication">
        <label htmlFor="adminEmail">Admin Email:</label>
        <input
          type="text"
          id="adminEmail"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          placeholder="Enter Admin Email"
        />
        <label htmlFor="authToken">Authentication Token:</label>
        <input
          type="text"
          id="authToken"
          value={authToken}
          onChange={(e) => setAuthToken(e.target.value)}
          placeholder="Enter Authentication Token"
        />
      </div>

      {/* Remove/Cancel an Order */}
      <div className="admin-endpoint">
        <h2>Remove/Cancel an Order</h2>
        <label htmlFor="orderNrCancel">Order Number:</label>
        <input
          type="text"
          id="orderNrCancel"
          value={orderNrCancel}
          onChange={(e) => setOrderNrCancel(e.target.value)}
          placeholder="Enter Order Number"
        />
        <button onClick={handleCancelOrder}>Cancel Order</button>
      </div>

      {/* Mark Order as Sent */}
      <div className="admin-endpoint">
        <h2>Mark Order as Sent</h2>
        <label htmlFor="orderNrSent">Order Number:</label>
        <input
          type="text"
          id="orderNrSent"
          value={orderNrSent}
          onChange={(e) => setOrderNrSent(e.target.value)}
          placeholder="Enter Order Number"
        />
        <label htmlFor="trackingId">Tracking ID:</label>
        <input
          type="text"
          id="trackingId"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter Tracking ID"
        />
        <button onClick={handleMarkSent}>Mark as Sent</button>
      </div>

      {/* Mark Order as Delivered */}
      <div className="admin-endpoint">
        <h2>Mark Order as Delivered</h2>
        <label htmlFor="orderNrDelivered">Order Number:</label>
        <input
          type="text"
          id="orderNrDelivered"
          value={orderNrDelivered}
          onChange={(e) => setOrderNrDelivered(e.target.value)}
          placeholder="Enter Order Number"
        />
        <button onClick={handleMarkDelivered}>Mark as Delivered</button>

         {/* Log Out */}
      <div className="admin-endpoint">
        <h2>Log Out</h2>
        <button onClick={handleLogout}>Log Out</button>
      </div>
      </div>
    </div>
  );
};

export default Admin;
   