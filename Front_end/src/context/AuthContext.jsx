import { useState,useEffect,createContext,useContext, Children } from "react";
import API from "../axios/axios";
const AuthContext =createContext();
export const AuthProvider = ({children})=>{
 const [user,setUser]=useState(null);
 const [ loading,SetLoading]= useState(true);

 const fetchUser = async()=>{
  try {
   const res= await API.get("/user/getme")
   if(res.data){ setUser(res.data.userinfo);
   }
  } catch (error) {
    console.log(error.message)
   setUser(null);
  }
  finally{
   SetLoading(false);
  }
 }
 const logout = () => {
    setUser(null);
  };

 useEffect (()=>{
  const publicPath =['/login','/register','/']
;
   if(!publicPath.includes (window.location.pathname )){
    fetchUser();
   }
   else{
    SetLoading(false);
   }
  
 },[])
 return (
  <AuthContext.Provider value={{ user, loading, fetchUser, logout}}>
   {children}
  </AuthContext.Provider>
 )
}

const useAuth = () => useContext(AuthContext);
export default useAuth;
