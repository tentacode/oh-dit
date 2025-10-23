// hooks/useRuleSets.js
import { useState, useEffect } from 'react';
import { getAuthToken } from '../../authentication/utils/getAuthToken';
import { RuleSet } from '../types/RuleSetTypes';

export function useGetRuleSets() {
  const [ruleSets, setRuleSets] = useState<RuleSet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    async function fetchRuleSets() {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/rule_sets`, {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data = await response.json();
        setRuleSets(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchRuleSets();
  }, []);

  return { ruleSets, isLoading, error };
}