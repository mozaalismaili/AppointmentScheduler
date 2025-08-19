import BookingPage from "./pages/BookingPage.jsx";
import AppointmentList from "./pages/AppointmentList.jsx";
import { Toaster } from "react-hot-toast";

export default function App() {
    return (
        <div style={{ padding: 16 }}>
            <h1>Appointments Demo</h1>
            <BookingPage />
            <hr />
            <AppointmentList />
            <Toaster position="top-right" />
        </div>
    );
}
