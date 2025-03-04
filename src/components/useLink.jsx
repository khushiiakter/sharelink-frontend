import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";

const useLink = () => {
    const { user } = useContext(AuthContext);
    const { data: links = [], refetch } = useQuery({
      queryKey: ["links", user?.email],
      queryFn: async () => {
        const res = await axios.get(`https://sharelink-server-five.vercel.app/links?email=${user?.email}`);
        return res.data;
      },
    });
    return [links, refetch];
  };



export default useLink;
