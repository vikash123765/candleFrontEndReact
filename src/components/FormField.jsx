// FormField.jsx

export default function FormField({ 
  label, 
  type="text", 
  name,
  onChange = val => {},
  value = "", // Change defaultValue to value
  placeholder = "",
  style = {},
  error = "" // Add error prop for displaying error message
}) {

  function handleChange(e) {
    const value = type === 'checkbox' ? e.target.checked : e.target.value;
    onChange(value);
  }

  return (
    <label className="form-field">
      <span>{label}</span>
      {type === 'textarea' ? (
        <textarea 
          onChange={handleChange} 
          name={name}
          value={value} 
          placeholder={placeholder}
          style={style}
        ></textarea>
      ) : (
        <input 
          name={name} 
          type={type} 
          onChange={handleChange}
<<<<<<< HEAD
          defaultValue={defaultValue}
          defaultChecked={defaultValue}
=======
          value={value} 
>>>>>>> a9f7600164af4c243d8e4ede1c00af895837a4a7
          placeholder={placeholder}
          style={style}
        />
      )}
      {error && <span className="error-message">{error}</span>} {/* Display error message if error exists */}
    </label>
  );
}
