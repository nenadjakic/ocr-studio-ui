import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { OcrConfig } from '../core/modules/openapi';

import { CommonModule, NgFor, NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { SelectModule } from 'primeng/select';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ocr-config-form',
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    NgIf,
    ButtonModule,
    InputTextModule,
    FieldsetModule,
    SelectModule,
    ToggleButtonModule,
    PanelModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './ocr-config-form.component.html',
  styleUrl: './ocr-config-form.component.css',
  encapsulation: ViewEncapsulation.Emulated,
})
export class OcrConfigFormComponent implements OnInit, OnChanges {
  @Input() model!: OcrConfig;

  formBuilder = inject(FormBuilder);
  ocrConfigForm!: FormGroup;

  ngOnInit(): void {
    this.createOcrConfigFormModel(null);
    if (this.model) {
      this.editConfig(this.model);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model'] && this.model) {
      this.editConfig(this.model);
    }
  }
  /*
  const transformedObject = {
    [inputObject.varName]: inputObject.varValue
  };
  */
  onSave() {
    if (this.ocrConfigForm.valid) {
      // Čitaj sve vrednosti iz forme
      const formValues = this.ocrConfigForm.value;

      console.log('Saving data:', formValues);

      // Primer: Čitanje pojedinačnih svojstava
      const language = formValues.language;
      const ocrEngineMode = formValues.ocrEngineMode;
      const pageSegmentationMode = formValues.pageSegmentationMode;
      const preProcessing = formValues.preProcessing;
      const fileFormat = formValues.fileFormat;
      const mergeDocuments = formValues.mergeDocuments;

      // Čitanje Tesseract varijabli
      const tessVariables = formValues.tessVariables.map(
        (variable: { varName: any; varValue: any }) => ({
          name: variable.varName,
          value: variable.varValue,
        })
      );

      // Logika za slanje podataka na server (npr. putem servisa)
      // this.yourService.saveConfig(formValues).subscribe(response => {
      //   console.log('Configuration saved:', response);
      // });
    } else {
      console.log('Form is not valid');
      // Obeleži polja koja su nevalidna (opcionalno)
      this.ocrConfigForm.markAllAsTouched();
    }
  }

  ocrEngineModes = Object.values(OcrConfig.OcrEngineModeEnum).map((value) => ({
    code: value,
    name: this.formatName(value),
  }));

  pageSegmentationModes = Object.values(OcrConfig.PageSegmentationModeEnum).map(
    (value) => ({
      code: value,
      name: this.formatName(value),
    })
  );
  fileFormats = Object.values(OcrConfig.FileFormatEnum).map((value) => ({
    code: value,
    name: this.formatName(value),
  }));

  formatName(value: string): string {
    return value
      .replace('_', ' ')
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  toCodeName(
    value:
      | OcrConfig.OcrEngineModeEnum
      | OcrConfig.PageSegmentationModeEnum
      | OcrConfig.FileFormatEnum
  ) {
    return {
      code: value,
      name: this.formatName(value),
    };
  }

  createOcrConfigFormModel(model: OcrConfig | null) {
    this.ocrConfigForm = this.formBuilder.group({
      language: [model?.language, Validators.required],
      ocrEngineMode: [
        model && model.ocrEngineMode
          ? this.toCodeName(model.ocrEngineMode)
          : this.toCodeName(OcrConfig.OcrEngineModeEnum.Default),
        Validators.required,
      ],
      pageSegmentationMode: [
        model && model.pageSegmentationMode
          ? this.toCodeName(model.pageSegmentationMode)
          : this.toCodeName(OcrConfig.PageSegmentationModeEnum._3),
        Validators.required,
      ],
      tessVariables: this.formBuilder.array([]),
      preProcessing: [null, Validators.required],
      fileFormat: [model && model.fileFormat, Validators.required],
      mergeDocuments: [null, Validators.required],
      newVarName: [null],
      newVarValue: [null],
    });
  }

  hasInvalidNewVarFields(): boolean {
    const newVarName = this.ocrConfigForm.get('newVarName')?.value;
    const newVarValue = this.ocrConfigForm.get('newVarValue')?.value;

    return (!newVarName && newVarValue) || (newVarName && !newVarValue);
  }

  bothFieldsRequired: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const newVarName = control.get('newVarName')?.value;
    const newVarValue = control.get('newVarValue')?.value;

    if (!newVarName && !newVarValue) {
      return null;
    }

    if ((newVarName && !newVarValue) || (!newVarName && newVarValue)) {
      return { bothFieldsRequired: true };
    }

    return null;
  };

  get tessVariables(): FormArray {
    return this.ocrConfigForm.get('tessVariables') as FormArray;
  }

  get newVarName() {
    return this.ocrConfigForm.get('newVarName')!;
  }

  get newVarValue() {
    return this.ocrConfigForm.get('newVarValue')!;
  }

  addTessVariable(): void {
    //if (this.ocrConfigForm.valid) {
    const newVariable = this.formBuilder.group({
      varName: new FormControl(
        this.ocrConfigForm.get('newVarName')?.value,
        Validators.required
      ),
      varValue: new FormControl(
        this.ocrConfigForm.get('newVarValue')?.value,
        Validators.required
      ),
    });

    this.tessVariables.push(newVariable);

    this.ocrConfigForm.get('newVarName')?.reset();
    this.ocrConfigForm.get('newVarValue')?.reset();
    //}
  }

  removeTessVariable(index: number) {
    this.tessVariables.removeAt(index);
  }

  editConfig(model: OcrConfig) {
    console.log('tess', model);

    this.tessVariables.clear();
    for (const key in model.tessVariables) {
      const variableGroup = this.formBuilder.group({
        varName: [key],
        varValue: [model.tessVariables[key]],
      });
      this.tessVariables.push(variableGroup);
    }
    this.ocrConfigForm.patchValue({
      language: model.language,
      ocrEngineMode: this.toCodeName(model.ocrEngineMode!!),
      pageSegmentationMode: this.toCodeName(model.pageSegmentationMode!!),

      preProcessing: model.preProcessing,
      fileFormat: this.toCodeName(model.fileFormat!!),
      mergeDocuments: model.mergeDocuments,
    });
  }
}
