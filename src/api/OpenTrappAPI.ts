
export class OpenTrappAPI {

    static get apiRootUrl(): string {
        return process.env.REACT_APP_API_URL as string;
    }
}
