import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { ListUser } from './components/ListUser';
import { CreateUser } from './components/CreateUser';
import { ListAllReceipes } from './components/ListAllReceipes';
import { CreateReceipes } from './components/CreateReceipes';

function App() {
  return (
    <div className="App">
      <h5>FullStackApp using React, PHP and MySQL </h5>

      <BrowserRouter>
        <nav>
          <ul>
            <li>
              <Link to="/">List Users</Link>
            </li>
            <li>
              <Link to="/list">List Receipes</Link>
            </li>
            <li>
              <Link to="user/create">Create Users</Link>
            </li>
            <li>
              <Link to="user/create/receipes">Create Receipes</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route index element={<ListUser />} />
          <Route path="user/create" element={<CreateUser />} />
          <Route path="/list" element={<ListAllReceipes />} />
          <Route path="/user/create/receipes" element={<CreateReceipes />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
