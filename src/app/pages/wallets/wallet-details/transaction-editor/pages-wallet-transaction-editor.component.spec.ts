import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/material.module';
import { PagesWalletTransactionEditorComponent } from './pages-wallet-transaction-editor.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import { PagesWalletsManagementEditorComponent }
  from '../../management/wallet-editor/pages-wallets-management-editor.component';
import { WALLET_TRANSACTIONS_EXPENSE_MOCK } from 'src/app/domains/transactions/domains.transactions.mocks';
import { PagesTransactionCategoriesService } from 'src/app/pages/categories/pages-transaction-categories.service';
import { of } from 'rxjs';
import { transactionCategoriesObjectsMockFunc } from 'src/app/domains/categories/domains.transaction-categories.mocks';
import { WalletTransactionType } from 'src/app/domains/transactions/domains.transactions.constants';
import { TransactionCategory } from 'src/app/pages/categories/transaction-category.model';

describe('TransactionEditorComponent', () => {
  let component: PagesWalletTransactionEditorComponent;
  let fixture: ComponentFixture<PagesWalletTransactionEditorComponent>;
  let ERROR_MESSAGE_AMOUNT_INVALID_FORMAT: string;
  let matDialogMock: SpyObj<MatDialog>;
  let matDialogRef: SpyObj<MatDialogRef<PagesWalletsManagementEditorComponent>>;
  let transactionCategoriesServiceMock: SpyObj<PagesTransactionCategoriesService>;

  beforeEach(async () => {
    ERROR_MESSAGE_AMOUNT_INVALID_FORMAT = 'Amount has invalid format';
    matDialogRef = createSpyObj<MatDialogRef<PagesWalletsManagementEditorComponent>>(MatDialogRef.name, [ 'close' ]);
    matDialogRef.close.and.callThrough();
    matDialogMock = createSpyObj<MatDialog>(MatDialog.name, [ 'open' ]);
    matDialogMock.open.and.returnValue(matDialogRef);

    transactionCategoriesServiceMock = createSpyObj<PagesTransactionCategoriesService>
    (PagesTransactionCategoriesService.name, [ 'getCategories' ]);
    transactionCategoriesServiceMock.getCategories.and.returnValue(of(transactionCategoriesObjectsMockFunc()));

    await TestBed.configureTestingModule({
      declarations: [
        PagesWalletTransactionEditorComponent,
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MaterialModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRef },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: PagesTransactionCategoriesService, useValue: transactionCategoriesServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: WALLET_TRANSACTIONS_EXPENSE_MOCK },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PagesWalletTransactionEditorComponent);
    TestBed.inject<HttpTestingController>(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('form validation', () => {
    describe('Init form values', () => {
      it('amount', () => {
        const x = component.form.get('amount');
        expect(x!.value).toBe(WALLET_TRANSACTIONS_EXPENSE_MOCK.amount);
      });

      it('description', () => {
        const x = component.form.get('description');
        expect(x!.value).toBe(WALLET_TRANSACTIONS_EXPENSE_MOCK.description);
      });

      it('date', () => {
        const x = component.form.get('date');
        expect(x!.value).toEqual(WALLET_TRANSACTIONS_EXPENSE_MOCK.date);
      });

      it('type', () => {
        const x = component.form.get('type');
        expect(x!.value).toEqual(WALLET_TRANSACTIONS_EXPENSE_MOCK.type);
      });

      it('category', () => {
        const x = component.form.get('category');
        expect(x!.value).toEqual(WALLET_TRANSACTIONS_EXPENSE_MOCK.categoryId);
      });
    });

    describe('amount field validation', () => {
      describe('error', () => {
        describe('should show validation error if value has invalid format', () => {
          it('12.3333', () => {
            component.isLoadingTransactionCategories = false;
            component.form.get('amount')?.setValue(12.3333);
            component.form.get('amount')?.markAsTouched();

            fixture.detectChanges();
            const errorMessageDiv = fixture.debugElement.query(By.css('.mat-error'));
            const errorMessageText: HTMLDivElement = errorMessageDiv.nativeElement as HTMLDivElement;

            expect(errorMessageText.textContent!.trim()).toBe(ERROR_MESSAGE_AMOUNT_INVALID_FORMAT);
          });
        });
      });

      describe('success', () => {
        describe('should show no validation error if amount has valid format', () => {
          it('0', () => {
            component.form.get('amount')?.setValue(0);
            component.form.get('amount')?.markAsTouched();

            fixture.detectChanges();

            const errorMessageDiv = fixture.debugElement.query(By.css('.mat-error'));
            expect(errorMessageDiv).toBeFalsy();
          });

          it('10.12', () => {
            component.form.get('amount')?.setValue(10.21);
            component.form.get('amount')?.markAsTouched();

            fixture.detectChanges();

            const errorMessageDiv = fixture.debugElement.query(By.css('.mat-error'));
            expect(errorMessageDiv).toBeFalsy();
          });
        });
      });
    });

    describe('description field validation', () => {
      describe('error', () => {
        it('should show no validation error if description input is empty', () => {
          component.form.get('description')?.setValue('');
          component.form.get('description')?.markAsTouched();

          fixture.detectChanges();

          const errorMessageDiv = fixture.debugElement.query(By.css('.mat-error'));
          expect(errorMessageDiv).toBeFalsy();
        });
      });

      describe('success', () => {
        it('should show validation error if description input is filled', () => {
          component.form.get('description')?.setValue('Some description');
          component.form.get('description')?.markAsTouched();

          fixture.detectChanges();

          const errorMessageDiv = fixture.debugElement.query(By.css('.mat-error'));
          expect(errorMessageDiv).toBeFalsy();
        });
      });
    });

    describe('date field validation', () => {
      describe('success', () => {
        it('should show validation error if description input is filled', () => {
          component.form.get('date')?.setValue(new Date());
          component.form.get('date')?.markAsTouched();

          fixture.detectChanges();

          const errorMessageDiv = fixture.debugElement.query(By.css('.mat-error'));
          expect(errorMessageDiv).toBeFalsy();
        });
      });
    });

    describe('category field validation', () => {
      describe('error', () => {
        it('should show no validation error if category field is not chosen', () => {
          component.form.get('category')?.markAsTouched();

          fixture.detectChanges();

          const errorMessageDiv = fixture.debugElement.query(By.css('.mat-error'));
          expect(errorMessageDiv).toBeFalsy();
        });
      });
    });
  });

  describe('save method', () => {
    describe('invalid form', () => {
      it('should set form as not valid', () => {
        component.isLoadingTransactionCategories  = false;
        component.form.get('amount')?.setValue(1.3303);
        component.form.get('amount')?.markAsTouched();
        fixture.detectChanges();

        const errorMessageDiv: HTMLButtonElement =
          fixture.debugElement.query(By.css('.btn__save')).nativeElement as HTMLButtonElement;
        errorMessageDiv.click();
        fixture.detectChanges();

        expect(component.form.valid).toBeFalse();
      });
    });

    describe('valid form', () => {
      it('should set form as valid', () => {
        component.isLoadingTransactionCategories  = false;
        component.form.get('amount')?.setValue(10);
        component.form.get('amount')?.markAsTouched();
        fixture.detectChanges();

        component.form.get('date')?.setValue(new Date());
        component.form.get('date')?.markAsTouched();
        fixture.detectChanges();

        const errorMessageDiv: HTMLButtonElement =
          fixture.debugElement.query(By.css('.btn__save')).nativeElement as HTMLButtonElement;
        errorMessageDiv.click();
        fixture.detectChanges();

        expect(component.form.valid).toBeTrue();
      });

      it('should invoke close dialogRef if amount is valid', () => {
        component.isLoadingTransactionCategories  = false;
        component.form.get('amount')?.setValue(0);
        component.form.get('amount')?.markAsTouched();
        fixture.detectChanges();

        const errorMessageDiv: HTMLButtonElement =
          fixture.debugElement.query(By.css('.btn__save')).nativeElement as HTMLButtonElement;
        errorMessageDiv.click();
        fixture.detectChanges();

        expect(matDialogRef.close).toHaveBeenCalled();
      });
    });

    describe('transaction categorie', () => {
      describe('valid inputs', () => {
        it('should be equal to set category', () => {
          expect(component.form.get('category')?.value).toBe(5);
        });

        it('should show income type transaction categories', () => {
          component.form.get('type')?.setValue(WalletTransactionType.Income);
          const transactions: TransactionCategory[] = [
            transactionCategoriesObjectsMockFunc()[0],
            transactionCategoriesObjectsMockFunc()[1] ];
          expect(component.transactionsCategories).toEqual(transactions);
        });

        it('should show expense type transaction categories', () => {
          component.form.get('type')?.setValue(WalletTransactionType.Expense);
          const transactions: TransactionCategory[] = [ transactionCategoriesObjectsMockFunc()[2] ];
          expect(component.transactionsCategories).toEqual(transactions);
        });
      });
    });
  });
});
