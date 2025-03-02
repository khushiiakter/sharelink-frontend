import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchAccessCount = async (linkId) => {
  const { data } = await axios.get(`http://localhost:5000/analytics/${linkId}`);
  return data;
};

const AnalyticsPage = ({ linkId }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["accessCount", linkId],
    queryFn: () => fetchAccessCount(linkId),
    refetchInterval: 3000, 
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching access count</p>;

  return (
    <div>
      <p>Access Count: {data?.accessCount || 0}</p>
    </div>
  );
};

export default AnalyticsPage;
