declare namespace google.accounts.oauth2 {
  interface TokenClient {
    callback: (response: any) => void;
    requestAccessToken: (options: { prompt: string }) => void;
  }

  function initTokenClient(config: {
    client_id: string;
    scope: string;
    callback: (response: any) => void;
  }): TokenClient;
}

declare namespace gapi {
  let client: any;
  function load(api: string, callback: () => void): void;
}
