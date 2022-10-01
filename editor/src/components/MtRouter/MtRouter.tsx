import React, { Route, Routes, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../../auth/ProtectedRoute';
import TranslatorPage from '../../pages/Translator';

export function MtRouter() {
  return (
    <>
      <Routes>
        <Route
          path="/translations"
          element={<ProtectedRoute component={TranslatorPage} />}
        />
        <Route path="*" element={<Navigate to="/translations" />} />
      </Routes>
    </>
  );
}
