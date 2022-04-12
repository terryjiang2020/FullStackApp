import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function CreateUser() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://localhost:8005/api/', inputs).then(function (response) {
      console.log(response.data);
      navigate('/');
    });
  };
  return (
    <div>
      <h1>Create Users</h1>
      <form onSubmit={handleSubmit}>
        <label>Name: </label>
        <input type="text" name="name" onChange={handleChange} />
        <br />
        <label>Email: </label>
        <input type="text" name="email" onChange={handleChange} />
        <br />
        <label>Mobile: </label>
        <input type="text" name="mobile" onChange={handleChange} />
        <br />
        <button>Save</button>
      </form>
    </div>
  );
}
