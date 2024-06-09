'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface State {
  abbreviation: string;
  name: string;
}

const StatePicker: React.FC = () => {
  const [states, setStates] = useState<State[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/states.json');
      const data: State[] = await response.json();

      setStates(data);
    };
    fetchData();
  }, []);

  return (
    <Select>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Select a state' />
      </SelectTrigger>
      <SelectContent>
        {states.map((state) => (
          <SelectItem key={state.abbreviation} value={state.abbreviation}>
            {state.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatePicker;
