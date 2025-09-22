import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/admin.dashoard/Admin.dashboard";
import AdminTransaction from "./pages/admin.transaction/Admin.transaction";
import AdminSettings from "./pages/admin.settings/Admin.settings";
import DashboardUser from "./pages/dashboard.user/Dashboard.user";
import AdminCreateUser from "./pages/admin.create.user/Admin.create.user";
import AdminLoanApplication from "./pages/admin.loan.applications/Admin.loan.applications";
import AdminRegistrationApplication from "./pages/admin.registration.applications/Admin.registration.applications";
import SingleLoanApplications from "./pages/admin.single.loan.applications/Admin.single.loan.application";
import SingleRegistrationApplications from "./pages/admin.single.registration.applications/Admin.single.registration.application";
import Admin from "./pages/admin/Admin";
import Login from "./pages/auth/login/Login";
import NotFound from "./pages/not-found/NotFound";
import ErrorBoundary from "./pages/error-boundary/ErrorBoundary";
import ScrollToTop from "./utils/ScrollToTop";
import "./app.css";
import AdminSingleUser from "./pages/admin.single.user/Admin.single.user";
import AdminEditUser from "./pages/admin.edit.user/Admin.edit.user";
import { useContext } from "react";
import StateContext from "./context/StateProvider";
import AdminCreateSociety from "./pages/admin.create.society/Admin.create.society";
import ToasterContainer from "./components/ui/toast/ToasterContainer";
import AdminSocieties from "./pages/admin.societies/Admin.societies";
import Payment from "./pages/payments/Payment";
import AdminCreateRole from "./pages/admin.create.role/Admin.create.role";
import AdminWithdrawalRequest from "./pages/admin.withdrawal.request/Admin.withdrawal.request";
import AdminSendMoney from "./pages/admin.send.money/Send.money";
import AdminUpdateSociety from "./pages/Admin.update.society/Admin.update.society";
import SingleWithdrawalRequest from "./pages/admin.single.withdrawal.request/Admin.single.withdrawal.request";
import PrivateRoute from "./route/privateRoute";
import PublicRoute from "./route/publicRoute";
import Thrifts from "./pages/admin.thrifts/Admin.Thrifts";
import Kyc from "./pages/admin.kyc/Admin.Kyc";
import LoanDetail from "./pages/admin.loan.applications/admin.loan.detail";
import SystemSettings from "./pages/system.setting/SystemSettings";
import UnionSettings from "./pages/system.setting/UnionSetting";
import LoanSettings from "./pages/system.setting/LoanSettings";

function App() {
  const { theme } = useContext(StateContext);
  return (
    <div theme={theme ? `${theme}` : "#00208a"}>
      <BrowserRouter>
        <ToasterContainer />
        <ScrollToTop />
        <ErrorBoundary>
          <Routes>
            {/* PRIVATE ROUTES */}
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/main" element={<Admin />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<DashboardUser />} />
                <Route path="kyc" element={<Kyc />} />
                <Route path="transaction" element={<AdminTransaction />} />
                <Route
                  path="withdrawal-requests"
                  element={<AdminWithdrawalRequest />}
                />
                <Route
                  path="withdrawal-request/:requestId"
                  element={<SingleWithdrawalRequest />}
                />
                <Route path="societies" element={<AdminSocieties />} />
                <Route path="user/:userId" element={<AdminSingleUser />} />
                <Route path="edit-user/:userId" element={<AdminEditUser />} />
                <Route path="system-settings" element={ <SystemSettings />} />
                <Route path="union-settings" element={ <UnionSettings />} />
                <Route path="payment-settings" element={ <UnionSettings />} />
                <Route path="loan-settings" element={ <LoanSettings />} />
                <Route path="setting" element={<AdminSettings />} />
                <Route path="deposit-money" element={<Payment />} />
                <Route path="create-user" element={<AdminCreateUser />} />
                <Route path="create-role" element={<AdminCreateRole />} />
                <Route path="create-society" element={<AdminCreateSociety />} />
                <Route
                  path="edit-society/:societyId"
                  element={<AdminUpdateSociety />}
                />
                <Route path="send-money" element={<AdminSendMoney />} />
                <Route
                  path="loan-applications/:status"
                  element={<AdminLoanApplication />}
                />
                <Route
                  path="loan-application/:applicationId"
                  element={<SingleLoanApplications />}
                />
                <Route
                  path="registration-applications"
                  element={<AdminRegistrationApplication />}
                />
                <Route
                  path="registration-application/:applicationId"
                  element={<SingleRegistrationApplications />}
                />
                <Route
                  path="loan/applications/:applicationId/payment-schedules"
                  element={<LoanDetail />}
                />
                <Route path="thrifts/:programId" element={<Thrifts />} />
              </Route>
            </Route>

            {/* PUBLIC ROUTES */}
            <Route path="/" element={<PublicRoute />}>
              <Route index element={<Login />} />
            </Route>

            {/* CATCH ALL ROUTES*/}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </div>
  );
}

export default App;
