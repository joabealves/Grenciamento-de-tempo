import './App.css';
import { useState, useEffect } from 'react';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill, BsFillPieChartFill } from "react-icons/bs";

const API = "http://localhost:5000";

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  //Load todos on page Load
  useEffect(() => {

    const loadData = async () => {
      setLoading(true)
      const res = await fetch(API + "/todos")
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));

      setLoading(false);
      setTodos(res);

    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Enviou!");    

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,

    };
    await fetch(API + "/todos/", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setTodos((prevState) => [...prevState, todo]);
    setTitle(" ");
    setTime(" ");

  };

  const handleDelete = async (id) => {

    await fetch(API + "/todos/" + id, {
      method: "DELETE",
    });

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));

  };

  const handleEdit = async (todo) =>{
    todo.done = !todo.done;
   const data = await BsFillPieChartFill(API + "/todos/" + todo.id,{
      method: "PUT",
      body:JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) => prevState.map((T) => (T.id === data.id ? (T = data) : T )));

  };

  if (loading) {
    return <p>Carregando...</p>;
  };

  return (
    <div className="App">
      <div className="todo-header">
        <h1>Gerencie suas tarefas </h1>
      </div>

      <div className="form-todo">
        <h2>Insira sua próxima tarefa</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">Qual tarefa deseja fazer ?</label>
            <input type="text" name="title" placeholder="Título da tarefa"
              onChange={(e) => setTitle(e.target.value)}
              value={title || ""} required />
          </div>

          <div className="form-control">
            <label htmlFor="time">Duração:</label>
            <input type="time" name="time"
              onChange={(e) => setTime(e.target.value)}
              value={time || ""} required />
          </div>
          <input type="Submit" value="Criar Tarefa" />
        </form>
      </div>

      <div className="list-todo">
        <h2>Sua lista de tarefas:</h2>
        {todos.length === 0 && <p>Não há tarefas !</p>}
        {todos.map((todo) => (
          <div className="todo" key={todo.id}>

            <h3 className={todo.done ? "todo-done" : " "}>{todo.title}</h3>
            <p>Duração: {todo.time}</p>
            <div className="actions">
              <spam onClick={() => handleEdit(todo)} >
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </spam>
              <BsTrash onClick={() => handleDelete(todo.id)} />
           
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
