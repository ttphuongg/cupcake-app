import { useState, useEffect } from 'react';
import { ENDPOINTS } from '../constants/endpoints';
import { Ingredient } from '../types';

export const useIngredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(ENDPOINTS.DESIGN.INGREDIENTS)
      .then(res => res.json())
      .then(data => {
        setIngredients(data);
        setLoading(false);
      });
  }, []);

  return { ingredients, loading };
};