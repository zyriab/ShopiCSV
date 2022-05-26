import React, { Route, Routes, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../../auth/ProtectedRoute';
import HomePage from '../../pages/Home';
import TranslatorPage from '../../pages/Translator';

export function MtRouter() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/translations"
          element={<ProtectedRoute component={TranslatorPage} />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
