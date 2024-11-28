import { Task } from "../types/types";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar";

let tokenClient: google.accounts.oauth2.TokenClient;
let gapiInited = false;
let gisInited = false;

// Add token persistence
const TOKEN_STORAGE_KEY = "google_calendar_token";

const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

const loadToken = () => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const initializeGoogleAPI = async () => {
  return new Promise((resolve, reject) => {
    // Load the Google API client library
    const script1 = document.createElement("script");
    script1.src = "https://apis.google.com/js/api.js";
    script1.onload = () => {
      gapi.load("client", async () => {
        try {
          await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
          });
          gapiInited = true;
          console.log("GAPI initialized");

          // Try to restore the token if it exists
          const savedToken = loadToken();
          if (savedToken) {
            gapi.client.setToken({ access_token: savedToken });
          }

          maybeResolve();
        } catch (error) {
          console.error("Error initializing GAPI:", error);
          reject(error);
        }
      });
    };
    document.body.appendChild(script1);

    // Load the Google Identity Services library
    const script2 = document.createElement("script");
    script2.src = "https://accounts.google.com/gsi/client";
    script2.onload = () => {
      try {
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (response) => {
            if (response.access_token) {
              saveToken(response.access_token);
            }
          },
        });
        gisInited = true;
        console.log("GIS initialized");
        maybeResolve();
      } catch (error) {
        console.error("Error initializing GIS:", error);
        reject(error);
      }
    };
    document.body.appendChild(script2);

    function maybeResolve() {
      if (gapiInited && gisInited) {
        resolve(true);
      }
    }
  });
};

export const handleAuthClick = () => {
  return new Promise((resolve, reject) => {
    if (!gapiInited || !gisInited) {
      reject(new Error("Google API not initialized"));
      return;
    }

    try {
      // Check if we already have a valid token
      if (gapi.client.getToken()) {
        resolve(gapi.client.getToken());
        return;
      }

      // Set the callback before requesting token
      tokenClient.callback = async (resp) => {
        if (resp.error) {
          clearToken();
          reject(resp);
          return;
        }
        if (resp.access_token) {
          saveToken(resp.access_token);
        }
        resolve(resp);
      };

      tokenClient.requestAccessToken({ prompt: "" });
    } catch (error) {
      console.error("Auth error:", error);
      clearToken();
      reject(error);
    }
  });
};

// Add RecurrenceOption type
export type RecurrenceOption =
  | "none"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly";

export const addToGoogleCalendar = async (
  task: Task,
  recurrence: RecurrenceOption = "none",
  duration: number = 365 // Default to 1 year
) => {
  try {
    if (!gapi.client.getToken()) {
      throw new Error("Not authenticated");
    }

    console.log("Adding event to calendar:", task);

    const startDate = new Date(task.dueDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + duration);

    const event: any = {
      summary: task.title,
      description: task.description,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: new Date(startDate.getTime() + 30 * 60000).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      reminders: {
        useDefault: false,
        overrides: [{ method: "popup", minutes: 10 }],
      },
    };

    // Add recurrence rule if not 'none'
    if (recurrence !== "none") {
      const untilDate =
        endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      event.recurrence = [
        `RRULE:FREQ=${recurrence.toUpperCase()};UNTIL=${untilDate}`,
      ];
    }

    const request = await gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });

    console.log("Event added successfully:", request.result);
    return request.result;
  } catch (error) {
    console.error("Error adding to Google Calendar:", error);
    if ((error as any).status === 401) {
      clearToken();
    }
    throw error;
  }
};

// Add a function to check if user is already authenticated
export const isAuthenticated = () => {
  return !!gapi.client?.getToken();
};
