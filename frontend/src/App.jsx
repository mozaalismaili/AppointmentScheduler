import BookingPage from "./pages/BookingPage.jsx";
import AppointmentList from "./pages/AppointmentList.jsx";

export default function App() {
    return (
        <div style={{ padding: 16 }}>
            <h1>Appointments Demo</h1>
            <BookingPage />
            <hr />
            <AppointmentList />
        </div>
    );
}
