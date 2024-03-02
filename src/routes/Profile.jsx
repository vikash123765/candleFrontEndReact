// ... Other imports

import { storeAtom } from "../lib/store";
import { useAtom } from "jotai";
import { alterInfo, changePassword } from "../lib/api";
import '../style/profile.css';

import FormField from "../components/FormField";

export default function Profile() {
    const [store, setStore] = useAtom(storeAtom);
  
    const handleProfileForm = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));
        
        try {
            const parsedResult = await alterInfo(data);
      console.log(parsedResult)
    
            // If there was a parsing error or the parsed result is not an object,
            // assume the update was successful and proceed with displaying success message
            if (parsedResult && typeof parsedResult == 'object') {
                console.log('User information updated successfully');
                alert("user info changed sucessfully!")
                // Assuming your alterInfo API response contains updated user info
                const updatedUser = parsedResult;
                // Update the user state in the frontend
                setStore({
                    user: updatedUser,
                });
            } else {
                // Continue processing the parsed JSON result
                if (parsedResult.error) {
                    console.error('API call failed:', parsedResult);
                    // Handle error here, e.g., show an error message to the user
                    return;
                }
    
                // Assuming your alterInfo API response contains updated user info
                const updatedUser = parsedResult;
    
                // Update the user state in the frontend
                setStore({
                    user: updatedUser,
                });
            }
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        
            // Handle unexpected errors here
        }
    };
    
    
    

    const handleChangePasswordForm = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target));

        try {
            const result = await changePassword(
                data.oldPassword,
                data.newPassword,
                {
                    good: () => {
                        alert("Password changed successfully");
                        // Optionally, you can update other parts of the UI or state as needed
                    },
                    bad: (res) => {
                        alert("Password change failed");
                        console.log(res);
                    }
                }
            );

        } catch (error) {
            console.error('An unexpected error occurred:', error);
            // Handle unexpected errors here
        }
    };

    return (
        <section id="profile">
            {/* Profile change form */}
            <div id="address">
                <form onSubmit={handleProfileForm}>
                    <FormField
                        label="User Name"
                        name="userName"
                        defaultValue={store.user?.userName}
                    />
                    <FormField
                        label="Your email"
                        name="userEmail"
                        defaultValue={store.user?.userEmail}
                    />
                    <FormField
                        label="Your address"
                        name="address"
                        defaultValue={store.user?.address}
                    />
                    <FormField
                        label="Phone number"
                        name="phoneNumber"
                        defaultValue={store.user?.phoneNumber}
                    />
                    <label className="form-field">
                        <span>Gender</span>
                        <select name="gender">
                            <option value="MALE">
                                Male
                            </option>
                            <option value="FEMALE">
                                Female
                            </option>
                            <option value="OTHER">
                                Other
                            </option>
                        </select>
                    </label>

                    <button type="submit">Update my profile info</button>
                </form>
            </div>

            {/* Password change form */}
            <div id="change-password">
                <form onSubmit={handleChangePasswordForm}>
                    {/* Form fields for changing password */}
                    <FormField
                        label="Current password"
                        name="oldPassword"
                        type="password"
                    />
                    <FormField
                        label="New password"
                        name="newPassword"
                        type="password"
                    />
                    <button type="submit">Change password</button>
                </form>
            </div>
        </section>
    );
}
