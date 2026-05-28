import { MemoryRouter, useInRouterContext } from 'react-router-dom';

/**
 * Use the host app's router when already inside one; otherwise provide MemoryRouter
 * so widgets work in apps without react-router (e.g. simple tab demos).
 */
export function RouterBridge({ children, initialEntries = ['/'] }) {
  if (useInRouterContext()) {
    return children;
  }
  return <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>;
}
