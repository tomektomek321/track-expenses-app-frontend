import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionAmount',
})
export class TransactionAmountPipe implements PipeTransform {

  public transform(value: number): string {
    if(value === 0) {
      throw new Error('transactionAmount');
    }
    return value < 0 ? '- ' + Math.abs(value).toString() : '+ ' + value.toString();
  }

}
