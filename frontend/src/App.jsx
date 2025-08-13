// import BookingPage from "./BookingPage";

// export default function App() {
//   return <BookingPage apiBaseUrl="http://localhost:3001" />;
// }

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookingPage from "./BookingPage";
import AvailabilityPage from "./AvailabilityPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/booking" element={<BookingPage apiBaseUrl="http://localhost:3001" />} />
        <Route path="/availability" element={<AvailabilityPage />} />
      </Routes>
    </Router>
  );
}
