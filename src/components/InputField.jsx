import React from "react";

const InputField = ({ label, type, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded"
        required
      />
    </div>
  );
};

export default InputField;
