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
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  ariaInvalid?: boolean;
}

const StatePicker: React.FC<StatePickerProps> = ({
  id,
  value,
  onValueChange,
  ariaInvalid,
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
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger
        id={id}
        className="w-ful bg-card"
        aria-invalid={ariaInvalid}
      >
        <SelectValue className="text-[16px]" placeholder="Select a state" />
      </SelectTrigger>
      <SelectContent position="popper" className="text-[16px] max-h-60">
        {states.map((state) => (
          <SelectItem
            className="text-[16px]"
            key={state.abbreviation}
            value={state.abbreviation}
          >
            {state.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatePicker;
