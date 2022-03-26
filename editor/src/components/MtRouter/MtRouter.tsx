import React, { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../../auth/ProtectedRoute';
import HomePage from '../../pages/Home';
import TranslatorPage from '../../pages/Translator';

export function MtRouter() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/translator"
          element={<ProtectedRoute component={TranslatorPage} />}
        />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
}
