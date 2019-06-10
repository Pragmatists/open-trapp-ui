
export interface AuthorizedUser {
  readonly token: string;
  readonly email: string;
  readonly name: string;
  readonly displayName: string;
  readonly profilePicture: string;
  readonly roles: string[];
}

export interface MonthDTO {
  readonly id: string;
  readonly link: string;
  readonly next: LinkDTO;
  readonly prev: LinkDTO;
  readonly days: DayDTO[];
}

interface DayDTO {
  readonly id: string;
  readonly link: string;
  readonly weekend: boolean;
  readonly holiday: boolean;
}

interface LinkDTO {
  readonly link: string;
}

export interface ReportingWorkLogDTO {
  readonly link: string;
  readonly id: string,
  readonly workload: number,
  readonly projectNames: string[],
  readonly employee: string,
  readonly day: string
}

export interface AffectedEntriesDTO {
  readonly entriesAffected: number;
}

export interface BulkEditDTO {
  readonly query: string;
  readonly expression: string;
}

export interface ServiceAccountDTO {
  name: string;
  clientID: string;
  owner: string;
}

export interface AuthorizedUserDTO {
  email: string;
  name: string;
  roles: string[];
}

export interface CreateServiceAccountResponseDTO {
  clientID: string;
  secret: string;
}
