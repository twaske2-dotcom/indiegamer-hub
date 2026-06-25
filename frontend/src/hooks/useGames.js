import { useState, useEffect } from 'react';
import axios from 'axios';

export const useGames = (filters = {}) => {
  const [games,   setGames]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(filters).toString();
    axios.get(`/api/games?${params}`)
      .then(res => setGames(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  return { games, loading, error };
};

export const useTrending = () => {
  const [trending, setTrending] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    axios.get('/api/games/trending')
      .then(res => setTrending(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { trending, loading };
};
