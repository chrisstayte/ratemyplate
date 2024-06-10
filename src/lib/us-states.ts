'use server';

import { promises as fs } from 'fs';
import path from 'path';

export interface State {
  abbreviation: string;
  name: string;
}

export async function usStates(): Promise<State[]> {
  const filePath = path.join(process.cwd(), 'public', 'states.json');
  const response = await fs.readFile(filePath, 'utf8');
  return JSON.parse(response.toString());
}

// write a function to take an abbreviation of a US state and return the full name of the state
//
export async function usStateName(abbreviation: string): Promise<string> {
  const data: State[] = await usStates();

  const state = data.find((state) => state.abbreviation === abbreviation);
  return state ? state.name : 'Invalid state';
}
