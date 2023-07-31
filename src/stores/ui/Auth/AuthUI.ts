import { makeAutoObservable } from 'mobx';

class AuthUI {
  error = false;
  isSignUp = false;
  helperText = '';

  constructor() {
    makeAutoObservable(this);
  }

  setError(error: boolean) {
    this.error = error;
  }

  setIsSignUp(isSignUp: boolean) {
    this.isSignUp = isSignUp;
  }

  setHelperText(helperText: string) {
    this.helperText = helperText;
  }
}

export const authUI = new AuthUI();
