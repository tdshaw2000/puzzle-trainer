import { mountL2C } from '../trainers/l2c/screen';
import { mountL2E } from '../trainers/l2e/screen';

export interface Trainer {
  id: string;
  name: string;
  /** Renders the trainer into `container`; returns a cleanup function. */
  mount(container: HTMLElement): () => void;
}

export interface Puzzle {
  id: string;
  name: string;
  trainers: Trainer[];
}

export const PUZZLES: Puzzle[] = [
  {
    id: '5x5',
    name: '5x5',
    trainers: [
      { id: 'l2c', name: 'Last Two Centres', mount: (c) => mountL2C(c) },
      { id: 'l2e', name: 'Last Two Edges', mount: (c) => mountL2E(c) },
    ],
  },
];
