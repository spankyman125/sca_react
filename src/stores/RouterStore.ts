import { makeAutoObservable } from 'mobx';
import { Location, NavigateFunction, Params } from 'react-router-dom';

class RouterStore {
  location: Location | undefined = undefined;
  navigate: NavigateFunction | undefined = undefined;
  params: Readonly<Params<string>> | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setRoute(
    location: Location,
    navigate: NavigateFunction,
    params: Readonly<Params<string>>,
  ) {
    this.location = location;
    this.navigate = navigate;
    this.params = params;
  }
}
export const routerStore = new RouterStore();
