import request from "graphql-request";
import * as rp from "request-promise";

//Test client class for graphql requests
export class TestClient {
  url: string = process.env.TEST_HOST as string;
  options: {
    jar: any;
    withCredentials: boolean;
    json: boolean;
  };

  constructor() {
    this.options = {
      json: true,
      jar: rp.jar(),
      withCredentials: true,
    };
  }

  async getProperty(propertyId: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `query {
          getProperty(propertyId:"${propertyId}") {
            __typename
            ...on FieldErrors {
              errors{
                message
                path
              }
            }
            ...on Error {
              message
              path
            }
            ...on Property {
              service_name
              domain
              ua_id
              id
            }
          }
        }    
        `,
      },
    });
  }

  async getProperties() {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `query {
          getUserProperties {
            __typename
            ...on Error {
              message
              path
            }
            ...on PropertyList {
              properties {
                domain
                ua_id
                service_name
              }
            }
            ...on NoProperties {
              message
            }
          }
        }        
        `,
      },
    });
  }

  async isResetLinkValid(key: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `query {
          isResetLinkValid(key: "${key}") 
        }`,
      },
    });
  }

  async resetPassword(newPassword: string, key: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `mutation {
          resetPassword(newPassword: "${newPassword}", key: "${key}") {
            __typename
            ...on FieldErrors {
              errors {
                path
                message
              }
            }
            
            ...on Error {
              message
            }
            
            ...on Success {
              message
            }
          }
        }`,
      },
    });
  }

  async sendForgotPassword(email: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `mutation {
        sendForgotPasswordEmail(email: "${email}") {
          __typename
          ...on FieldErrors {
            errors {
              path
              message
            }
          }
          ...on Error {
            message
          }
          ...on Success {
            message
          }
        }
      }`,
      },
    });
  }

  async getUser() {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `query {
          getUser {
            email
            id
          }
        }`,
      },
    });
  }

  async logout() {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `mutation {
          logout
          }`,
      },
    });
  }

  async login(email: string, password: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `mutation {
          login(email: "${email}", password:"${password}"){
            __typename
            ...on Error {
              message
            }
            ...on Success {
              message
            }
          }
        }`,
      },
    });
  }

  async resendConfrimation(email: string) {
    return request(
      this.url,
      `mutation {
            resendConfirmationEmail(email:"${email}"){
              __typename
              ...on ConfirmationEmailSent {
                message
              }
              
              ...on EmailNotSentError {
                message
              }
            }
          }`
    );
  }

  async register(email: string, password: string, name: string, role: string) {
    return request(
      this.url,
      `mutation {
        register(email: "${email}", password: "${password}", name: "${name}", role: "${role}" ) {
          __typename
          ... on UserRegistered {
            message
          }
          ... on FieldErrors {
            errors {
             message
              path
            }
          }
          ... on UserAlreadyExistsError {
            message
            path
          }
        }
      }`
    );
  }
}