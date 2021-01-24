import { differenceBy, sampleSize, shuffle, random } from 'lodash';
import { AppState, Group, Groups, Priorities } from '@/js/core/state';

export type IdPair = { id: string; candidateId: string };
export type MatchResults = Array<IdPair>;

export default class Matcher {
  appState: AppState;

  results: MatchResults = [];

  constructor(appState: AppState) {
    this.appState = appState;
  }

  get groups(): Groups {
    return this.appState.state.groups;
  }

  get candidates(): Groups {
    return this.appState.state.candidates;
  }

  get priorities(): Priorities {
    return this.appState.state.priorities;
  }

  get hasPriorityPolicies(): boolean {
    return this.priorities.length > 0;
  }

  matchWithPriority(): MatchResults {
    const results: MatchResults = [];
    let groups: Groups = [...this.groups];
    let candidates: Groups = [...this.candidates];

    this.priorities.forEach(({ id }) => {
      const filteredGroups = this.filterByPriority(groups, id);
      const filteredCandidates = this.filterByPriority(candidates, id);

      results.push(...this.mapResult(filteredGroups, filteredCandidates));

      const groupIds = filteredGroups.map((group): { id: string } => ({
        id: group.id,
      }));
      groups = differenceBy(groups, groupIds, 'id') as Groups;

      const candidateIds = sampleSize(
        filteredCandidates.map((group) => ({ id: group.id })),
        groupIds.length
      );
      candidates = differenceBy(candidates, candidateIds, 'id') as Groups;
    });

    if (groups.length > 0) {
      results.push(...this.mapResult(groups, candidates));
    }

    return results;
  }

  private filterByPriority(candidates: Array<Group>, id: string) {
    return this.shuffle(candidates.filter(({ priorityId }) => priorityId === id));
  }

  matchSimple(groups: Groups, candidates: Groups): MatchResults {
    return this.mapResult(this.shuffle(groups), candidates);
  }

  private shuffle(groups: Array<Group>) {
    let result = groups;
    const iterationCount = random(1, 64, false);
    console.log(iterationCount);

    for (let i = 0; i <= iterationCount; i += 1) {
      result = shuffle(groups);
    }

    return result;
  }

  private mapResult(shuffledGroup: Groups, candidates: Array<Group>): MatchResults {
    return shuffledGroup.map(
      ({ id }, index): IdPair => ({
        id,
        candidateId: candidates[index].id,
      })
    );
  }

  match(): MatchResults {
    let results = [];

    if (this.hasPriorityPolicies) {
      results = this.matchWithPriority();
    } else {
      results = this.matchSimple(this.groups, this.candidates);
    }

    this.results = results;

    return results;
  }
}
