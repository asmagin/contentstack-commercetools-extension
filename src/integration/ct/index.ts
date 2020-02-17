import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

import SdkAuth from '@commercetools/sdk-auth';

import { Config, Token } from './models';

const getToken = async (config: Config): Promise<Token> => {
  const authClient = new SdkAuth({
    host: `https://auth.${config.domain}`,
    projectKey: config.project_key,
    disableRefreshToken: false,
    credentials: {
      clientId: config.client_id,
      clientSecret: config.client_secret,
    },
    scopes: [`view_products:${config.project_key}`],
    fetch,
  });

  try {
    const token: Token = (await authClient.clientCredentialsFlow()) as Token;
    return token;
  } catch (ex) {
    console.error('Failed to get authentication token from commercetools', ex);
    throw ex;
  }
};

export const getGQLClient = async (config: any) => {
  const token = await getToken(config);

  const cache = new InMemoryCache();
  const link = new HttpLink({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token.token_type} ${token.access_token}`,
    },
    uri: `https://api.${config.domain}/${config.project_key}/graphql`,
  });

  const client = new ApolloClient({
    cache,
    link,
  });

  return client;
};

export const getRestClient = async (config: any) => {
  const token = await getToken(config);

  const client = async (
    url: string,
    method?: string,
    headers?: object,
    body?: any
  ) => {
    const response = await fetch(
      `https://api.${config.domain}/${config.project_key}/${url}?`,
      {
        method: method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token.token_type} ${token.access_token}`,
          ...headers,
        },
        body: body,
      }
    );

    const result = await response.json()

    return result;
  };

  return client;
};
