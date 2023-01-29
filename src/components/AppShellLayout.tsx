/* eslint @typescript-eslint/no-unused-vars: 0 */
import React, { Fragment, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Link,
  // useRouterStore,
  useRouter,
} from "@tanstack/react-router";
import classNames from "classnames";

import {
  RectangleGroupSolid,
  DocumentTextSolid,
  MagnifyingGlassOutline,
  BellIconOutline,
  SettingsCogOutline,
  HamburgerMenuOutline,
  XMarkOutline,
  UsersSolid,
  BookFilled,
  TruckFilled,
} from "./icons";
import { useGetUserProfile } from "../hooks/network/user/useGetUserProfile";
import { removeAllLocalStorageKeysForUser } from "../utils/user-local-storage";

const AppShellLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const auth = useAuth();

  const router = useRouter();

  const routerStore = router.store.state;
  // const routerStore = useRouterStore();

  const matches = (routes: string[], mode: "=" | "~" = "~") => {
    const matching: string[] = [
      ...routerStore.currentMatches.map((mat) => mat.route.fullPath),
    ];

    // because this comes out like ['/','/customers','/customers/$customerId'] or ['/','/']
    // we take out the first element in the array
    matching.shift();

    if (mode === "=") {
      // exact match
      // return matching.some((mat) => mat === routes);

      return routes.some((route) => matching.includes(route as any));
    }
    // return matching.some((mat) => mat.includes(routes));
    return matching.some((mat) => routes.includes(mat));
  };

  const userProfile = useGetUserProfile();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: RectangleGroupSolid,
      current: matches(["/"], "="),
      props: {},
    },
    {
      name: "Customers",
      href: "/customers",
      icon: UsersSolid,
      current: matches(["/customers", "/customers/$customerId"]),
      props: {},
    },
    {
      name: "Vehicles",
      href: "/fleet",
      icon: TruckFilled,
      current: matches(["/fleet", "/fleet/$vehicleId"]),
      props: {},
    },
    {
      name: "Reservations",
      href: "/reservations",
      icon: BookFilled,
      current: matches(["/reservations", "/reservations/$reservationId"]),
      props: {},
    },
    {
      name: "Agreements",
      href: "/agreements",
      icon: DocumentTextSolid,
      current: matches(["/agreements", "/agreements/$agreementId"]),
      props: {},
    },
  ];

  const userNavigation = [
    { name: "Your profile", type: "Link", props: {} },
    { name: "Settings", type: "Link", props: {} },
    {
      name: "Sign out",
      type: "Button",
      props: {
        onClick: () => {
          if (
            auth.user?.profile.navotar_clientid &&
            auth.user?.profile.navotar_userid
          ) {
            removeAllLocalStorageKeysForUser(
              auth.user?.profile.navotar_clientid,
              auth.user?.profile.navotar_userid
            );
          }
          auth.signoutRedirect();
        },
      },
    },
  ];

  if (!auth.isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-40 flex md:hidden"
          onClose={() => setSidebarOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              aria-hidden="true"
            />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-slate-50 pt-5 pb-4">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkOutline
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex flex-shrink-0 items-center px-4">
                <img
                  className="h-8 w-auto"
                  // src="https://tailwindui.com/img/logos/workflow-logo-teal-600-mark-gray-800-text.svg"
                  src="/rental-logo-full.png"
                  alt="RENTAL"
                  style={{ imageRendering: "crisp-edges" }}
                />
              </div>
              <div className="mt-5 h-0 flex-1 overflow-y-auto">
                <nav className="space-y-1 px-2">
                  {/* render in mobile sidebar */}
                  {navigation.map((item) => (
                    <span key={item.name} onClick={() => setSidebarOpen(false)}>
                      <Link
                        to={item.href as any}
                        preload="intent"
                        className={classNames(
                          item.current
                            ? "bg-slate-100 text-teal-400"
                            : "text-slate-600 hover:bg-slate-50 hover:text-teal-500",
                          "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                        )}
                        {...item.props}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-teal-400"
                              : "text-slate-400 group-hover:text-teal-500",
                            "mr-4 h-6 w-6 flex-shrink-0"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </span>
                  ))}
                </nav>
              </div>
            </Dialog.Panel>
          </Transition.Child>
          <div className="w-14 flex-shrink-0" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      {/* md:w-64 */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-16 md:flex-col md:overflow-hidden">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-slate-200 bg-slate-50 pt-4">
          <div className="flex flex-shrink-0 items-center px-2">
            <img
              className="h-7 w-auto"
              src="/rental-logo.png"
              alt="RENTAL"
              style={{ imageRendering: "crisp-edges" }}
            />
          </div>
          <div className="mt-4 flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 pb-4">
              {/* render in desktop sidebar */}
              {navigation.map((item) => (
                <Link<any>
                  key={item.name}
                  to={item.href as any}
                  className={classNames(
                    item.current
                      ? "bg-slate-100  text-teal-400"
                      : "text-slate-600 hover:bg-slate-50 hover:text-teal-500",
                    "group flex items-center px-2 py-4 text-sm font-medium"
                  )}
                  preload="intent"
                  {...item.props}
                >
                  <item.icon
                    className={classNames(
                      item.current
                        ? "text-teal-400"
                        : "text-slate-400 group-hover:text-teal-500",
                      "mx-auto h-5 w-5 flex-shrink-0"
                    )}
                    aria-hidden="true"
                  />
                  {/* {item.name} */}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      {/* md:pl-64 */}
      <div className="flex flex-1 flex-col md:pl-16">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="border-r border-slate-200 px-4 text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-400 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <HamburgerMenuOutline className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <form className="flex w-full md:ml-0" action="#" method="GET">
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <div className="relative w-full text-slate-400 focus-within:text-slate-600">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                    <MagnifyingGlassOutline
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    id="search-field"
                    className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-slate-900 placeholder-slate-500 focus:border-transparent focus:placeholder-slate-400 focus:outline-none focus:ring-0 sm:text-sm"
                    placeholder="Search"
                    type="search"
                    name="search"
                    autoComplete="off"
                  />
                </div>
              </form>
            </div>
            <div className="ml-4 flex items-center gap-1 md:ml-6">
              <button
                type="button"
                className="rounded-full bg-white p-1 text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-0"
              >
                <span className="sr-only">View notifications</span>
                <BellIconOutline className="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="rounded-full bg-white p-1 text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-0"
              >
                <span className="sr-only">View settings</span>
                <SettingsCogOutline className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-1.5">
                <div>
                  <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={
                        userProfile.data?.userName
                          ? `https://avatars.dicebear.com/api/miniavs/${userProfile.data.userName}.svg?mood[]=happy`
                          : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      }
                      alt="User profile picture"
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => {
                          if (item.type === "Link") {
                            return (
                              <span>
                                <Link<any>
                                  className={classNames(
                                    active ? "bg-slate-100" : "",
                                    "block px-4 py-2 text-sm text-slate-700"
                                  )}
                                  {...item.props}
                                >
                                  {item.name}
                                </Link>
                              </span>
                            );
                          }
                          return (
                            <button
                              className={classNames(
                                active ? "bg-slate-100" : "",
                                "block w-full px-4 py-2 text-left text-sm text-slate-700"
                              )}
                              {...item.props}
                            >
                              {item.name}
                            </button>
                          );
                        }}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="h-full flex-1">{children}</main>
      </div>
    </div>
  );
};

export default AppShellLayout;
