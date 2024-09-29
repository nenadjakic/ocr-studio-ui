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
import {
  OcrConfigFormComponent,
  OcrConfigWithId,
} from '../ocr-config-form/ocr-config-form.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

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
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})
export class TasksComponent {
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
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
  selectedTask!: Task;

  form!: FormGroup;

  get selectedOcrConfig(): OcrConfigWithId | undefined {
    if (this.selectedTask) {
      return {
        ...this.selectedTask?.ocrConfig,
        taskId: this.selectedTask?.id!!,
      };
    }
    return undefined;
  }

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
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the task:  ' + task.id!! + '?',
      header: 'Delete Task Confirmation',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-info-circle',
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      accept: () => {        
        this.taskControllerService.deleteTask(task.id!!).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Task successfuly deleted.',
              life: 3000,
            });
            this.load(this.pageNumber, this.pageSize);
          },
          error: (err) => {
            console.log('Error ocurred', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error ocurred. Task not deleted.',
              life: 3000,
            });
          },
        });
      },
    });
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

  canStart(status?: OcrProgress.StatusEnum) {
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
