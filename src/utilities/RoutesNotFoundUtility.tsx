import { JSX } from 'react';
import { Route, Routes } from 'react-router-dom';

interface Props {
  children: JSX.Element[] | JSX.Element;
}
function RoutesWithNotFound({ children }: Props) {
  return (
    <Routes>
      {children}
      <Route path="/*" element={<h2>Not Found</h2>} />
    </Routes>
  );
}
export default RoutesWithNotFound;