import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import ErrorHandler from "./ErrorHandler";
import useErrorHandler from "./ErrorHandler";

const timeOut = 60000;

// const errorHandler = useErrorHandler();

export const baseUrl = (): string => {
  return "https://innovative-emotion-production.up.railway.app";
};

export enum CallBackError {
  NetworkError = "Network Error",
}

export const header = async () => {
  const token = "token";

  return {
    "Content-Type": "application/json",
    language: "IDN",
    Authorization: token ?? "",
  };
};

axios.interceptors.request.use((request) => {
  console.debug("-------------------------------------------------------");
  console.debug("METHOD : ", request.method);
  console.debug("URL : ", request.url);
  console.debug("REQUEST HEADER : ", request.headers);
  console.debug("REQUEST BODY : ", JSON.stringify(request.data));
  console.debug("");
  console.debug("REQUEST...");
  console.debug("-------------------------------------------------------");
  return request;
});

axios.interceptors.response.use(
  (response) => {
    const resultResponse: AxiosResponse = response;
    console.debug("");
    console.debug("-------------------------------------------------------");
    console.debug("RESPONSE : ");
    console.debug("RESPONSE REQUEST URL: ", resultResponse.request._url);
    console.debug("RESPONSE STATUS : ", response.status);
    console.debug("RESPONSE HEADER : ", response.headers);
    console.debug("RESPONSE BODY : ", JSON.stringify(response.data));
    console.debug("-------------------------------------------------------");
    return response;
  },
  (error) => {
    const errorResponse: AxiosResponse = error.response;
    console.debug("");
    console.debug("-------------------------------------------------------");
    if (error.message !== "Network Error") {
      console.debug("RESPONSE REQUEST URL: ", errorResponse.request._url);
    }
    console.debug("RESPONSE STATUS : ", error.response.status);
    console.debug("RESPONSE HEADER : ", error.response.headers);
    console.debug("RESPONSE BODY : ", error.response.data);
    console.debug("-------------------------------------------------------");

    return Promise.reject(error);
  }
);

export type ErrorMessageType = (msg?: AxiosError) => string;

async function RequestData(
  config: AxiosRequestConfig,
  isErrorCreate: boolean,
  errorMessage?: ErrorMessageType,
  dismissable?: boolean
): Promise<any> {
  try {
    // resetModal()
    const resp = await axios(config);
    if (resp.status === 200) {
      if (resp.data.code === "00") {
        return JSON.stringify(resp.data);
      }
      if (resp.data.code === "4301") {
        return JSON.stringify(resp.data);
      }
      if (resp.data.code === "5101") {
        return JSON.stringify(resp.data);
      }
      return null;
    } else if (resp.status === 201) {
      return JSON.stringify(resp.data);
    } else if (resp.status === 303) {
      console.log({
        message: resp.data.message,
        status: resp.data.status,
      });
    } else if (resp.status === 400) {
      const e = resp.data.message;
    } else if (resp.data.message === "Network Error") {
      if (isErrorCreate) {
        return CallBackError.NetworkError;
      } else {
        console.log({
            message: resp.data.message,
            status: resp.data.status,
          });
      }
    } else if (resp.status === 401) {
        console.log({
            message: resp.data.message,
            status: resp.data.status,
          });
    } else if (resp.status === 403) {
        console.log({
            message: resp.data.message,
            status: resp.data.status,
          });
    } else if (
      resp.status === 404 ||
      resp.status === 413 ||
      resp.status === 422 ||
      resp.status === 409
    ) {
        console.log({
            message: resp.data.message,
            status: resp.data.status,
          });
    } else if (resp.status === 500) {
        console.log({
            message: resp.data.message,
            status: resp.data.status,
          });
    } else if (resp.status === 503 || resp.status === 525) {
        console.log({
            message: resp.data.message,
            status: resp.data.status,
          });
    } else if (resp.status === 504) {
        console.log({
            message: resp.data.message,
            status: resp.data.status,
          });
    }
    return null;
  } catch (e) {
    console.log("error request", e);
    console.log({
        message: e,
        status: "Bad Request",
      });
    return null;
  } finally {
    console.debug("::FINISH::");
    console.debug("-------------------------------------------------------");
    console.debug("");
  }
}

interface FetchInterface {
  path: string;
  isErrorCreate?: boolean;
  dismissable?: boolean;
  reqBody: {};
  errorMessage?: ErrorMessageType;
}

export async function post(props: FetchInterface) {
  return RequestData(
    {
      method: "POST",
      url: baseUrl() + props.path,
      headers: await header(),
      data: props.reqBody,
      timeout: timeOut,
      timeoutErrorMessage: "Request Timeout",
    },
    props.isErrorCreate ?? false,
    props.errorMessage,
    props.dismissable
  );
}

interface FetchInterfaceGet {
  path: string;
  params?: object;
  isError?: boolean;
}

export async function getImage(props: FetchInterfaceGet) {
  return RequestData(
    {
      method: "GET",
      url: props.path,
      headers: await header(),
      timeout: timeOut,
      timeoutErrorMessage: "Request Timeout",
      params: props.params,
    },
    props.isError ?? false
  );
}

export async function get(props: FetchInterfaceGet) {
  return RequestData(
    {
      method: "GET",
      url: baseUrl() + props.path,
      headers: await header(),
      timeout: timeOut,
      timeoutErrorMessage: "Request Timeout",
      params: props.params,
    },
    props.isError ?? false
  );
}

export async function put(props: FetchInterface) {
  return RequestData(
    {
      method: "PUT",
      url: baseUrl() + props.path,
      headers: await header(),
      data: props.reqBody,
      timeout: timeOut,
      timeoutErrorMessage: "Request Timeout",
    },
    props.isErrorCreate ?? false
  );
}

export async function patch(props: FetchInterface) {
  return RequestData(
    {
      method: "PATCH",
      url: baseUrl() + props.path,
      headers: await header(),
      data: props.reqBody,
      timeout: timeOut,
      timeoutErrorMessage: "Request Timeout",
    },
    props.isErrorCreate ?? false
  );
}

export async function deleted(props: FetchInterface) {
  return RequestData(
    {
      method: "DELETE",
      url: baseUrl() + props.path,
      headers: await header(),
      data: props.reqBody,
      timeout: timeOut,
      timeoutErrorMessage: "Request Timeout",
    },
    props.isErrorCreate ?? false
  );
}
