import { AppState, Groups, Priorities } from '@/js/core/state';

type Data = { priorities: Priorities; groups: Groups; candidates: Groups };
export default class SettingPanel {
  appState: AppState;

  el: HTMLDivElement | null = null;

  textArea: HTMLTextAreaElement | null = null;

  confirmBtn: HTMLButtonElement | null = null;

  cancelBtn: HTMLButtonElement | null = null;

  data: Data = {
    priorities: [],
    groups: [],
    candidates: [],
  };

  constructor(appState: AppState) {
    this.appState = appState;
  }

  private onClickConfirm(): void {
    const value = this.textArea?.value;

    if (value?.length === 0) {
      return;
    }

    let data: Data = {
      priorities: [],
      groups: [],
      candidates: [],
    };

    try {
      data = JSON.parse(value || '{}');
    } finally {
      this.appState.setGroups(data.groups);
      this.appState.setCandidates(data.candidates);
      this.appState.setPriorities(data.priorities);
    }
  }

  private onClickCancel(): void {
    this.hidePanel();
  }

  showPanel(): void {
    this.el?.classList.remove('hide');
  }

  hidePanel(): void {
    this.el?.classList.add('hide');
  }

  bindEvents(): void {
    this.confirmBtn?.addEventListener('click', this.onClickConfirm);
    this.cancelBtn?.addEventListener('click', this.onClickCancel);
  }

  unBindEvents(): void {
    this.confirmBtn?.removeEventListener('click', this.onClickConfirm);
    this.cancelBtn?.removeEventListener('click', this.onClickCancel);
  }

  render(): HTMLDivElement {
    this.el = document.createElement('div');
    this.el.className = 'setting-panel';

    this.textArea = document.createElement('textarea');
    this.textArea.className = 'data-field';
    this.el.appendChild(this.textArea);

    this.confirmBtn = document.createElement('button');
    this.confirmBtn.className = 'confirm-btn';
    this.confirmBtn.textContent = 'confirm';
    this.el.appendChild(this.confirmBtn);

    this.cancelBtn = document.createElement('button');
    this.cancelBtn.className = 'cancel-btn';
    this.cancelBtn.textContent = 'cancel';
    this.el.appendChild(this.cancelBtn);

    this.bindEvents();

    return this.el;
  }

  destroy(): void {
    this.unBindEvents();

    this.confirmBtn = null;
    this.cancelBtn = null;

    this.el?.parentElement?.removeChild(this.el);
    this.el = null;
  }
}
