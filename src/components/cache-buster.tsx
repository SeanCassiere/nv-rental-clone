// Ripped the implementation of react-cache-buster
// from https://github.com/CagriAldemir/react-cache-buster/
// to make it React 19 compatible
import * as React from "react";
import { compare } from "compare-versions";

import { useEventListener } from "@/lib/hooks/useEventListener";

type OnCacheClearFn = (callback?: () => void) => Promise<void>;

const CacheBusterContext = React.createContext<{
  checkCacheStatus: OnCacheClearFn;
}>({ checkCacheStatus: async () => {} });

interface CacheBusterProps {
  children?: any;
  currentVersion: string;
  isEnabled?: boolean;
  isVerboseMode?: boolean;
  loadingComponent?: React.ReactNode;
  metaFileDirectory?: string | null;
  reloadOnDowngrade?: boolean;
  onCacheClear?: OnCacheClearFn;
}

function CacheBuster({
  children = null,
  currentVersion,
  isEnabled = false,
  isVerboseMode = false,
  loadingComponent = null,
  metaFileDirectory = null,
  reloadOnDowngrade = false,
  onCacheClear,
}: CacheBusterProps): React.ReactNode {
  const [cacheStatus, setCacheStatus] = React.useState({
    loading: true,
    isLatestVersion: false,
  });

  const isThereNewVersion = React.useCallback(
    (metaVersion: string, currentVersion: string) => {
      if (reloadOnDowngrade) {
        return !compare(metaVersion, currentVersion, "=");
      }
      return compare(metaVersion, currentVersion, ">");
    },
    [reloadOnDowngrade]
  );

  const getMetaFileDirectory = React.useCallback(() => {
    return !metaFileDirectory || metaFileDirectory === "."
      ? ""
      : metaFileDirectory;
  }, [metaFileDirectory]);

  const log = React.useCallback(
    (message: any, isError?: boolean) => {
      isVerboseMode &&
        (isError ? console.error(message) : console.log(message));
    },
    [isVerboseMode]
  );

  const checkCacheStatus: OnCacheClearFn = React.useCallback(
    async (cb) => {
      try {
        const res = await fetch(`${getMetaFileDirectory()}/meta.json`);
        const { version: metaVersion } = await res.json();

        const shouldForceRefresh = isThereNewVersion(
          metaVersion,
          currentVersion
        );
        if (shouldForceRefresh) {
          log(
            `There is a new version (v${metaVersion}). Should force refresh.`
          );
          setCacheStatus({
            loading: false,
            isLatestVersion: false,
          });
          cb?.();
        } else {
          log("There is no new version. No cache refresh needed.");
          setCacheStatus({
            loading: false,
            isLatestVersion: true,
          });
        }
      } catch (error) {
        log("An error occurred while checking cache status.", true);
        log(error, true);

        //Since there is an error, if isVerboseMode is false, the component is configured as if it has the latest version.
        !isVerboseMode &&
          setCacheStatus({
            loading: false,
            isLatestVersion: true,
          });
      }
    },
    [
      currentVersion,
      getMetaFileDirectory,
      isThereNewVersion,
      isVerboseMode,
      log,
    ]
  );

  React.useEffect(() => {
    isEnabled ? void checkCacheStatus() : log("Cache Buster is disabled.");
  }, [checkCacheStatus, isEnabled, log]);

  const refreshCacheAndReload = async () => {
    try {
      if (window?.caches) {
        const { caches } = window;
        const cacheNames = await caches.keys();
        const cacheDeletionPromises = cacheNames.map((n) => caches.delete(n));

        await Promise.all(cacheDeletionPromises);

        log("The cache has been deleted.");
        // @ts-ignore: Firefox still has a `forceReload` parameter.
        window.location.reload(true);
      }
    } catch (error) {
      log("An error occurred while deleting the cache.", true);
      log(error, true);
    }
  };

  if (!isEnabled) {
    return children;
  } else {
    if (cacheStatus.loading) {
      return loadingComponent;
    }

    if (!cacheStatus.loading && !cacheStatus.isLatestVersion) {
      if (onCacheClear) {
        onCacheClear(refreshCacheAndReload);
      } else {
        refreshCacheAndReload();
      }
      return null;
    }

    return (
      <CacheBusterContext.Provider value={{ checkCacheStatus }}>
        {children}
      </CacheBusterContext.Provider>
    );
  }
}
CacheBuster.displayName = "CacheBuster";

function useCacheBuster() {
  const context = React.useContext(CacheBusterContext);
  if (context === undefined || context === null) {
    throw new Error(
      "useCacheBuster must be used within a CacheBuster component."
    );
  }
  return context;
}

function CacheDocumentFocusChecker() {
  const documentRef = React.useRef<Document>(document);

  const { checkCacheStatus } = useCacheBuster();

  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      checkCacheStatus();
    }
  };

  useEventListener("visibilitychange", onVisibilityChange, documentRef);

  return null;
}

export { CacheBuster, CacheDocumentFocusChecker, useCacheBuster };
