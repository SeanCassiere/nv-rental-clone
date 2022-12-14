/* eslint @typescript-eslint/no-unused-vars: 0 */
import React, { Fragment, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { Link, useNearestMatch } from "@tanstack/react-router";
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

export function removeAllLocalStorageKeysForUser(
  clientId: string,
  userId: string
) {
  const localStorageKeyPrefix = `${clientId}:${userId}:`;
  Object.keys(window.localStorage)
    .filter((key) => key.startsWith(localStorageKeyPrefix))
    .forEach((key) => window.localStorage.removeItem(key));
}

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const auth = useAuth();

  const path = useNearestMatch();

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: RectangleGroupSolid,
      current: path.routeId === "/",
      props: {},
    },
    {
      name: "Customers",
      href: "/customers",
      icon: UsersSolid,
      current:
        path.routeId.includes("/customers") ||
        path.routeId.includes("/customers/$customerId"),
      props: {
        search: () => ({ page: 1, size: 10, filters: { active: true } }),
      },
    },
    {
      name: "Vehicles",
      href: "/vehicles",
      icon: TruckFilled,
      current:
        path.routeId.includes("/vehicles") ||
        path.routeId.includes("/vehicles/$vehicleId"),
      props: {
        search: () => ({ page: 1, size: 10, filters: { active: true } }),
      },
    },
    {
      name: "Reservations",
      href: "/reservations",
      icon: BookFilled,
      current:
        path.routeId.includes("/reservations") ||
        path.routeId.includes("/reservations/$reservationId"),
      props: {
        search: () => ({ page: 1, size: 10 }),
      },
    },
    {
      name: "Agreements",
      href: "/agreements",
      icon: DocumentTextSolid,
      current:
        path.routeId.includes("/agreements") ||
        path.routeId.includes("/agreements/$agreementId"),
      props: {
        search: () => ({ page: 1, size: 10 }),
      },
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

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-40 flex md:hidden"
            onClose={setSidebarOpen}
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
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
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
              <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
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
                    // src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
                    src="/rental-logo-full.png"
                    alt="RENTAL"
                    style={{ imageRendering: "crisp-edges" }}
                  />
                </div>
                <div className="mt-5 h-0 flex-1 overflow-y-auto">
                  <nav className="space-y-1 px-2">
                    {/* render in mobile sidebar */}
                    {navigation.map((item) => (
                      <Link<any>
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-100 text-teal-400"
                            : "text-gray-600 hover:bg-gray-50 hover:text-teal-500",
                          "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                        )}
                        {...item.props}
                      >
                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-teal-400"
                              : "text-gray-400 group-hover:text-teal-500",
                            "mr-4 h-6 w-6 flex-shrink-0"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
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
          <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-4">
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
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-100  text-teal-400"
                        : "text-gray-600 hover:bg-gray-50 hover:text-teal-500",
                      "group flex items-center px-2 py-4 text-sm font-medium"
                    )}
                    {...item.props}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "text-teal-400"
                          : "text-gray-400 group-hover:text-teal-500",
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
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
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
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                      <MagnifyingGlassOutline
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      id="search-field"
                      className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                      placeholder="Search"
                      type="search"
                      name="search"
                    />
                  </div>
                </form>
              </div>
              <div className="ml-4 flex items-center gap-1 md:ml-6">
                <button
                  type="button"
                  className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIconOutline className="h-6 w-6" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                >
                  <span className="sr-only">View settings</span>
                  <SettingsCogOutline className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-1.5">
                  <div>
                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
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
                                <Link<any>
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                  {...item.props}
                                >
                                  {item.name}
                                </Link>
                              );
                            }
                            return (
                              <button
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block w-full px-4 py-2 text-left text-sm text-gray-700"
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

          <main className="flex-1">
            {children}
            {/* <div className="py-6">
              <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Dashboard
                </h1>
              </div>
              <div className="mx-auto max-w-full px-4 sm:px-6 md:px-8">
                
                <div className="py-4">
                  <div className="min-h-[300px] rounded-lg border-4 border-dashed border-gray-200"></div>
                </div>
              </div>
            </div> */}
          </main>
        </div>
      </div>
    </>
  );
};

export default AppShell;
