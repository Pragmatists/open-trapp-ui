import axios from 'axios';
import { AuthorizedUser } from './dtos';

export class OpenTrappAPI {
  static obtainJWTToken(idToken: string) {
    return axios.get<AuthorizedUser>(
      `${OpenTrappAPI.apiRootUrl}/authentication/user-token`,
      {headers: {'id-token': idToken}}
    ).then(axiosResp => axiosResp.data);
  }

  private static get apiRootUrl(): string {
    return `${process.env.REACT_APP_API_URL}/api/v1`;
  }
}
