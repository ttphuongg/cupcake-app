import { useState, useEffect } from 'react';
import { BASE_URL } from '../constants/config';

export const useIngredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://10.159.216.58:5000/api/ingredients')
      .then(res => res.json())
      .then(data => {
        setIngredients(data);
        setLoading(false);
      });
  }, []);

  return { ingredients, loading };
};