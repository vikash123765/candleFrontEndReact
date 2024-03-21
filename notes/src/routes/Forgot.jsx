import FormField from "../components/FormField"

export default function Forgot() {
  return (
    <div>
        <h2>Password recovery form</h2>
        <form>
            <FormField
                label="Email"
                name="userEmail"
            />
            <button>
                Submit
            </button>
        </form>
    </div>
  )
}