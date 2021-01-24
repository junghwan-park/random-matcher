import Matcher, { MatchResults } from '@/js/core/matcher';
import UI from '@/js/ui/ui';
import State, { AppState } from '@/js/core/state';

export default class App {
  matcher: Matcher | null = null;

  ui: UI | null = null;

  appState: AppState;

  constructor(selector: string) {
    this.appState = State;
    this.matcher = new Matcher(this.appState);
    this.ui = new UI(selector, this.appState, this.matcher);

    this.render();
  }

  match(): MatchResults | void {
    return this.matcher?.match();
  }

  private render(): void {
    this.ui?.render();
  }

  destroy(): void {
    if (this.ui) {
      this.ui.destroy();
      this.ui = null;
    }

    if (this.matcher) {
      this.matcher = null;
    }

    this.appState.clearState();
  }
}
