import { useState } from "react"
import axios from "axios";

export default function FindIdPage(){

    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [username,setUsername]= useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (e)=>{

        e.preventDefault();
        //axios 요청 
        const requestData ={
            username: username,
            email: email,
        };
        try{
            const response = await axios.post('https://jsonplaceholder.typicode.com/posts', requestData, {
               
            });
            console.log('서버 응답:', response.data);
            if(response.data.usersId){
            setMessage('아이디:'+response.data.usersId)
            setIsError(false);
            }else {
                setMessage('조회된 아이디가 없습니다');
                setIsError(true);
            } //나중에 백엔드 형식에 맞추기 
        }catch(error){
            console.log('전송된 데이타:', requestData);
            setMessage('DB 연결 후 제공');
        
        };
        
    };

    return<>
    <div className="login-container">
        <h1 className="login-title">아이디 찾기</h1>
        <form className="login-form" onSubmit={handleSubmit}>
            <input 
                type="text"
                placeholder="이름 입력"
                required
                className="login-input"
                value={username}
                onChange={(e)=> setUsername(e.target.value)}
            />
            <input
                type="email"
                placeholder="가입한 이메일"
                required
                className="login-input"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
            />
            <button type="submit" className="login-button">
                아이디 찾기
            </button>
        </form>
        {message && (
        <p className={`info-message ${isError ? 'error-message' : ''}`}>
            {message}
        </p>
        )}    
    </div>
    
    
    </>
}

