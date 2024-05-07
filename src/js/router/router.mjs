import { init as initAuthentication } from "../auth/authentication.mjs";
import { init as initProfile } from "../profile/profile.mjs";
import { init as initDisplayListings } from "../feed/feedPosts.mjs";
import { init as initCreateListing } from "../feed/createPost.mjs";
import { init as initSearch } from "../feed/search.mjs";
import { init as initLogout } from "../shared/logout.mjs";

function router() {
  const pathname = window.location.pathname;

  switch (pathname) {
    case "/":
    case "/index.html":
      initAuthentication();
      break;

    case "/profile/":
    case "/profile/index.html":
      initProfile();

      initLogout();
      break;

    case "/feed/":
    case "/feed/index.html":
      initDisplayListings();
      initCreateListing();
      initSearch();

      initLogout();
      break;

    default:
      console.error(`Unknown path ${pathname}`);
      break;
  }
}

router();
