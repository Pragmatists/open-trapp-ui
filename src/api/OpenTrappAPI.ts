import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import moment from 'moment';
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

class OpenTrappAPI {
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

  obtainJWTToken(idToken: string) {
    return this.axios.get<AuthorizedUser>(
        `/authentication/user-token`,
        {headers: {'id-token': idToken}}
    ).then(axiosResp => axiosResp.data);
  }

  calendarMonth(year: number, month: number): Promise<MonthDTO> {
    return this.axios.get<MonthDTO>(`/calendar/${year}/${month}`)
        .then(axiosResp => axiosResp.data);
  }

  workLogEntriesForMonth(year: number, month: number): Promise<ReportingWorkLogDTO[]> {
    return this.axios.get<ReportingWorkLogDTO[]>(`/calendar/${year}/${month}/work-log/entries`)
        .then(axiosResp => axiosResp.data);
  }

  saveWorkLog(day: string, tags: string[], workload: string, username: string): Promise<string> {
    return this.axios.post<{ id: string }>(
        `/employee/${username}/work-log/entries`,
        {
          projectNames: tags,
          workload,
          day
        }
    ).then(axiosResp => axiosResp.data.id);
  }

  updateWorkLog(id: string, tags: string[], workload: string): Promise<ReportingWorkLogDTO> {
    return this.axios.put<ReportingWorkLogDTO>(
        `/work-log/entries/${id}`,
        {
          projectNames: tags,
          workload
        }
    ).then(axiosResp => axiosResp.data);
  }

  removeWorkLog(id: string): Promise<void> {
    return this.axios.delete(`/work-log/entries/${id}`)
        .then(() => undefined);
  }

  validateBulkEditQuery(query: string): Promise<AffectedEntriesDTO> {
    return this.axios.get<AffectedEntriesDTO>(`/work-log/bulk-update/${query}`)
        .then(axiosResp => axiosResp.data);
  }

  bulkEdit(requestBody: BulkEditDTO): Promise<AffectedEntriesDTO> {
    return this.axios.post<AffectedEntriesDTO>('/work-log/bulk-update', requestBody)
        .then(axiosResp => axiosResp.data);
  }

  tags(numberOfPastMonths?: number): Promise<string[]> {
    const url = numberOfPastMonths ?
        `/projects?dateFrom=${moment().subtract(numberOfPastMonths, 'months').format('YYYY-MM-DD')}` :
        '/projects';
    return this.axios.get<string[]>(url)
        .then(axiosResp => axiosResp.data);
  }

  presets(limit?: number): Promise<string[][]> {
    const url = limit ? `/projects/presets?limit=${limit}` : '/projects/presets';
    return this.axios.get<string[][]>(url)
        .then(axiosResp => axiosResp.data);
  }

  get serviceAccounts(): Promise<ServiceAccountDTO[]> {
    return this.axios.get<ServiceAccountDTO[]>('/admin/service-accounts')
        .then(axiosResp => axiosResp.data);
  }

  creteServiceAccount(name: string): Promise<CreateServiceAccountResponseDTO> {
    return this.axios.post<CreateServiceAccountResponseDTO>('/admin/service-accounts', {name})
        .then(axiosResp => axiosResp.data);
  }

  deleteServiceAccount(id: string): Promise<{}> {
    return this.axios.delete(`/admin/service-accounts/${id}`);
  }

  get authorizedUsers(): Promise<AuthorizedUserDTO[]> {
    return this.axios.get<AuthorizedUserDTO[]>('/admin/users')
        .then(axiosResp => axiosResp.data);
  }

  updateAuthorizedUser(username: string, roles: string[]): Promise<{}> {
    return this.axios.put<{}>(`/admin/users/${username}`, {roles});
  }

  get axios() {
    return this.axiosInstance;
  }

  private decorateRequestWithAuthToken = (config: AxiosRequestConfig) => {
    const token = OpenTrappAPI.apiToken;
    if (token != null) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  private handleErrorResponse = (error: any) => {
    if (error.status === 401) {
      OpenTrappAPI.removeAuthorizationFromLocalStorage();
    }
    return Promise.reject(error);
  };

  private static get apiToken(): string {
    const authorizedUser = OpenTrappAPI.authorizedUser;
    return authorizedUser ? authorizedUser.token : undefined;
  }

  private static get authorizedUser(): any {
    return LocalStorage.authorizedUser
  }

  private static removeAuthorizationFromLocalStorage() {
    localStorage.removeItem('OpenTrappUser');
  }
}

export const OpenTrappRestAPI = new OpenTrappAPI();
