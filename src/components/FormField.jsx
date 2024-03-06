// FormField.jsx
export default function FormField({ 
  label, 
  type="text", 
  name,
  onChange = val => {},
  defaultValue = "",
  placeholder = "",
  style = {}
}) {

  function handleChange(e) {
    const value = 
      type === 'checkbox' ?
        e.target.checked === 'on':
        e.target.value
    onChange(value)
  }

  return (
    <label className="form-field">
        <span>{label}</span>
        {type === 'textarea' ? (
            <textarea 
              onChange={handleChange} 
              name={name}
              defaultValue={defaultValue}
              placeholder={placeholder}
              style={style}
            ></textarea>
        ):(
            <input 
              name={name} 
              type={type} 
              onChange={handleChange}
              defaultValue={defaultValue}
              defaultChecked={defaultValue}
              placeholder={placeholder}
              style={style}
            />
        )}
    </label>
  )
}
