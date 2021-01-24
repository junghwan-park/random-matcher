import { find } from 'lodash';
import { AppState, Groups } from '@/js/core/state';
import GroupItem from '@/js/ui/groupItem';
import Matcher, { IdPair } from '@/js/core/matcher';

function getCoupleElId(index: number) {
  return `couple-result-panel-${index}`;
}

export default class GameArea {
  appState: AppState;

  matcher: Matcher;

  el: HTMLDivElement | null = null;

  groupList: HTMLDivElement | null = null;

  candidateList: HTMLDivElement | null = null;

  resultWrapper: HTMLDivElement | null = null;

  creditWrapper: HTMLDivElement | null = null;

  couples: HTMLDivElement[] | [] = [];

  matchBtn: HTMLButtonElement | null = null;

  nextBtn: HTMLButtonElement | null = null;

  closeBtn: HTMLButtonElement | null = null;

  coupleIndex = -1;

  constructor(appState: AppState, matcher: Matcher) {
    this.appState = appState;
    this.matcher = matcher;

    this.render();
  }

  render(): HTMLDivElement {
    this.el = document.createElement('div');
    this.el.className = 'game-area';

    this.renderGrid();

    this.matchBtn = document.createElement('button');
    this.matchBtn.className = 'btn match-btn';
    this.matchBtn.textContent = 'Match!';
    this.el.insertBefore(this.matchBtn, this.candidateList);

    this.resultWrapper = this.renderResult();
    this.el.appendChild(this.resultWrapper);

    this.bindEvent();

    return this.el;
  }

  private renderGrid() {
    const { groups, candidates } = this.appState.state;

    this.groupList = this.renderGroups(groups);
    this.groupList.className = 'group-list';

    this.candidateList = this.renderGroups(candidates);
    this.candidateList.className = 'candidate-list';

    this.el!.appendChild(this.groupList);
    this.el!.appendChild(this.candidateList);
  }

  renderGroups(groups: Groups): HTMLDivElement {
    const groupList = document.createElement('div');

    groups.forEach((group) => {
      const groupItem = new GroupItem(group);

      groupList.appendChild(groupItem.render());
    });

    return groupList;
  }

  renderResult(): HTMLDivElement {
    const resultWrapper = document.createElement('div');
    resultWrapper.className = 'result-wrapper hide';

    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'button-wrapper';

    this.nextBtn = document.createElement('button');
    this.nextBtn.className = 'btn next-btn';
    this.nextBtn.textContent = 'Next >>';
    buttonWrapper.appendChild(this.nextBtn);

    this.closeBtn = document.createElement('button');
    this.closeBtn.className = 'btn next-btn hide';
    this.closeBtn.textContent = 'Close (X)';
    buttonWrapper.appendChild(this.closeBtn);

    resultWrapper.appendChild(buttonWrapper);

    return resultWrapper;
  }

  renderResultPanel(idPair: IdPair, index: number): HTMLDivElement {
    const coupleWrapper = document.createElement('div');
    coupleWrapper.className = 'couple-wrapper transition-show invisible';
    coupleWrapper.id = getCoupleElId(index);

    const { candidates, groups } = this.appState.state;

    const group = find(groups, ({ id }): boolean => idPair.id === id);
    const candidate = find(candidates, ({ id }): boolean => idPair.candidateId === id);
    const groupItem = new GroupItem(group);
    const candidateItem = new GroupItem(candidate);

    coupleWrapper.appendChild(groupItem.render());
    coupleWrapper.appendChild(candidateItem.render());

    return coupleWrapper;
  }

  destroy(): void {
    // @TODO : Detach event listeners
  }

  onClickMatch = (): void => {
    if (this.creditWrapper) {
      this.el?.removeChild(this.creditWrapper);
      this.renderGrid();
    }

    this.matcher.match();
    this.matchBtn?.classList.add('hide');

    const { results } = this.appState.state;

    this.couples = results.map((idPair, index) => this.renderResultPanel(idPair, index));

    this.resultWrapper?.appendChild(this.couples[0]);
    setTimeout(() => {
      this.couples[0].classList.remove('invisible');
    }, 500);

    this.coupleIndex = 0;

    this.resultWrapper?.classList.remove('hide');
  };

  onClickNext = (): void => {
    if (this.coupleIndex >= 0) {
      const prevCoupleElement = document.getElementById(getCoupleElId(this.coupleIndex));

      if (prevCoupleElement) {
        this.resultWrapper?.removeChild(prevCoupleElement);
      }
    }

    const nextIndex = this.coupleIndex + 1;

    this.resultWrapper?.appendChild(this.couples[nextIndex]);

    setTimeout(() => {
      this.couples[nextIndex].classList.remove('invisible');
    }, 500);

    this.coupleIndex += 1;

    if (this.coupleIndex === this.couples.length - 1) {
      this.nextBtn?.classList.add('hide');
      this.closeBtn?.classList.remove('hide');
    }
  };

  onClickClose = (): void => {
    this.nextBtn?.classList.remove('hide');
    this.closeBtn?.classList.add('hide');
    this.resultWrapper?.classList.add('hide');
    this.matchBtn?.classList.remove('hide');
    this.matchBtn?.classList.add('re-match');

    this.matchBtn!.textContent = 'Re-Match (optional)';

    const prevCoupleElement = document.getElementById(getCoupleElId(this.coupleIndex));

    if (prevCoupleElement) {
      this.resultWrapper?.removeChild(prevCoupleElement);
    }

    this.coupleIndex = 0;

    this.renderResultCredit();
  };

  renderResultCredit(): void {
    if (this.groupList) {
      this.el!.removeChild(this.groupList);
    }
    if (this.candidateList) {
      this.el!.removeChild(this.candidateList);
    }

    this.el?.classList.add('result-credit');

    const { results } = this.appState.state;
    this.creditWrapper = document.createElement('div');
    this.creditWrapper.className = 'credit-wrapper';

    this.el?.appendChild(this.creditWrapper);

    results.forEach((idPair, index) =>
      this.creditWrapper!.appendChild(this.renderResultPanel(idPair, index))
    );
  }

  bindEvent(): void {
    this.matchBtn?.addEventListener('click', this.onClickMatch);
    this.nextBtn?.addEventListener('click', this.onClickNext);
    this.closeBtn?.addEventListener('click', this.onClickClose);
  }
}
