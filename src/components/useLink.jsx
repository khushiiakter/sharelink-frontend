import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";

const useLink = () => {
  // Fetch all links of the user
  
  const { user } = useContext(AuthContext);
    const {data: links = [],  refetch} = useQuery({
        queryKey: ["links", user?.email], 
        queryFn: async() =>{
            const res = await axios.get(`http://localhost:5000/links?email=${user?.email}`);
            return res.data;
        }
    })


    return [links, refetch]
};


export default useLink;
