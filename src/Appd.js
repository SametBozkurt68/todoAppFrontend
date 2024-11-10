    import axios from 'axios';
    import { useEffect, useState } from 'react';
    import "./todoAppStyle.css";

    const TodoApp = () => {
        const [todoList, setTodoList] = useState([]);
        const [newTodo, setNewTodo] = useState('');
        const [editTodo, setEditTodo] = useState(null);
        const [isEditing, setIsEditing] = useState(false);
        const [date, setDate] = useState('');
        const [kategori, setKategori] = useState('');
        const [durum,setDurum] = useState(0);
        const [kategoriListesi, setKategoriListesi] = useState([]); // Kategorileri saklayacak state
        const [error, setError] = useState('');

        const getAll = () => {
            axios.get("http://localhost:3100/todo-find-all")
                .then(response => setTodoList(response.data))
                .catch(error => console.error('Hata oluştu:', error));
        };

        const getCategories = () => {
            axios.get("http://localhost:3100/categories") // Kategori endpointine istek
                .then(response => setDurum(response.data))
                .catch(error => console.error('Kategori verisi alınamadı:', error));
        };

        useEffect(() => {
            getAll();
            getCategories(); // Sayfa yüklendiğinde kategorileri çek
        }, []);

        const validateInput = () => {
            if (!newTodo.trim()) {
                alert("Todo adı boş olamaz.");
                return false;
            }
            if (!date) {
                alert("Lütfen geçerli bir tarih seçin.");
                return false;
            }

            setError('');
            return true;
        };

        const handleResetForm = () => {
            setNewTodo('');
            setDate('');
            setEditTodo(null);
            setIsEditing(false);
            setKategori('');
            setError('');
        };

        const handleCreate = async () => {
            if (validateInput()) {
                try {
                    await axios.post("http://localhost:3100/todo-add", {
                        todo_adi: newTodo,
                        date,
                        durum
                    });
                    handleResetForm();
                    getAll();
                } catch (error) {
                    console.error('Hata oluştu:', error);
                }
            }
        };

        const handleUpdate = async () => {
            if (validateInput() && editTodo) {
                try {
                    await axios.put(`http://localhost:3100/todo-update/${editTodo.todo_id}`, {
                        todo_adi: newTodo,
                        date,
                        durum
                    });
                    handleResetForm();
                    getAll();
                } catch (error) {
                    console.error('Hata oluştu:', error);
                }
            }
        };

        const handleDelete = async (todo_id) => {
            if (window.confirm("Bu görevi silmek istediğinize emin misiniz?")) {
                try {
                    await axios.delete(`http://localhost:3100/todo-delete/${todo_id}`);
                    getAll();
                } catch (error) {
                    console.error('Hata oluştu:', error);
                }
            }
        };

        const onClick = (selectedTodo) => {
            setEditTodo(selectedTodo);
            setNewTodo(selectedTodo.todo_adi);
            setIsEditing(true);
            setDate(selectedTodo.date);
            setKategori(selectedTodo.kategori);
        };

        return (
            <div className='todo-app-container'>
                <div className='todo-app-list'>
                    <h1>Liste</h1>
                    <ul>
                        <div className='baslik'>
                            <h5>| Görev Adı |</h5>
                            <h5>Görev Tarihi |</h5>
                            <h5>Durum |</h5>
                        </div>
                        {todoList.map((item) =>{
                            return <>
                            <li key={item.todo_id} onClick={() => onClick(item)}>
                            | {item.todo_adi} | {item.date} |  {item.kategori}  {item.durum ===0 ? "Yeni iş": item.durum ===1 ? "Tamamlanmış iş" :"Tamamlanmamış iş"}
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(item.todo_id); }} className='btnsil'>Sil</button>
                    
                        </li>
                        </>
                        })}
                    </ul>
                </div>  
                

                <div className='todo-app-input'>

                <select
                        value={durum}
                        onChange={(e) =>setDurum(e.target.value)}
                        className='input'
                    >
                        <option value="0">Yeni iş</option>
                        <option value="1">Tamamlanan iş</option>
                        <option value="2">Tamamlanamayan iş</option>
            
                    </select>

                    <input
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder='Yeni todo ekle'
                        className={`input ${isEditing ? 'active' : ''}`}
                    />
                    <input
                        type='date'
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className='input'
                    />
                    


                    {error && <p className="error">{error}</p>}

                    <div className="button">
                        {!isEditing ? (
                            <button onClick={handleCreate} className="btnekle">Ekle</button>
                        ) : (
                            <>
                                <button onClick={handleUpdate} className="btnguncelle">Güncelle</button>
                                <button onClick={() => handleDelete(editTodo?.todo_id)} className="btnsil2">Sil</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    export default TodoApp;
