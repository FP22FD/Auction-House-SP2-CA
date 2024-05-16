// import { init as initStart } from "../index/index.mjs";
import { init as initAuthentication } from "../auth/authentication.mjs";
import { init as initProfile } from "../profile/index.mjs";
import { init as initDisplayListings } from "../feed/index.mjs";
import { init as initCreateListing } from "../feed/createListing.mjs";
import { init as initSearch } from "../feed/search.mjs";
import { init as initNotAuthorized } from "../feed/notAuthorized.mjs";
import { init as initLogout } from "../shared/logout.mjs";
import { load } from "../shared/storage.mjs";
import { APP_GITHUB_PAGES_REPO } from "../settings.mjs";

function router() {
  let pathname = window.location.pathname;

  if (APP_GITHUB_PAGES_REPO) {
    pathname = pathname.replace(`/${APP_GITHUB_PAGES_REPO}`, "");
  }

  const token = load("token");
  const isAuth = !!token;

  switch (pathname) {
    case "/":
    case "/index.html":
      // initStart();
      break;

    case "/auth/index.html":
      initAuthentication();
      break;

    case "/profile/":
    case "/profile/index.html":
      initProfile();

      initLogout();
      break;

    case "/feed/":
    case "/feed/index.html":
      if (isAuth) {
        initDisplayListings();
        initCreateListing();
        initSearch();

        initLogout();
      } else {
        initDisplayListings();
        initSearch();

        initNotAuthorized();
      }
      break;

    default:
      console.error(`Unknown path ${pathname}`);
      break;
  }
}

router();
