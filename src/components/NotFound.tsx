import { useRouteError } from 'react-router-dom';

export default function NotFound() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-member-access */}
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
