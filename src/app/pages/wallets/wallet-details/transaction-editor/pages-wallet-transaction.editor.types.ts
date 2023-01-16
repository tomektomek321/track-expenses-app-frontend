import { FormControl } from '@angular/forms';
import { WalletTransactionType } from 'src/app/domains/transactions/domains.transactions.types';

export interface ITransactionModalData {
  amount: number;
  description?: string;
  date: Date;
  type: WalletTransactionType;
}

export interface IWalletTransactionModalFormType {
  amount: FormControl<number | null>;
  description?: FormControl<string | null>;
  date: FormControl<Date>;
  type: FormControl<WalletTransactionType | null>;
}