import axios from 'axios';
import { useEffect, useState } from 'react';

export function ListAllReceipes() {
  const [name, setName] = useState([]);
  useState({
    name: "",
    photo: "",
    ingredients: [],
    instructions: "",
    difficulty: "",
  });
  useEffect(() => {
    getAllReceipes();
  }, []);

  function getAllReceipes() {
    axios.get('/api/recipes/all').then(function (response) {
      console.log(response.data);
      setName(response.data);
    });
  }

  return (
    <div>
      <h1>List Receipes</h1>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>instructions</th>
            <th>difficulty</th>
            <th>ingredient</th>
          </tr>
        </thead>
        <tbody>
          {name.map((name, key) => (
            <tr key={key}>
              <td>{name.id}</td>
              <td>{name.name}</td>
              <td>{name.instructions}</td>
              <td>{name.difficulty}</td>
              <td>{name.ingredient}</td>
              {name.ingredients.map((p) => (
              <p>
               {p.id} | {p.name} | {p.amount}
              </p>
            ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
