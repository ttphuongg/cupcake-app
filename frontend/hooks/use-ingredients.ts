import { useState, useEffect } from 'react';
import { BASE_URL } from '../constants/config';

export const useIngredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
<<<<<<< HEAD
    fetch('http://10.159.216.58:5000/api/ingredients')
=======

    fetch(`${BASE_URL}/design/ingredients`)

>>>>>>> b077e7937758ba9e76638b307b6b2d85e1cf8496
      .then(res => res.json())
      .then(data => {
        setIngredients(data);
        setLoading(false);
      });
  }, []);

  return { ingredients, loading };
};