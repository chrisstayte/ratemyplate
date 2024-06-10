'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { State, usStates } from '@/lib/us-states';

interface StatePickerProps {
  onValueChange: (value: string) => void;
  defaultValue: string;
}

const StatePicker: React.FC<StatePickerProps> = ({
  onValueChange,
  defaultValue,
}) => {
  const [states, setStates] = useState<State[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data: State[] = await usStates();

      setStates(data);
    };
    fetchData();
  }, []);

  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
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