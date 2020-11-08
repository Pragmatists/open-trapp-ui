import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import moment from 'moment';
import { from, Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import {
  AffectedEntriesDTO,
  AuthorizedUser,
  AuthorizedUserDTO,
  BulkEditDTO,
  CreateServiceAccountResponseDTO,
  MonthDTO,
  ReportingWorkLogDTO,
  ServiceAccountDTO
} from './dtos';
import { LocalStorage } from '../utils/LocalStorage';

export class OpenTrappAPI {
  private static readonly API_ROOT_URL = `${process.env.REACT_APP_API_URL}/api/v1`;
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: OpenTrappAPI.API_ROOT_URL,
      headers: {'Authorization': `Bearer ${OpenTrappAPI.apiToken}`}
    });
    this.axiosInstance.interceptors.request.use(
        this.decorateRequestWithAuthToken,
        err => Promise.reject(err)
    );
    this.axiosInstance.interceptors.response.use(
        undefined,
        this.handleErrorResponse
    )
  }

  obtainJWTToken(idToken: string): Promise<AuthorizedUser> {
    return this.axios.get<AuthorizedUser>(`/authentication/user-token`, {headers: {'id-token': idToken}})
        .then(r => r.data);
  }

  calendarMonth(year: number, month: number): Observable<MonthDTO> {
    return this.get<MonthDTO>(`/calendar/${year}/${month}`);
  }

  workLogEntries(year: number, month: number): Observable<ReportingWorkLogDTO[]> {
    return this.get<ReportingWorkLogDTO[]>(`/calendar/${year}/${month}/work-log/entries`);
  }

  saveWorkLog(day: string, tags: string[], workload: string, username: string): Observable<string> {
    return this.post<{ id: string }>(`/employee/${username}/work-log/entries`, {projectNames: tags, workload, day}).pipe(
            map(r => r.id)
        );
  }

  updateWorkLog(id: string, tags: string[], workload: string): Observable<ReportingWorkLogDTO> {
    return from(this.axios.put<ReportingWorkLogDTO>(`/work-log/entries/${id}`, {projectNames: tags, workload})).pipe(
        map(r => r.data)
    );
  }

  removeWorkLog(id: string): Observable<string> {
    return this.delete(`/work-log/entries/${id}`).pipe(
        mapTo(id)
    );
  }

  validateBulkEditQuery(query: string): Promise<AffectedEntriesDTO> {
    return this.axios.get<AffectedEntriesDTO>(`/work-log/bulk-update/${query}`)
        .then(axiosResp => axiosResp.data);
  }

  bulkEdit(requestBody: BulkEditDTO): Observable<AffectedEntriesDTO> {
    return this.post<AffectedEntriesDTO>('/work-log/bulk-update', requestBody);
  }

  tags(numberOfPastMonths?: number): Observable<string[]> {
    const url = numberOfPastMonths ?
        `/projects?dateFrom=${moment().subtract(numberOfPastMonths, 'months').format('YYYY-MM-DD')}` :
        '/projects';
    return this.get<string[]>(url);
  }

  presets(limit?: number): Observable<string[][]> {
    const url = limit ? `/projects/presets?limit=${limit}` : '/projects/presets';
    return this.get<string[][]>(url);
  }

  get serviceAccounts(): Observable<ServiceAccountDTO[]> {
    return this.get<ServiceAccountDTO[]>('/admin/service-accounts');
  }

  creteServiceAccount(name: string): Promise<CreateServiceAccountResponseDTO> {
    return this.axios.post<CreateServiceAccountResponseDTO>('/admin/service-accounts', {name})
        .then(axiosResp => axiosResp.data);
  }

  deleteServiceAccount(id: string): Observable<string> {
    return this.delete(`/admin/service-accounts/${id}`).pipe(
        mapTo(id)
    );
  }

  get authorizedUsers(): Observable<AuthorizedUserDTO[]> {
    return this.get<AuthorizedUserDTO[]>('/admin/users');
  }

  get axios() {
    return this.axiosInstance;
  }

  private post<T>(url: string, data: any, config?: AxiosRequestConfig): Observable<T> {
    return from(this.axios.post(url, data, config)).pipe(
        map(r => r.data)
    );
  }

  private get<T>(url: string, config?: AxiosRequestConfig): Observable<T> {
    return from(this.axios.get<T>(url, config)).pipe(
        map(r => r.data)
    );
  }

  private delete(url: string): Observable<AxiosResponse> {
    return from(this.axios.delete(url));
  }

  private decorateRequestWithAuthToken = (config: AxiosRequestConfig) => {
    const token = OpenTrappAPI.apiToken;
    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  private handleErrorResponse = (error: any) => {
    console.error(`HTTP request failed, status: ${error.response.status}`, error);
    if (error.response.status === 401) {
      LocalStorage.clearAuthorizedUser();
      window.location.reload();
    }
    return Promise.reject(error);
  };

  private static get apiToken(): string {
    const authorizedUser = LocalStorage.authorizedUser;
    return authorizedUser ? authorizedUser.token : undefined;
  }
}

export const OpenTrappRestAPI = new OpenTrappAPI();
