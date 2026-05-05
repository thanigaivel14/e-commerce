import { useState,useEffect,createContext,useContext, Children } from "react";
import API from "../axios/axios";


const ProductContext = createContext();
export const ProductProvider = ({children})=>{
const [productList,setProductlist]= useState([]);
const fetchProduct = async () => {
   const res= await API.get("/product/all");
    setProductlist(res.data);
}
useEffect(()=>{
fetchProduct();
},[])




    return(
        <ProductContext.Provider value={{productList,fetchProduct,setProductlist}}>
            {children}
        </ProductContext.Provider>
    )
}

const useProduct = ()=>useContext(ProductContext);

export default useProduct;