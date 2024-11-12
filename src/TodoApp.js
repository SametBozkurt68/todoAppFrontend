import axios from 'axios';
import { useEffect, useState } from 'react';
import "./todoAppStyle.css";
import { FaCheck, FaTrash } from "react-icons/fa";

const TodoApp = () => {

    const [todoList, setTodoList] = useState([]);
    const[newTodo,setNewTodo] = useState('');
    const [editTodo,setEditTodo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const [durum,setDurum] = useState(0); 
    const[aciklama,setAciklma]=useState("");
    const[filterData,setFilterData]=useState([])

    const getAll =()=>{
            axios.get("http://localhost:3100/todo-find-all")
        .then(response => {
          setTodoList(response.data)
          setFilterData(response.data)
        })
        .catch(error => {
    
          console.error('Hata oluştu:', error);
        });
   };

   const getDurum = () => {
    axios.get("http://localhost:3100/durum")    
        .then(response => setDurum(response.data))
        .catch(error => console.error('Kategori verisi alınamadı:', error));
};


    useEffect(() => {
        getAll();
        getDurum();
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
                
                await axios.post("http://localhost:3100/todo-add", { todo_adi: newTodo,date:date,durum:durum });
                setNewTodo('');
                setDate(''); 
                setDurum(0);
                getAll();
            } catch (error) {
                console.error('Hata oluştu:', error);
            }
        }
    };
    
    const handleUpdate = async () => {
        if (validateInput()) {
            try {
                await axios.post("http://localhost:3100/todo-update", { todo_id: editTodo.todo_id,todo_adi: newTodo,date : date, durum:durum , aciklama:aciklama});
                setEditTodo(null); 
                setNewTodo('');
                setDate('') ;
                setDurum(0);
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
        
    const sortTodos = () => {
        const sortedTodos = [...todoList].sort((a, b) => new Date(b.date) - new Date(a.date));
        setFilterData(sortedTodos);
    };
    const Arama=(query)=>{
        
       const bulunanveri = todoList.filter(item => item.todo_adi.toLowerCase().includes(query.toLowerCase()));
       setFilterData(bulunanveri);
    }
    

    const onClick = (selectedTodo) => {
        console.log(selectedTodo);
        setEditTodo(selectedTodo);
        setNewTodo(selectedTodo.todo_adi);
        setIsEditing(true);
        setDate(selectedTodo.date);
        setDurum(selectedTodo.durum)
        setAciklma(selectedTodo.aciklama)
    };

    return (
        <div className='todo-app-container'>

            <div className='todo-app-list'>
                <h1>Liste</h1>
                    <div className='baslik'> 


                    <input
                     onChange={(e) =>Arama(e.target.value)}
                      placeholder='Arama Yap'
                      className='arama'
                    >
                    </input>
   
                
                    
                      < button className='tarihbtn' onClick={sortTodos}>Tarihe Göre Sırala</button>

                      </div>

                        <table className='table'>
                      <thead>
                    <tr>
                        <th>Durum İcon </th> 

                        <th>Görev Adı </th>  
                        <th>Görev Tarihi </th>
                        <th>Durum </th>
                        <th>Acıklama</th>
                        <th>İşlem </th>
                    </tr>

                      </thead>
                      <tbody>
                
                      {
                        filterData.map((item) => {

                            return (
  <>
                                                            
                                      
                                                
                                    <tr  key={item.todo_id} onClick={() => onClick(item)} className={item.todo_id===editTodo?.todo_id ? "active" : ""}>
                                        <td>        <FaCheck color={item.durum === 1 ? "blue" : item.durum === 2 ? "green" : "red"} /> </td>
                                        <td>{item.todo_adi}</td>
                                        <td>{new Date(item.date).toLocaleDateString()}</td>
                                        <td style={{color:item.durum ===2?"green":item.durum===1?"blue": "red"}}>
                                        {item.durum === 1 ? "Yeni iş" : item.durum === 2 ? "Tamamlanmış iş" : item.durum === 3 ? "Tamamlanmamış iş" : ""}
                                        </td>
                                        <td>{item.aciklama}</td>
                                        <td>
                                        <button onClick={() => handleDelete(item.todo_id)} className=' btnsil'><FaTrash color={"red"} /></button> 
                                        </td>
                                                            
                                    </tr> 
                                                   
                                        
                                           
                                  
                                  
           
                                </>
                               
                            ) 

                        })
                        
                    }     
                      </tbody>

                 
              
                     
                 
                    
                      </table>
                    
            

            </div>

            <div className='todo-app-input'>

             <select
                    value={durum}
                    onChange={(e) =>setDurum(e.target.value)}
                    className='input'
                >     
                      <option value="1">Yeni iş</option>
                      <option value="2">Tamamlanan iş</option>
                      <option value="3">Tamamlanmamış iş</option>
           
                </select>

                    <input
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder='Yeni todo ekle'
                        className={`input ${isEditing ? 'active' : ''}`}
                        maxLength={255}
                     /> 
                    
                    <input
                        type='date' 
                        value={date}  
                        onChange={(e)=>setDate(e.target.value)}
                        className='input'
                    />  
                     {parseInt(durum)===3? (   <input
                        value={aciklama}
                        onChange={(e) => setAciklma(e.target.value)}
                        placeholder='Acıklama giriniz'
                        className={`input`}
                 
                     /> ) : ""}
                       
                       
            
                    <div className="button">
                            
                        <button onClick={handleCreate} className="btnekle" disabled ={isEditing } >Ekle</button>
                        <button onClick={handleUpdate} className="btnguncelle" >Güncelle</button>
                        <button onClick={() => handleDelete(editTodo?.todo_id)} className="  btnsil2">Sil</button>

                    </div>
            </div>
        </div>
    );
};

export default  TodoApp;