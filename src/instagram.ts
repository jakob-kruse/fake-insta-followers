import { config } from "dotenv";
import {
  AccountRepositoryLoginResponseLogged_in_user as IGUser,
  IgApiClient,
} from "instagram-private-api";
import { translate } from "./mapChars";

const ig = new IgApiClient();

let previousValues = {
  followers: null,
  follower1: null,
  follower2: null,
};

function makeBio(
  follower1: string,
  follower2: string,
  currentFollowers: number
): string {
  return `Followed by ${translate(follower1)}, ${translate(
    follower2
  )} and ${translate(`${currentFollowers - 2} others`)}`;
}

export async function getFollowers(pk: number): Promise<number> {
  let followers = -1;

  try {
    followers = (await ig.feed.accountFollowers(pk).items()).length;
  } catch (_) {
    return -1;
  }

  return followers;
}

async function setupUser(): Promise<IGUser> {
  let loggedInAccount: IGUser;

  try {
    if (!ig.state.deviceId) {
      ig.state.generateDevice(process.env.IG_USERNAME);
    }

    await ig.simulate.preLoginFlow();

    loggedInAccount = await ig.account.login(
      process.env.IG_USERNAME,
      process.env.IG_PASSWORD
    );
  } catch (_) {
    throw new Error("Invalid credentials provided. Check you .env file");
  }

  return loggedInAccount;
}

function postLogin(): void {
  process.nextTick(async () => await ig.simulate.postLoginFlow());
}

function shouldUpdate(followers: number): boolean {
  const {
    IG_FOLLOWER1: envFollower1,
    IG_FOLLOWER2: envFollower2,
  } = process.env;

  const {
    follower1: prevFollower1,
    follower2: prevFollower2,
    followers: prevFollowers,
  } = previousValues;

  previousValues = {
    followers,
    follower1: envFollower1,
    follower2: envFollower2,
  };

  if (process.env.IS_CRON === "true") return true;

  if (envFollower1 !== prevFollower1) return true;
  if (envFollower2 !== prevFollower2) return true;

  if (prevFollowers !== followers) return true;
  return false;
}

export async function updateBio(): Promise<void> {
  if (process.env.NO_ENV_FILE !== "true") {
    config();
  }

  const loggedInUser = await setupUser();

  const followers = await getFollowers(loggedInUser.pk);

  if (followers === -1) {
    if (process.env.SKIP_ON_ERROR !== "true") {
      throw new Error(
        "Fetching followers failed. You may have not provided wrong credentials"
      );
    }
  }

  const delay = Math.round(Math.random() * 1000 * 60 * 60);

  if (shouldUpdate(followers)) {
    ig.account.setBiography(
      makeBio(process.env.IG_FOLLOWER1, process.env.IG_FOLLOWER2, followers)
    );

    if (process.env.IS_CRON !== "true") {
      console.log(`Updated Bio. Next update in ${delay / 1000 / 60} minutes!`);
    }
  } else {
    console.log(
      `Did not update bio because nothing changed. Next try in ${
        delay / 1000 / 60
      } minutes!`
    );
  }

  postLogin();

  if (process.env.IS_CRON === "true") {
    return;
  }

  setTimeout(updateBio, delay);
}
