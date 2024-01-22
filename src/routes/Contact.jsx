import { useAtom } from "jotai"
import { storeAtom } from '../lib/store.js'

import FormField from "../components/FormField"

export default function Contact() {
  const [store, setStore] = useAtom(storeAtom)
  return (
    <>
    <section id="contact">
      <form>
        <FormField label="Subject" name="subject" />
        {!store.loggedIn && (
          <FormField label="Your email" name="email" />
        )}
        <FormField label="Message" type="textarea" name="message"/>
        <button>
          Submit
        </button>
      </form>
    </section>
    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero consequatur voluptatem, <span>possimus</span> saepe deleniti voluptas explicabo dolore ducimus, maxime aperiam neque perferendis obcaecati voluptate <span>nisi</span> impedit maiores molestiae ipsam provident?</p>
    </>
  )
}