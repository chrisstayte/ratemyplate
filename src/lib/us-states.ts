'use server';

import { promises as fs } from 'fs';
import path from 'path';

export interface State {
  abbreviation: string;
  name: string;
}

export async function usStates(): Promise<State[]> {
  const filePath = path.join(process.cwd(), 'public', 'data/states.json');
  const response = await fs.readFile(filePath, 'utf8');
  return JSON.parse(response.toString());
}

export async function usStateName(abbreviation: string): Promise<string> {
  const data: State[] = await usStates();

  const state = data.find((state) => state.abbreviation === abbreviation);
  return state ? state.name : 'Invalid state';
}

export async function stateNameValidator(
  abbreviation: string
): Promise<boolean> {
  const data: State[] = await usStates();
  return data.some((state) => state.abbreviation === abbreviation);
}
