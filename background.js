import { supabase } from "./supabase.js";
import { addTime, getAllData, getDayTotal } from "./supabaseDb.js";
import { removeTime } from "./indexedDb.js";
import * as indexedDBOld from "./indexedDb.js";

const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

let authReadyResolve;

const authReady = new Promise((resolve) => {
  authReadyResolve = resolve;
});

async function signIn() {

  return new Promise(async (resolve, reject) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: chrome.identity.getRedirectURL(),
        skipBrowserRedirect: true
      }
    });

    if (error) {
      console.error(error);
      reject(error);
      return;
    }

    const authUrl = data.url

    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true
      },
      async (callbackUrl) => {

        console.log("CALLBACK URL", callbackUrl)

        const runTimeError = chrome.runtime.lastError;
        if (runTimeError) {
          console.error(runTimeError);
          reject(runTimeError);
          return;
        }

        try {

          const url = new URL(callbackUrl)

          const access_token = url.hash.match(/access_token=([^&]+)/)?.[1]
          const refresh_token = url.hash.match(/refresh_token=([^&]+)/)?.[1]

          if (!access_token) {
            console.error("No access token");
            reject("No access token");
            return;
          }

          const { sessionData, sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token
          });

          await browserAPI.storage.local.set({
            supabaseSession: {
              access_token,
              refresh_token
            }
          });

          if (error) {
            console.error("Error setting session:", sessionError);
            reject(sessionError);
            return;
          }

          authReadyResolve();
          resolve(sessionData);
        } catch (e) {
          console.error("Error during authentication:", e);
          reject(e);
        }
      }
    );
  });
}

async function migrateIndexedDBToSupabase() {

  console.log("STARTING MIGRATION");

  const oldData = await indexedDBOld.getAllData();

  console.log("OLD DATA", oldData);

  for (const category in oldData) {

    const categoryEntries = oldData[category];

    for (const dayEntry of categoryEntries) {

      const date = dayEntry.date;

      const websites = dayEntry.websites;

      for (const website in websites) {

        const seconds = websites[website];

        console.log(
          "MIGRATING",
          category,
          date,
          website,
          seconds
        );

        await addTime(
          category,
          date,
          website,
          seconds
        );
      }
    }
  }

  console.log("MIGRATION COMPLETE");
}

async function initializeAuth() {

  const result = await new Promise((resolve) => {
    browserAPI.storage.local.get(
      "supabaseSession",
      resolve
    );
  });

  const savedSession = result.supabaseSession;

  if (savedSession) {
    console.log("Restoring saved session");

    const { error } =
      await supabase.auth.setSession({
        access_token: savedSession.access_token,
        refresh_token: savedSession.refresh_token
      });

    if (!error) {
      console.log("Session restored!");

      authReadyResolve();

      return;
    }

    console.error("Failed to restore session", error);

    console.error("Failed to restore session", error);

    await browserAPI.storage.local.remove(
      "supabaseSession"
    );
  }

  console.log("No session found");
}

initializeAuth();

supabase.auth.onAuthStateChange(
  async (event, session) => {

    console.log("AUTH EVENT", event);

    if (session) {

      await browserAPI.storage.local.set({
        supabaseSession: {
          access_token: session.access_token,
          refresh_token: session.refresh_token
        }
      });

      console.log("Saved updated session");
    }
  }
);

function updateIcon(tabId, state) {
  let suffix = '';
  if (state === 'active') {
    suffix = '-active';
  } else if (state === 'inactive') {
    suffix = '-inactive';
  } else if (state === 'error') {
    suffix = '-error';
  }

  browserAPI.action.setIcon({
    tabId: tabId,
    path: {
      "16": `icons/icon16${suffix}.png`,
      "48": `icons/icon48${suffix}.png`,
      "128": `icons/icon128${suffix}.png`
    }
  });
}

browserAPI.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'updateIcon') {
    if (sender.tab) {
      // Message from content script
      updateIcon(sender.tab.id, message.state);
    } else if (message.tabId) {
      // Message from popup with explicit tabId
      updateIcon(message.tabId, message.state);
    }
  } else if (message.type === "addTime") {
    addTime(message.category, message.date, message.website, message.time);
    // } else if (message.type === "removeTime") {
    //   removeTime(message.category, message.date, message.website, message.time);
  } else if (message.type === "getAllData") {

    await authReady;

    return getAllData();
  } else if (message.type === "getDayTotal") {

    await authReady;

    return getDayTotal(message.date);
  } else if (message.type === "signIn") {

    await signIn();

    return true;
  } else if (message.type === "isAuthenticated") {

    console.log("Await Auth");
    await authReady;

    console.log("Auth Finished")

    const {
      data: { session }
    } = await supabase.auth.getSession();

    return !!session;
  }
});