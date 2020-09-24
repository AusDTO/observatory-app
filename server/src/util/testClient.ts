import request from "graphql-request";
import * as rp from "request-promise";
import node_fetch from "node-fetch";

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

  async addDataOutput(token: string, ua_id: string, bodyData: any) {
    return node_fetch(`http://localhost:4000/api/output/${ua_id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: bodyData,
    });
  }

  async editProperty(token: string, propertyId: string, bodyData: any) {
    return node_fetch(`http://localhost:4000/api/properties/${propertyId}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: bodyData,
    });
  }

  async viewProperties(token: string) {
    return node_fetch("http://localhost:4000/api/properties", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
  }

  async addProperty(token: string, bodyData: any) {
    return node_fetch("http://localhost:4000/api/properties", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: bodyData,
    });
  }

  async deleteAgency(id: string, token: string) {
    return node_fetch(`http://localhost:4000/api/agencies/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
  }

  async addAgency(bodyData: any, token: string) {
    return node_fetch("http://localhost:4000/api/agencies", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: bodyData,
    });
  }

  async getAgenciesByName(token: string, name: string) {
    return node_fetch(`http://localhost:4000/api/agencies/${name}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
  }

  async getAgencies(token: string) {
    return node_fetch("http://localhost:4000/api/agencies", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
  }

  async loginAdminUser(email: string, password: string) {
    const body = { email, password };
    return node_fetch("http://localhost:4000/api/admin/login", {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
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
