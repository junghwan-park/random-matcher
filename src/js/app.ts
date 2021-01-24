import Matcher, { MatchResults } from '@/js/core/matcher';
import UI from '@/js/ui/ui';
import RootState, { AppState, State } from '@/js/core/state';

export default class App {
  matcher: Matcher | null = null;

  ui: UI | null = null;

  appState: AppState;

  constructor(selector: string, data: State) {
    this.appState = RootState;
    this.matcher = new Matcher(this.appState);
    this.ui = new UI(selector, this.appState, this.matcher);

    if (data) {
      this.setData(data);
    }

    this.render();
  }

  setData(state: State) {
    this.appState.setState(state);
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
