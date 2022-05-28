import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function CreateReceipes() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    photo: "",
    ingredients: [],
    instructions: "",
    difficulty: "",
  });
    const [ingredients, setIngredients] = useState([
      { id: 1, name: "", amount: "" },
    ]);
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('/api/recipes/add', inputs).then(function (response) {
      console.log(response.data);
      setInputs({
        name: "",
        photo: "",
        instructions: "",
        difficulty: "",
      });
      setIngredients([
        {
          name: "",
          amount: "",
        },
      ]);
      navigate('/list');
    });
  };

  const changeIngredients = (e, i) => {
    const { name, value } = e.target;
    const ingrList = [...ingredients];
    ingrList[i][name] = value;
    setIngredients(ingrList);
    setInputs({ ...inputs, ingredients: ingredients });
  };

  const addMoreIngredients = (e) => {
    e.preventDefault();
    const newIngr = {
      id: ingredients.length + 1,
      name: "",
      amount: "",
    };
    setIngredients([...ingredients, newIngr]);
  };



  return (
    <div>
      <h1>Create Receipes</h1>
      <form onSubmit={handleSubmit}>
        <label>Name: </label>
        <input type="text" name="name"  id="name"
              value={inputs.name} onChange={handleChange} />
        <br />
        <label>instructions: </label>
        <input type="text" id="instructions"
              value={inputs.instructions} name="instructions" onChange={handleChange} />
        <br />
        <label>difficulty: </label>
        <input type="text" name="difficulty" 
        id="difficulty"
        value={inputs.difficulty}
        onChange={handleChange} />
        <br />
        <label>photo: </label>
        <input type="text" name="photo" id="photo"
        value={inputs.photo}
        onChange={handleChange} />
        <br />

        {ingredients.map((_, i) => {
            return (
              <div key={i}>
                <div>
                  <label htmlFor="ingredient">Ingredient</label>
                  <input
                    className="ingredient"
                    type="text"
                    name="name"
                    id="name"
                    onChange={(e) => changeIngredients(e, i)}
                  />
                </div>
                <div>
                  <label htmlFor="amount">Quantity</label>
                  <input
                    className="quantity"
                    type="text"
                    name="amount"
                    id="amount"
                    onChange={(e) => changeIngredients(e, i)}
                  />
                </div>
              </div>
            );
          })}
        <button onClick={addMoreIngredients}>Add more ingredients</button>
        <button>Save</button>
      </form>
    </div>
  );
}
