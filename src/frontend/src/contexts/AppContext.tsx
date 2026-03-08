import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  DEFAULT_USER_PROFILE,
  MOCK_APPLICATIONS,
  MOCK_DOCUMENTS,
  MOCK_FORMS,
  MOCK_NOTIFICATIONS,
} from "../data/mockData";
import type {
  ApplicationModel,
  DocumentModel,
  FormModel,
  NotificationModel,
  UserProfile,
} from "../types";

interface AppContextType {
  // User profile
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Forms
  forms: FormModel[];
  incrementViewCount: (formId: string) => void;
  addForm: (form: FormModel) => void;
  updateForm: (formId: string, updates: Partial<FormModel>) => void;
  deleteForm: (formId: string) => void;

  // Applications
  applications: ApplicationModel[];
  addApplication: (app: ApplicationModel) => void;
  updateApplicationStatus: (
    appId: string,
    status: ApplicationModel["status"],
  ) => void;
  deleteApplication: (appId: string) => void;

  // Documents
  documents: DocumentModel[];
  addDocument: (doc: DocumentModel) => void;
  deleteDocument: (docId: string) => void;

  // Notifications
  notifications: NotificationModel[];
  markAsRead: (notifId: string) => void;
  markAllAsRead: () => void;
  addNotification: (notif: NotificationModel) => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [forms, setForms] = useState<FormModel[]>(MOCK_FORMS);
  const [applications, setApplications] = useState<ApplicationModel[]>([]);
  const [documents, setDocuments] = useState<DocumentModel[]>([]);
  const [notifications, setNotifications] =
    useState<NotificationModel[]>(MOCK_NOTIFICATIONS);

  const setUserProfile = useCallback((profile: UserProfile) => {
    setUserProfileState(profile);
    // Initialize user-specific data
    setApplications(
      MOCK_APPLICATIONS.map((a) => ({ ...a, userId: profile.uid })),
    );
    setDocuments(MOCK_DOCUMENTS.map((d) => ({ ...d, userId: profile.uid })));
  }, []);

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfileState((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const incrementViewCount = useCallback((formId: string) => {
    setForms((prev) =>
      prev.map((f) =>
        f.id === formId ? { ...f, viewCount: f.viewCount + 1 } : f,
      ),
    );
  }, []);

  const addForm = useCallback((form: FormModel) => {
    setForms((prev) => [form, ...prev]);
  }, []);

  const updateForm = useCallback(
    (formId: string, updates: Partial<FormModel>) => {
      setForms((prev) =>
        prev.map((f) => (f.id === formId ? { ...f, ...updates } : f)),
      );
    },
    [],
  );

  const deleteForm = useCallback((formId: string) => {
    setForms((prev) => prev.filter((f) => f.id !== formId));
  }, []);

  const addApplication = useCallback((app: ApplicationModel) => {
    setApplications((prev) => {
      const existing = prev.findIndex((a) => a.id === app.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = app;
        return updated;
      }
      return [app, ...prev];
    });
  }, []);

  const updateApplicationStatus = useCallback(
    (appId: string, status: ApplicationModel["status"]) => {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === appId ? { ...a, status, updatedAt: new Date() } : a,
        ),
      );
    },
    [],
  );

  const deleteApplication = useCallback((appId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== appId));
  }, []);

  const addDocument = useCallback((doc: DocumentModel) => {
    setDocuments((prev) => [doc, ...prev]);
  }, []);

  const deleteDocument = useCallback((docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  }, []);

  const markAsRead = useCallback((notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const addNotification = useCallback((notif: NotificationModel) => {
    setNotifications((prev) => [notif, ...prev]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        userProfile,
        setUserProfile,
        updateUserProfile,
        forms,
        incrementViewCount,
        addForm,
        updateForm,
        deleteForm,
        applications,
        addApplication,
        updateApplicationStatus,
        deleteApplication,
        documents,
        addDocument,
        deleteDocument,
        notifications,
        markAsRead,
        markAllAsRead,
        addNotification,
        unreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
