import { differenceBy, sampleSize, shuffle, random } from 'lodash';
import { AppState, Group, Groups, Priorities } from '@/js/core/state';

export type IdPair = { id: string; candidateId: string };
export type MatchResults = Array<IdPair>;

export default class Matcher {
  appState: AppState;

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
      const filteredGroups = this.filterByPriority(this.shuffle(groups), id);
      const filteredCandidates = sampleSize(
        this.filterByPriority(this.shuffle(candidates), id),
        filteredGroups.length
      );

      results.push(
        ...this.mapResult(this.shuffle(filteredGroups), this.shuffle(filteredCandidates))
      );

      const groupIds = filteredGroups.map((group): { id: string } => ({
        id: group.id,
      }));
      groups = differenceBy(groups, groupIds, 'id') as Groups;

      const candidateIds = filteredCandidates.map((group) => ({ id: group.id }));
      candidates = differenceBy(candidates, candidateIds, 'id') as Groups;
    });

    if (groups.length > 0) {
      results.push(...this.mapResult(this.shuffle(groups), this.shuffle(candidates)));
    }

    return results;
  }

  private filterByPriority(candidates: Array<Group>, id: string) {
    return this.shuffle(candidates.filter(({ priorityId }) => priorityId === id));
  }

  matchSimple(groups: Groups, candidates: Groups): MatchResults {
    return this.mapResult(this.shuffle(groups), this.shuffle(candidates));
  }

  private shuffle(groups: Groups): Groups {
    let result = groups;
    const iterationCount = random(1, 64, false);

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

    this.appState.state.results = results;
    console.log(results);

    return results;
  }
}
