import { storeAtom } from "../lib/store"
import { useAtom } from "jotai"
import { alterInfo, changePassword } from "../lib/api"

import FormField from "../components/FormField"

export default function Profile() {

    const [store, setStore] = useAtom(storeAtom)

    async function handleProfileForm(e) {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.target))
        
        const result = await alterInfo(data)

        if (!result) {return}

        location.reload()
    }

    async function handleChangePasswordForm(e) {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.target))
        
        const result = await changePassword(
            data.oldPassword,
            data.newPassword,
            {
                good: res => {
                    alert("Success")
                    location.reload()
                },
                bad: res => {
                    alert("failure")
                    console.log(res)
                }
            }
        )
    }

  return (
    <section id="profile">
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

                <button>
                    Update my profile info
                </button>
            </form>
        </div>
        {/* end profile change */}
        <div id="change-password">
            <form onSubmit={handleChangePasswordForm}>
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
                <button>
                    Change password
                </button>
            </form>
        </div>
    </section>
  )
}