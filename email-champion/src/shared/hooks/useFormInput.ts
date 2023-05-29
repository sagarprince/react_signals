import { useState } from 'react';

export default function useFormInput(initialValue: any) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e: any) {
    e.persist();
    setValue(e.target.value);
  }

  return {
    value,
    onChange: handleChange,
  };
}
