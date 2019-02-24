import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AuthorizedUser, MonthDTO, ReportingWorkLogDTO } from './dtos';

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
    return this.axiosInstance.get<AuthorizedUser>(
        `/authentication/user-token`,
        {headers: {'id-token': idToken}}
    ).then(axiosResp => axiosResp.data);
  }

  calendarMonth(year: number, month: number): Promise<MonthDTO> {
    return this.axiosInstance.get<MonthDTO>(`/calendar/${year}/${month}`)
        .then(axiosResp => axiosResp.data);
  }

  workLogEntriesForMonth(year: number, month: number): Promise<ReportingWorkLogDTO[]> {
    return this.axiosInstance.get<ReportingWorkLogDTO[]>(`/calendar/${year}/${month}/work-log/entries`)
        .then(axiosResp => axiosResp.data);
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
    if ( error.status === 401 ) {
      OpenTrappAPI.removeAuthorizationFromSessionStorage();
    }
    return Promise.reject(error);
  };

  private static get apiToken(): string {
    const storageUser = sessionStorage.getItem('OpenTrappUser');
    return storageUser ? JSON.parse(storageUser).token : undefined;
  }

  private static removeAuthorizationFromSessionStorage() {
    sessionStorage.removeItem('OpenTrappUser');
  }
}

export const OpenTrappRestAPI = new OpenTrappAPI();
