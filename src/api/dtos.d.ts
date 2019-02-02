
export interface AuthorizedUser {
  token: string;
  email: string;
  name: string;
  displayName: string;
  profilePicture: string;
  roles: string[];
}