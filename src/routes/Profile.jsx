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
            const result = await alterInfo(data);

            if (!result || result.error) {
                console.error('API call failed:', result);
                // Handle error here, e.g., show an error message to the user
                return;
            }

            // Assuming your alterInfo API response contains updated user info and token
            const updatedUser = result.user;
            const updatedToken = result.token;

            // Update the user state in the frontend, including the new token
            setStore({
                user: updatedUser,
                token: updatedToken,
            });

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
