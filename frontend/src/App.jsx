import { Routes, Route } from "react-router-dom";

import PollList from "./pages/PollList.jsx";
import PollDetail from "./pages/PollDetail.jsx";
import PollCreate from "./pages/PollCreate.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PollList />} />
      <Route path="/votes/new" element={<PollCreate />} />
      <Route path="/votes/:id" element={<PollDetail />} />
    </Routes>
  );
}

export default App;
