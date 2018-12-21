import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteTrafficComponent } from './site-traffic.component';

describe('SiteTrafficComponent', () => {
  let component: SiteTrafficComponent;
  let fixture: ComponentFixture<SiteTrafficComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteTrafficComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteTrafficComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
