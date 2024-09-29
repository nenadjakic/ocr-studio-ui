import {
  Component,
  EventEmitter,
  Inject,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
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
import { OcrConfig, TaskControllerService } from '../core/modules/openapi';

import { CommonModule, NgFor, NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { SelectModule } from 'primeng/select';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

export interface OcrConfigWithId extends OcrConfig {
  taskId: string;
}

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
})
export class OcrConfigFormComponent implements OnInit, OnChanges {
  messageService = inject(MessageService);
  taskControllerService = inject(TaskControllerService);

  @Input() model!: OcrConfig;
  @Input() taskId!: string;

  @Output() save: EventEmitter<void> = new EventEmitter<void>();

  formBuilder = inject(FormBuilder);
  ocrConfigForm!: FormGroup;

  ngOnInit(): void {
    this.createOcrConfigFormModel();
    if (this.model) {
      this.editConfig(this.model);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model'] && this.model) {
      this.editConfig(this.model);
    }
  }
  
  onSave() {
    if (this.ocrConfigForm.valid) {
      const formValues = this.ocrConfigForm.value;

      console.log('Saving data:', formValues);

      const taskId = formValues.taskId;
      const language = formValues.language;
      const ocrEngineMode = formValues.ocrEngineMode.code;
      const pageSegmentationMode = formValues.pageSegmentationMode.code;
      const preProcessing = formValues.preProcessing;
      const fileFormat = formValues.fileFormat.code;
      const mergeDocuments = formValues.mergeDocuments;

      const tessVariables: { [key: string]: string; } = formValues.tessVariables.reduce(
        (acc: { [key: string]: string }, variable: { varName: any; varValue: any }) => {
          acc[variable.varName] = variable.varValue;
          return acc;
        },
        {}
      );

      this.taskControllerService
        .updateTaskConfig(taskId, {
          language: language,
          ocrEngineMode: ocrEngineMode,
          pageSegmentationMode: pageSegmentationMode,
          preProcessing: preProcessing,
          fileFormat: fileFormat,
          mergeDocuments: mergeDocuments,
          tessVariables: tessVariables
        })
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Task\'s ocr configuration successfuly updated.',
              life: 3000,
            });
            this.save.emit();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error ocurred.',
              life: 3000,
            });
          },
        });
    } else {
      console.log('Form is not valid');
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

  createOcrConfigFormModel() {
    this.ocrConfigForm = this.formBuilder.group({
      taskId: [null],
      language: [null, Validators.required],
      ocrEngineMode: [
        this.toCodeName(OcrConfig.OcrEngineModeEnum.Default),
        Validators.required,
      ],
      pageSegmentationMode: [
        this.toCodeName(OcrConfig.PageSegmentationModeEnum._3),
        Validators.required,
      ],
      tessVariables: this.formBuilder.array([]),
      preProcessing: [null, Validators.required],
      fileFormat: [null, Validators.required],
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
  }

  removeTessVariable(index: number) {
    this.tessVariables.removeAt(index);
  }

  editConfig(model: OcrConfig) {
    this.tessVariables.clear();
    for (const key in model.tessVariables) {
      const variableGroup = this.formBuilder.group({
        varName: [key],
        varValue: [model.tessVariables[key]],
      });
      this.tessVariables.push(variableGroup);
    }
    this.ocrConfigForm.patchValue({
      taskId: this.taskId,
      language: model.language,
      ocrEngineMode: this.toCodeName(model.ocrEngineMode!!),
      pageSegmentationMode: this.toCodeName(model.pageSegmentationMode!!),
      preProcessing: model.preProcessing,
      fileFormat: this.toCodeName(model.fileFormat!!),
      mergeDocuments: model.mergeDocuments,
    });
  }
}
