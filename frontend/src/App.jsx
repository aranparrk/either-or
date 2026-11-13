import { Routes, Route } from "react-router-dom";


import MainLayout from "./layouts/MainLayout.jsx";

import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import PollList from "./pages/PollList.jsx";
import PollDetail from "./pages/PollDetail.jsx";
import PollCreate from "./pages/PollCreate.jsx";

function App() {
  return (
    <Routes>

      <Route element={<MainLayout />}>
        <Route path="/" element={<PollList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/votes/new" element={<PollCreate key="create" />} />
        <Route path="/votes/:id/edit" element={<PollCreate key="edit" />} />
        <Route path="/votes/:id" element={<PollDetail />} />
      </Route>

    </Routes>
  );
}

export default App;
