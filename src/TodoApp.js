import axios from 'axios';
import { useEffect, useState } from 'react';
import "./todoAppStyle.css";

const TodoApp = () => {

    const [todoList, setTodoList] = useState([]);
    const[newTodo,setNewTodo] = useState('');
    const [editTodo,setEditTodo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [date, setDate] = useState('');
    const [error, setError] = useState('');

    const getAll =()=>{
            axios.get("http://localhost:3100/todo-find-all")
        .then(response => {
          setTodoList(response.data)
        })
        .catch(error => {
    
          console.error('Hata oluştu:', error);
        });
   };

    useEffect(() => {
        getAll();
    },  [])

    const validateInput = () => {
        if (!newTodo.trim()) {
            setError(window.confirm("Todo adı boş olamaz."));
            return false;
        }
        if (!date) {
            setError(window.confirm ("Lütfen geçerli bir tarih seçin."));
            return false;
        }
        setError('');
        return true;
    };

     const handleCreate = async () => {
        if (validateInput()) {
            try {
                
                await axios.post("http://localhost:3100/todo-add", { todo_adi: newTodo,date:date });
                setNewTodo('');
                setDate(''); 
                getAll();
            } catch (error) {
                console.error('Hata oluştu:', error);
            }
        }
    };
    
    const handleUpdate = async () => {
        if (validateInput()) {
            try {
                await axios.post("http://localhost:3100/todo-update", { todo_id: editTodo.todo_id,todo_adi: newTodo,date : date });
                setEditTodo(null); 
                setNewTodo('');
                setDate('') 
                getAll() 
                 setIsEditing(false)
            } catch (error) {
                console.error('Hata oluştu:', error);
            }
        }
    };
   
    const handleDelete = async (todo_id) => {
        if (window.confirm("Bu görevi silmek istediğinize emin misiniz?")) {
            try {
                await axios.post("http://localhost:3100/todo-delete", { todo_id });
                getAll()
            } catch (error) {
                console.error('Hata oluştu:', error);
            }
        }
    };

    const onClick = (selectedTodo) => {
        console.log(selectedTodo);
        setEditTodo(selectedTodo);
        setNewTodo(selectedTodo.todo_adi);
        setIsEditing(true);
        setDate(selectedTodo.date);
       
    };

    return (
        <div className='todo-app-container'>

            <div className='todo-app-list'>
                <h1>Liste</h1>
                <ul>
                   <div className='baslik'> 
                        <h5>Görev Adı    /</h5>
                        <h5>Görev Tarihi</h5> 
                    </div>
                    {
                        todoList.map((item) => {
                            return (
                                <li 
                                 key={item.todo_id} onClick={() => onClick(item)}>{item.todo_adi}   /   {item.date}
                                <button onClick={() => handleDelete(item.todo_id)} className=' btnsil'>Sil</button>
                                </li>
                            )
                        })
                        
                    }
                </ul>

            </div>

            <div className='todo-app-input'>
                    <input
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder='Yeni todo ekle'
                        className={`input ${isEditing ? 'active' : ''}`}
                     /> 
                    <input
                        type='date' 
                        value={date}  
                        onChange={(e)=>setDate(e.target.value)}
                        className='input'
                    />
                       
                         {error && <p className="error">{error}</p>}
            
                    <div className="button">
                            
                        <button onClick={handleCreate} className="btnekle" >Ekle</button>
                        <button onClick={handleUpdate} className="btnguncelle" >Güncelle</button>
                        <button onClick={() => handleDelete(editTodo?.todo_id)} className="  btnsil2">Sil</button>

                    </div>
            </div>
        </div>
    );
};

export default  TodoApp;