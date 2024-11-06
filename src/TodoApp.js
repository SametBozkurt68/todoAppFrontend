
import axios from 'axios';
import { useEffect, useState } from 'react';

import "./todoAppStyle.css"

const TodoApp = () => {

        const [todoList, setTodoList] = useState([])
        const[newTodo,setNewTodo] = useState('');
        const [editTodo,setEditTodo] = useState(null);
        const [isEditing, setIsEditing] = useState(false);


        const getAll =()=>{
            axios.get("http://localhost:3100/todo-find-all")
        .then(response => {
          setTodoList(response.data)
        })
        .catch(error => {
    
          console.error('Hata oluştu:', error);
        });
            
        }
    useEffect(() =>  {
       
    
        getAll()



    },  [])

     const handleCreate = async () => {
        if (newTodo) {
            try {
                
                await axios.post(`http://localhost:3100/todo-add`, { todo_adi: newTodo });
                setNewTodo(''); 
                getAll()
            } catch (error) {
                console.error('Hata oluştu:', error);
            }
        }
    };
    
    const handleUpdate = async () => {
        if (editTodo && newTodo) {
            try {
                await axios.post(`http://localhost:3100/todo-update`, {
                    todo_id: editTodo.todo_id,
                    todo_adi: newTodo
                });
                setEditTodo(null); 
                setNewTodo(''); 
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
                await axios.post(`http://localhost:3100/todo-delete`, { todo_id });
                getAll()
            } catch (error) {
                console.error('Hata oluştu:', error);
            }
        }
    };


    

    const onClick = (selectedTodo) => {
        console.log(selectedTodo);
        setEditTodo(selectedTodo)
        setNewTodo(selectedTodo.todo_adi);
        setIsEditing(true);
    }
        

    return (
        <div className='todo-app-container'>
          
            <div className='todo-app-list'>
                <h1>Liste</h1>
                <ul>
                    {
                        todoList.map((item) => {
                            return (
                                <li key={item.todo_id} onClick={() => onClick(item)}>{item.todo_adi}
                                <button onClick={() => handleDelete(item.todo_id)} className='button btnsil'>Sil</button></li>
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
                    
            
                    <div className="button">
                        
                      <button onClick={handleCreate} className="btnekle" >Ekle</button>
                      <button onClick={handleUpdate} className="btnguncelle" >Güncelle</button>
                      <button onClick={() => handleDelete(editTodo?.todo_id)} className="button btnsil2">Sil</button>

                    </div>
            </div>


        </div>
    )

    
}



export default  TodoApp


