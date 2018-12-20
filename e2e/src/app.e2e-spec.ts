import { AppPage } from './app.po';
import { browser } from 'protractor';

describe('liveaction-tp app', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getTitle()).toEqual('Live Action TP');
  });
});
