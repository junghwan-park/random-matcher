import { AppState, Groups } from '@/js/core/state';
import GroupItem from '@/js/ui/groupItem';

export default class GameArea {
  appState: AppState;

  el: HTMLDivElement | null = null;

  groupList: HTMLDivElement | null = null;

  candidateList: HTMLDivElement | null = null;

  constructor(appState: AppState) {
    this.appState = appState;

    this.render();
  }

  render(): HTMLDivElement {
    this.el = document.createElement('div');
    this.el.className = 'game-area';

    const { groups, candidates } = this.appState.state;

    this.groupList = this.renderGroups(groups);
    this.groupList.className = 'group-list';

    this.candidateList = this.renderGroups(candidates);
    this.groupList.className = 'candidate-list';

    this.el.appendChild(this.groupList);
    this.el.appendChild(this.candidateList);

    return this.el;
  }

  renderGroups(groups: Groups): HTMLDivElement {
    const groupList = document.createElement('div');

    groups.forEach((group) => {
      const groupItem = new GroupItem(group);

      groupList.appendChild(groupItem.render());
    });

    return groupList;
  }

  destroy(): void {
    // @TODO : Detach event listeners
  }
}
