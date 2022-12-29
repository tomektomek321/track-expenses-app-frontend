import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IWalletApiResponse, IWalletDetailsApiResponse, IWalletPayload } from './domains.wallets.types';
import { HttpClient } from '@angular/common/http';
import { API_WALLETS_URL } from './domains.wallets.constants';
import { fakeRequest } from 'src/app/common/http/common.http.fake-request';
import { WALLET_DETAILS_API_RESPONSE_MOCK, GET_WALLETS_API_RESPONSE_MOCK } from './domains.wallets.mocks';

@Injectable({
  providedIn: 'root',
})
export class DomainsWalletsGateway {
  public constructor(
      private readonly http: HttpClient,
  ) {
  }

  public getWallets(): Observable<IWalletApiResponse[]> {
    return fakeRequest(GET_WALLETS_API_RESPONSE_MOCK());
    //return this.http.get<IWalletApiResponse[]>(API_WALLETS_URL); // TE ZMIANY SA CHWILOWE, BO MI DALEJ BACKEND NIE DZIALA
  }

  public createWallet({ name }: IWalletPayload): Observable<IWalletApiResponse> {
    return this.http.post<IWalletApiResponse>(API_WALLETS_URL, { name });
  }

  public updateWallet(id: number, { name }: IWalletPayload): Observable<IWalletApiResponse> {
    return fakeRequest({id: 1, creationDate: new Date().toString(), name})
    return this.http.put<IWalletApiResponse>(API_WALLETS_URL, { id, name }); // TE ZMIANY SA CHWILOWE, BO MI DALEJ BACKEND NIE DZIALA
  }

  public deleteWallet(id: number): Observable<void> {
    return this.http.delete<void>(API_WALLETS_URL + `/${id}`);
  }

  public getWalletsDetails(id: number): Observable<IWalletDetailsApiResponse> {
    return fakeRequest(WALLET_DETAILS_API_RESPONSE_MOCK(id));
  }
}
