import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuPolicyComponent } from './au-policy.component';

describe('AuPolicyComponent', () => {
  let component: AuPolicyComponent;
  let fixture: ComponentFixture<AuPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
