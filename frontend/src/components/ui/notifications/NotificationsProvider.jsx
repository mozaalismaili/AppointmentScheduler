import { createContext, useContext, useEffect, useCallback, useState } from "react";
import "./notifications.css";

const NotifCtx = createContext(null);

export default function NotificationsProvider({ children }) {
  const [items, setItems] = useState([]); // {id, message, variant, duration}

  const remove = useCallback(id => setItems(xs => xs.filter(i => i.id !== id)), []);
  const notify = useCallback(({ message, variant="info", duration=3000 }) => {
    const id = crypto.randomUUID();
    setItems(xs => [...xs, { id, message, variant, duration }]);
    if (duration) setTimeout(() => remove(id), duration);
    return id;
  }, [remove]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && items.length) remove(items[items.length-1].id); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items, remove]);

  return (
    <NotifCtx.Provider value={{ notify, remove }}>
      <div className="notif-stack" aria-live="polite" aria-relevant="additions">
        {items.map(i => (
          <div key={i.id} className={`notif notif--${i.variant}`} role="alert">
            <span className="notif-text">{i.message}</span>
            <button className="notif-close" onClick={() => remove(i.id)} aria-label="Close">×</button>
          </div>
        ))}
      </div>
      {children}
    </NotifCtx.Provider>
  );
}

export const useNotifCtx = () => {
  const ctx = useContext(NotifCtx);
  if (!ctx) throw new Error("Wrap your app with <NotificationsProvider>");
  return ctx; // { notify, remove }
};
