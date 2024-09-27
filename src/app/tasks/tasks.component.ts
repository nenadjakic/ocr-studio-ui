import { Component, inject, PLATFORM_ID } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import {
  Document,
  OcrConfig,
  OcrProgress,
  Task,
  TaskControllerService,
} from '../core/modules/openapi';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { Utils } from '../utils/utils';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { SelectModule } from 'primeng/select';
import { ToggleButtonModule } from 'primeng/togglebutton';

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
import { SplitButtonModule } from 'primeng/splitbutton';
import { FloatLabelModule } from 'primeng/floatlabel';
import { OcrConfigFormComponent } from '../ocr-config-form/ocr-config-form.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    PanelModule,
    TableModule,
    ButtonModule,
    TagModule,
    DialogModule,
    NgFor,
    NgIf,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FieldsetModule,
    SplitButtonModule,
    SelectModule,
    CommonModule,
    FloatLabelModule,
    ToggleButtonModule,
    OcrConfigFormComponent,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  taskControllerService = inject(TaskControllerService);
  formBuilder = inject(FormBuilder);

  pageNumber = 0;
  totalRecords = 0;
  rows = 25;
  pageSize = this.rows;

  tasks: Task[] = [];
  expandedRows = {};

  displayDetails = false;
  displayEditConfig = false;
  selectedTask: Task | undefined;

  form!: FormGroup;

  ngOnInit() {
    this.load(0, this.pageSize);

    this.form = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
    });

    this.createFormModel(null);
  }

  createFormModel(model: Task | null) {
    this.form = this.formBuilder.group({
      id: [model?.id],
      name: [model?.name, Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      console.log('Form is invalid');
    }
  }

  edit(task: Task) {}

  showEditConfig(task: Task) {
    this.selectedTask = task;
    this.displayEditConfig = true;
  }

  delete(task: Task) {
    throw new Error('Method not implemented.');
  }

  pageChange(event: any) {
    this.pageNumber = event.first / event.rows;
    this.pageSize = event.rows;
    this.load(this.pageNumber, this.pageSize);
  }

  load(pageNumber: number, pageSize: number) {
    this.taskControllerService
      .findPageWithTasks(pageNumber, pageSize)
      .subscribe({
        next: (pagedModel) => {
          this.tasks = pagedModel.content!!;
          this.totalRecords = pagedModel.page?.totalElements ?? 0;
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {},
      });
  }

  toTask($any: any) {
    return $any as Task;
  }

  toDocument($any: any) {
    return $any as Document;
  }

  getOcrStatusText(status?: OcrProgress.StatusEnum): string {
    return Utils.getOcrStatusText(status);
  }
  getOcrStatusSeverity(status?: OcrProgress.StatusEnum) {
    return Utils.getOcrStatusSeverity(status);
  }

  getInDocumentCount(task: Task) {
    return task.inDocuments?.length;
  }

  canEdit(status?: OcrProgress.StatusEnum) {
    return status === OcrProgress.StatusEnum.Created;
  }

  canDelete(status?: OcrProgress.StatusEnum) {
    return status === OcrProgress.StatusEnum.Created;
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  isObject(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }

  showDetails(task: Task) {
    this.selectedTask = task;
    this.displayDetails = true;
  }
}
