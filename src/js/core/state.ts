import { MatchResults } from '@/js/core/matcher';

export type Priority = {
  id: string;
};
export type Priorities = Array<Priority>;
export type Group = {
  name: string;
  id: string;
  imgSrc: string;
  type: string;
  priorityId: string;
};
export type Groups = Array<Group>;

// eslint-disable-next-line no-shadow
export enum GroupProps {
  NAME = 'name',
  ID = 'id',
  TYPE = 'type',
  PRIORITY_ID = 'priorityId',
}

type State = {
  groups: Groups;
  candidates: Groups;
  priorities: Priorities;
  results: MatchResults;
};

const defaultState = {
  groups: [],
  candidates: [],
  priorities: [],
};

export class AppState {
  state: State = { ...defaultState };

  clearState(): void {
    this.state = { ...defaultState };
  }

  clearGroups(): void {
    this.state.groups = [];
  }

  clearCandidates(): void {
    this.state.candidates = [];
  }

  clearPriorities(): void {
    this.state.priorities = [];
  }

  setCandidates(candidates: Groups): void {
    this.state.candidates = candidates;
  }

  getCandidates(): Groups {
    return this.state.candidates;
  }

  setPriorities(priorities: Priorities): void {
    this.state.priorities = priorities;
  }

  setGroups(groups: Groups): void {
    this.state.groups = groups;
  }

  getGroups(): Groups {
    return this.state.groups;
  }
}

export default new AppState();
