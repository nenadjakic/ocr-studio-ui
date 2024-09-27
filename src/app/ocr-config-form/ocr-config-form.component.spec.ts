import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcrConfigFormComponent } from './ocr-config-form.component';

describe('OcrConfigFormComponent', () => {
  let component: OcrConfigFormComponent;
  let fixture: ComponentFixture<OcrConfigFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcrConfigFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OcrConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
