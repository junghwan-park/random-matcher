import SettingPanel from '@/js/ui/settingPanel';
import GameArea from '@/js/ui/gameArea';
import { AppState } from '@/js/core/state';
import Matcher from '@/js/core/matcher';

export default class UI {
  appState: AppState;

  matcher: Matcher;

  wrapperElement: HTMLElement | null;

  settingPanel: SettingPanel;

  gameArea: GameArea;

  constructor(selector: string, appState: AppState, matcher: Matcher) {
    this.appState = appState;
    this.matcher = matcher;

    const wrapperElement: HTMLElement | null = document.querySelector(selector);

    if (!wrapperElement) {
      throw Error(`Check the element selector validity. (given selector: ${selector})`);
    }

    this.wrapperElement = wrapperElement;
    this.wrapperElement.className = 'random-matcher';

    this.settingPanel = new SettingPanel(this.appState);
    this.gameArea = new GameArea(this.appState, this.matcher);
  }

  render(): void {
    this.wrapperElement?.appendChild(this.settingPanel.render());
    this.wrapperElement?.appendChild(this.gameArea.render());
  }

  destroy(): void {
    this.settingPanel.destroy();
    this.gameArea.destroy();

    this.wrapperElement?.parentElement?.removeChild(this.wrapperElement);
  }
}
