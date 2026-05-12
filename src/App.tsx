/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from './ConfigContext';
import { PixelInjector } from './PixelInjector';

import Home from './pages/Home';
import QuestionFlow from './pages/Question';
import Result from './pages/Result';
import AdminDashboard from './pages/Admin';

export default function App() {
  return (
    <ConfigProvider>
      <PixelInjector />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/q/:id" element={<QuestionFlow />} />
          <Route path="/result/:id" element={<Result />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}
