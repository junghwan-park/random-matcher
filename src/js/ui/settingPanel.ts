import { AppState, Groups, Priorities } from '@/js/core/state';

type Data = { priorities: Priorities; groups: Groups; candidates: Groups };

export default class SettingPanel {
  appState: AppState;

  el: HTMLDivElement | null = null;

  buttonArea: HTMLDivElement | null = null;

  textArea: HTMLTextAreaElement | null = null;

  confirmBtn: HTMLButtonElement | null = null;

  cancelBtn: HTMLButtonElement | null = null;

  data: Data = {
    priorities: [{ id: 'W' }, { id: 'G' }],
    groups: [
      {
        id: '1',
        name: '라이언',
        priorityId: 'G',
        imgSrc:
          'https://lh3.googleusercontent.com/proxy/NxQmdz6jahq5NroUr0KrvAQxG7XcgcC8hhp3RASSvI13VQALmlrEGAPLgArSDre32INRmqw4O0SracMRCFqbuhSq2jvYBxpvw3GLMffGWOKDv1_e8hlbG5xMPsLCjQrVfJxF87oeW7mSXL9pWTrdJ1PaTH_W4KSl_4iJBmyaGnjOjxxhlzGSAAMBStUU5YFsw9w3qNAFwpVc1LXxDtcU_02Zoy9otgNoIeNNP4R8',
        type: 'mentor',
      },
      {
        id: '2',
        name: '네오',
        priorityId: 'W',
        imgSrc: 'https://t1.daumcdn.net/cfile/tistory/992FA9345AB64A0D19',
        type: 'mentor',
      },
      {
        id: '1',
        name: '어피치',
        priorityId: 'W',
        imgSrc:
          'https://forum-creallo.s3.dualstack.ap-northeast-2.amazonaws.com/original/1X/5e0d906585d6dbbf7f3c9997484eee594bd01da1.jpeg',
        type: 'mentor',
      },
    ],
    candidates: [
      {
        id: '1',
        name: '1조',
        priorityId: 'none',
        imgSrc:
          'https://lh3.googleusercontent.com/proxy/NxQmdz6jahq5NroUr0KrvAQxG7XcgcC8hhp3RASSvI13VQALmlrEGAPLgArSDre32INRmqw4O0SracMRCFqbuhSq2jvYBxpvw3GLMffGWOKDv1_e8hlbG5xMPsLCjQrVfJxF87oeW7mSXL9pWTrdJ1PaTH_W4KSl_4iJBmyaGnjOjxxhlzGSAAMBStUU5YFsw9w3qNAFwpVc1LXxDtcU_02Zoy9otgNoIeNNP4R8',
        type: 'mentor',
      },
      {
        id: '2',
        name: '2조',
        priorityId: 'W',
        imgSrc: 'https://t1.daumcdn.net/cfile/tistory/992FA9345AB64A0D19',
        type: 'mentor',
      },
      {
        id: '1',
        name: '3조',
        priorityId: 'W',
        imgSrc:
          'https://forum-creallo.s3.dualstack.ap-northeast-2.amazonaws.com/original/1X/5e0d906585d6dbbf7f3c9997484eee594bd01da1.jpeg',
        type: 'mentor',
      },
    ],
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
    this.el.className = 'setting-panel hide';

    this.renderTextArea();
    this.renderButtons();

    this.bindEvents();

    return this.el;
  }

  private renderTextArea() {
    this.textArea = document.createElement('textarea');
    this.textArea.className = 'data-field';

    this.el!.appendChild(this.textArea);
  }

  private renderButtons() {
    this.buttonArea = document.createElement('div');
    this.buttonArea.className = 'setting-button-area';

    this.confirmBtn = document.createElement('button');
    this.confirmBtn.className = 'btn primary';
    this.confirmBtn.textContent = 'confirm';
    this.buttonArea.appendChild(this.confirmBtn);

    this.cancelBtn = document.createElement('button');
    this.cancelBtn.className = 'btn';
    this.cancelBtn.textContent = 'cancel';
    this.buttonArea.appendChild(this.cancelBtn);

    this.el!.appendChild(this.buttonArea);
  }

  destroy(): void {
    this.unBindEvents();

    this.confirmBtn = null;
    this.cancelBtn = null;

    this.el?.parentElement?.removeChild(this.el);
    this.el = null;
  }
}
