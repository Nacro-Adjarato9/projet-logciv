const API_BASE_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL) ||
  (typeof process !== "undefined" &&
    process.env &&
    process.env.REACT_APP_API_URL) ||
  "http://127.0.0.1:8000/api";

const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

type StoredTokens = {
  access: string | null;
  refresh: string | null;
};

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function shouldSkipAuthHeader(path: string): boolean {
  return (
    path.startsWith("/auth/login/") ||
    path.startsWith("/auth/register/") ||
    path.startsWith("/auth/refresh/") ||
    path.startsWith("/auth/verify-email/") ||
    path.startsWith("/auth/resend-verification/") ||
    path.startsWith("/utilisateurs/password-reset/") ||
    path.startsWith("/utilisateurs/password-reset/confirm/")
  );
}

export function setTokens({ access, refresh }: { access?: string; refresh?: string }) {
  if (typeof window === "undefined") return;
  if (access) localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getStoredTokens(): StoredTokens {
  if (typeof window === "undefined") {
    return { access: null, refresh: null };
  }
  return {
    access: localStorage.getItem(TOKEN_KEY),
    refresh: localStorage.getItem(REFRESH_TOKEN_KEY),
  };
}

export function extractAuthTokens(data: any): { access?: string; refresh?: string } {
  const access =
    data?.access ??
    data?.access_token ??
    data?.tokens?.access ??
    data?.tokens?.access_token ??
    undefined;
  const refresh =
    data?.refresh ??
    data?.refresh_token ??
    data?.tokens?.refresh ??
    data?.tokens?.refresh_token ??
    undefined;

  const tokens: { access?: string; refresh?: string } = {};
  if (access) tokens.access = access;
  if (refresh) tokens.refresh = refresh;
  return tokens;
}

export function extractAuthUser<T = any>(data: T): any {
  if (data && typeof data === "object" && "user" in data) {
    return (data as any).user;
  }
  return data;
}

async function apiRequest(path: string, options: RequestInit = {}): Promise<any> {
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers = new Headers(options.headers as HeadersInit | undefined);

  const token = shouldSkipAuthHeader(path) ? null : getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!isFormData && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const detail =
      data && typeof data === "object"
        ? String((data as any).detail || (data as any).message || "")
        : "";
    if (
      response.status === 401 &&
      /token|jeton/i.test(detail) &&
      typeof window !== "undefined"
    ) {
      clearTokens();
    }

    const fieldErrors =
      data && typeof data === "object"
        ? Object.entries(data)
            .filter(([key]) => !["detail", "message", "code"].includes(key))
            .flatMap(([, value]) => {
              if (Array.isArray(value)) {
                return value.map((item) => String(item));
              }
              if (typeof value === "string") {
                return [value];
              }
              return [];
            })
        : [];
    const message =
      (data && typeof data === "object" && (data.detail || data.message)) ||
      fieldErrors[0] ||
      `Erreur API (${response.status})`;
    const error = new Error(message) as Error & { status?: number; data?: any };
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function jsonBody(payload: unknown) {
  return payload === undefined ? undefined : JSON.stringify(payload);
}

function normalizeListResponse<T>(data: any, mapper: (item: any) => T): any {
  if (Array.isArray(data)) {
    return data.map(mapper);
  }
  if (data && Array.isArray(data.results)) {
    return {
      ...data,
      results: data.results.map(mapper),
    };
  }
  return data;
}

function normalizeCurrentUser(data: any) {
  if (!data || typeof data !== "object") return data;

  const user = typeof data.user === "object" && data.user !== null ? data.user : {};
  const userId = typeof data.user === "number" || typeof data.user === "string" ? data.user : undefined;
  const profile = data.profile ?? {};
  const role = profile.role ?? data.role ?? data.user_type ?? "locataire";
  const verificationStatus =
    profile.is_verified !== undefined
      ? profile.is_verified
        ? "verifie"
        : "en_attente"
      : data.verificationStatus ?? data.verification_status ?? "en_attente";

  return {
    id: user.id ?? userId ?? data.id,
    username: user.username ?? data.username ?? "",
    email: user.email ?? data.email ?? "",
    first_name: user.first_name ?? data.first_name ?? "",
    last_name: user.last_name ?? data.last_name ?? "",
    nom: user.last_name ?? data.nom ?? "",
    prenom: user.first_name ?? data.prenom ?? "",
    telephone: profile.telephone ?? data.telephone ?? data.phone ?? "",
    role,
    verificationStatus,
    adresse: profile.adresse_complete ?? data.adresse ?? data.adresse_complete ?? "",
    ville: profile.ville ?? data.ville ?? "",
    commune: profile.commune ?? data.commune ?? "",
    quartier: profile.quartier ?? data.quartier ?? "",
    nomAgence: data.nomAgence ?? data.nom_agence ?? "",
    rccm: data.rccm ?? data.numero_registre_commerce ?? "",
    ncc: data.ncc ?? data.numero_contribuable ?? "",
    siteWeb: data.siteWeb ?? data.site_web ?? "",
    description: data.description ?? "",
    logo: data.logo ?? "",
    createdAt: data.createdAt ?? data.created_at ?? profile.created_at ?? null,
    raw: data,
  };
}

function normalizeProprietaireProfile(data: any) {
  if (!data || typeof data !== "object") return data;

  return {
    ...data,
    nom: data.nom ?? "",
    prenom: data.prenom ?? "",
    telephone: data.telephone ?? "",
    adresse: data.adresse ?? data.adresse_complete ?? "",
    ville: data.ville ?? "",
    commune: data.commune ?? "",
    quartier: data.quartier ?? "",
    type: data.type ?? data.type_proprietaire ?? "",
    verificationStatus:
      data.statut_verification ?? data.verificationStatus ?? "en_attente",
    createdAt: data.createdAt ?? data.created_at ?? null,
  };
}

function normalizeAgenceProfile(data: any) {
  if (!data || typeof data !== "object") return data;

  return {
    ...data,
    nomAgence: data.nomAgence ?? data.nom_agence ?? "",
    rccm: data.rccm ?? data.numero_registre_commerce ?? "",
    ncc: data.ncc ?? data.numero_contribuable ?? "",
    siteWeb: data.siteWeb ?? data.site_web ?? "",
    telephone: data.telephone ?? "",
    adresse: data.adresse ?? data.adresse_complete ?? "",
    ville: data.ville ?? "",
    commune: data.commune ?? "",
    quartier: data.quartier ?? "",
    description: data.description ?? "",
    logo: data.logo ?? "",
    verificationStatus:
      data.statut_verification ?? data.verificationStatus ?? "en_attente",
    createdAt: data.createdAt ?? data.created_at ?? null,
  };
}

function normalizeReservation(data: any) {
  if (!data || typeof data !== "object") return data;

  const clientName = data.clientName ?? data.client_name ?? data.utilisateur ?? "Client";
  const createdAt = data.createdAt ?? data.created_at ?? null;
  const date = data.date ?? data.date_debut ?? "";

  return {
    ...data,
    clientName,
    client_name: clientName,
    clientPhone: data.clientPhone ?? data.client_phone ?? "",
    client_phone: data.clientPhone ?? data.client_phone ?? "",
    date,
    date_debut: date,
    time: data.time ?? data.heure ?? "",
    heure: data.heure ?? data.time ?? "",
    createdAt,
    created_at: createdAt,
    bien: data.bien,
    status: data.status ?? "pending",
  };
}

function normalizeMessage(data: any) {
  if (!data || typeof data !== "object") return data;

  const createdAt = data.createdAt ?? data.created_at ?? null;
  return {
    ...data,
    content: data.content ?? data.texte ?? data.message ?? "",
    texte: data.texte ?? data.content ?? data.message ?? "",
    sender: data.sender ?? "",
    receiver: data.receiver ?? "",
    senderId: data.senderId ?? data.sender_id ?? null,
    receiverId: data.receiverId ?? data.receiver_id ?? null,
    timestamp: data.timestamp ?? createdAt,
    createdAt,
    created_at: createdAt,
    is_read: data.is_read ?? data.read ?? false,
    read: data.read ?? data.is_read ?? false,
  };
}

function normalizeConversation(data: any) {
  if (!data || typeof data !== "object") return data;

  const lastMessage = normalizeMessage(data.last_message ?? data.lastMessage ?? {});
  const conversationId = data.conversation_id ?? data.id;
  return {
    ...data,
    id: conversationId,
    conversation_id: conversationId,
    lastMessage: lastMessage.content ?? lastMessage.texte ?? "",
    last_message: lastMessage,
    lastMessageAt: lastMessage.createdAt ?? lastMessage.created_at ?? null,
    last_message_at: lastMessage.createdAt ?? lastMessage.created_at ?? null,
    unread_count: data.unread_count ?? 0,
    unread: (data.unread_count ?? 0) > 0,
    participants: data.participants ?? [
      lastMessage.sender,
      lastMessage.receiver,
    ].filter(Boolean),
    participantNames: data.participantNames ?? {},
    property: data.property ?? data.bien ?? null,
    bien: data.bien ?? data.property ?? null,
  };
}

function normalizeFavori(data: any) {
  if (!data || typeof data !== "object") return data;

  const bienId = data.bien?.id ?? data.bien ?? null;
  const bien = data.bien && typeof data.bien === "object"
    ? data.bien
    : {
        id: bienId,
        titre: data.bien_titre ?? "",
        prix: data.bien_prix ?? 0,
        ville: data.bien_ville ?? "",
        images: data.bien_image ? [data.bien_image] : [],
      };

  return {
    ...data,
    bien,
    bien_id: bienId,
    createdAt: data.createdAt ?? data.created_at ?? null,
    created_at: data.createdAt ?? data.created_at ?? null,
  };
}

function normalizeNotification(data: any) {
  if (!data || typeof data !== "object") return data;

  const createdAt = data.createdAt ?? data.created_at ?? null;
  return {
    ...data,
    userId: data.userId ?? data.user_id ?? null,
    title: data.title ?? data.message ?? "",
    content: data.content ?? data.message ?? "",
    read: data.read ?? data.is_read ?? false,
    is_read: data.is_read ?? data.read ?? false,
    createdAt,
    created_at: createdAt,
  };
}

// -------------------------
// Authentification
// -------------------------
export const authAPI = {
  register(payload: unknown) {
    return apiRequest("/auth/register/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },

  login(payload: unknown) {
    return apiRequest("/auth/login/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },

  refresh(payload: unknown) {
    return apiRequest("/auth/refresh/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },

  logout() {
    return apiRequest("/auth/logout/", {
      method: "POST",
    });
  },

  profile() {
    return apiRequest("/utilisateurs/me/");
  },

  updateProfile(payload: unknown) {
    return apiRequest("/utilisateurs/me/update/", {
      method: "PUT",
      body: jsonBody(payload),
    });
  },

  passwordReset(payload: unknown) {
    return apiRequest("/utilisateurs/password-reset/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },

  passwordResetConfirm(payload: unknown) {
    return apiRequest("/utilisateurs/password-reset/confirm/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },

  verifyEmail(payload: unknown) {
    return apiRequest("/auth/verify-email/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },

  resendVerification(payload: unknown) {
    return apiRequest("/auth/resend-verification/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },
};

// -------------------------
// Utilisateurs
// -------------------------
export const usersAPI = {
  async me() {
    const profile = normalizeCurrentUser(await apiRequest("/utilisateurs/me/"));

    try {
      if (profile?.role === "proprietaire") {
        const ownerDetails = normalizeProprietaireProfile(
          await apiRequest("/utilisateurs/profil-proprietaire/")
        );
        return {
          ...profile,
          ...ownerDetails,
          telephone: ownerDetails.telephone || profile.telephone,
          adresse: ownerDetails.adresse || profile.adresse,
          ville: ownerDetails.ville || profile.ville,
        };
      }

      if (profile?.role === "agent" || profile?.role === "agence") {
        const agencyDetails = normalizeAgenceProfile(
          await apiRequest("/utilisateurs/profil-agence/")
        );
        return {
          ...profile,
          ...agencyDetails,
          nomAgence: agencyDetails.nomAgence || profile.nomAgence,
          rccm: agencyDetails.rccm || profile.rccm,
          ncc: agencyDetails.ncc || profile.ncc,
          siteWeb: agencyDetails.siteWeb || profile.siteWeb,
          description: agencyDetails.description || profile.description,
          logo: agencyDetails.logo || profile.logo,
          telephone: agencyDetails.telephone || profile.telephone,
          adresse: agencyDetails.adresse || profile.adresse,
          ville: agencyDetails.ville || profile.ville,
        };
      }
    } catch {
      // Fallback to the base profile only.
    }

    return profile;
  },

  updateMe(payload: unknown) {
    return apiRequest("/utilisateurs/me/update/", {
      method: "PUT",
      body: jsonBody(payload),
    });
  },

  profile() {
    return usersAPI.me();
  },

  profilProprietaire() {
    return apiRequest("/utilisateurs/profil-proprietaire/");
  },

  updateProfilProprietaire(payload: unknown) {
    return apiRequest("/utilisateurs/profil-proprietaire/", {
      method: "PUT",
      body: jsonBody(payload),
    });
  },

  verifierProfilProprietaire(payload: unknown) {
    return apiRequest("/utilisateurs/profil-proprietaire/verifier/", {
      method: "POST",
      body:
        payload instanceof FormData ? payload : jsonBody(payload),
    });
  },

  profilAgence() {
    return apiRequest("/utilisateurs/profil-agence/");
  },

  updateProfilAgence(payload: unknown) {
    return apiRequest("/utilisateurs/profil-agence/", {
      method: "PUT",
      body: jsonBody(payload),
    });
  },

  verifierProfilAgence(payload: unknown) {
    return apiRequest("/utilisateurs/profil-agence/verifier/", {
      method: "POST",
      body:
        payload instanceof FormData ? payload : jsonBody(payload),
    });
  },

  passwordReset(payload: unknown) {
    return authAPI.passwordReset(payload);
  },

  signalementsList() {
    return apiRequest("/utilisateurs/signalements/");
  },

  createSignalement(payload: unknown) {
    return apiRequest("/utilisateurs/signalements/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },

  signalementDetail(id: number) {
    return apiRequest(`/utilisateurs/signalements/${id}/`);
  },

  deleteSignalement(id: number) {
    return apiRequest(`/utilisateurs/signalements/${id}/`, {
      method: "DELETE",
    });
  },

  deleteAccount() {
    return apiRequest("/utilisateurs/delete/", {
      method: "DELETE",
    });
  },

  agents() {
    return apiRequest("/agents/");
  },

  agentDetail(id: number) {
    return apiRequest(`/agents/${id}/`);
  },

  agentBiens(id: number) {
    return apiRequest(`/agents/${id}/biens/`);
  },

  agentAvis(id: number) {
    return apiRequest(`/agents/${id}/avis/`);
  },

  laisserAvisAgent(id: number, payload: unknown) {
    return apiRequest(`/agents/${id}/avis/ajouter/`, {
      method: "POST",
      body: jsonBody(payload),
    });
  },
};

// -------------------------
// Biens / Documents / Images
// -------------------------
export const biensAPI = {
  list(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/biens/${query ? `?${query}` : ""}`);
  },

  detail(id: number) {
    return apiRequest(`/biens/${id}/`);
  },

  create(payload: unknown) {
    return apiRequest("/biens/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },

  update(id: number, payload: unknown) {
    return apiRequest(`/biens/${id}/`, {
      method: "PUT",
      body: jsonBody(payload),
    });
  },

  patch(id: number, payload: unknown) {
    return apiRequest(`/biens/${id}/`, {
      method: "PATCH",
      body: jsonBody(payload),
    });
  },

  remove(id: number) {
    return apiRequest(`/biens/${id}/`, {
      method: "DELETE",
    });
  },

  mesBiens() {
    return apiRequest("/biens/mes_biens/");
  },

  disponibilites(id: number) {
    return apiRequest(`/biens/${id}/disponibilites/`);
  },

  documents(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/documents/${query ? `?${query}` : ""}`);
  },

  documentDetail(id: number) {
    return apiRequest(`/documents/${id}/`);
  },

  createDocument(payload: unknown) {
    return apiRequest("/documents/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },

  mesDocuments() {
    return apiRequest("/documents/mes_documents/");
  },
};

export const imagesAPI = {
  list(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/images/${query ? `?${query}` : ""}`);
  },

  detail(id: number) {
    return apiRequest(`/images/${id}/`);
  },

  create(payload: unknown) {
    return apiRequest("/images/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },

  uploadMultiple(payload: unknown) {
    return apiRequest("/images/upload_multiple/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },

  mesImages() {
    return apiRequest("/images/mes_images/");
  },
};

// -------------------------
// Réservations
// -------------------------
export const reservationsAPI = {
  list(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/reservations/${query ? `?${query}` : ""}`).then((data) =>
      normalizeListResponse(data, normalizeReservation)
    );
  },

  detail(id: number) {
    return apiRequest(`/reservations/${id}/`).then(normalizeReservation);
  },

  create(payload: unknown) {
    return apiRequest("/reservations/", {
      method: "POST",
      body: jsonBody(payload),
    }).then(normalizeReservation);
  },

  update(id: number, payload: unknown) {
    return apiRequest(`/reservations/${id}/`, {
      method: "PUT",
      body: jsonBody(payload),
    }).then(normalizeReservation);
  },

  patch(id: number, payload: unknown) {
    return apiRequest(`/reservations/${id}/`, {
      method: "PATCH",
      body: jsonBody(payload),
    }).then(normalizeReservation);
  },

  remove(id: number) {
    return apiRequest(`/reservations/${id}/`, {
      method: "DELETE",
    });
  },

  mesReservations() {
    return apiRequest("/reservations/mes_reservations/").then((data) =>
      normalizeListResponse(data, normalizeReservation)
    );
  },

  reservationsPourMesBiens() {
    return apiRequest("/reservations/reservations_pour_mes_biens/").then((data) =>
      normalizeListResponse(data, normalizeReservation)
    );
  },

  calendrier(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/reservations/calendrier/${query ? `?${query}` : ""}`);
  },

  updateStatus(id: number, payload: unknown) {
    return apiRequest(`/reservations/${id}/status/`, {
      method: "PUT",
      body: jsonBody(payload),
    }).then(normalizeReservation);
  },
};

// -------------------------
// Messages / Chat
// -------------------------
export const chatAPI = {
  list(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/messages/${query ? `?${query}` : ""}`).then((data) =>
      normalizeListResponse(data, normalizeMessage)
    );
  },

  detail(id: number) {
    return apiRequest(`/messages/${id}/`).then(normalizeMessage);
  },

  create(payload: unknown) {
    const normalizedPayload =
      payload && typeof payload === "object" && "content" in (payload as any)
        ? {
            conversation_id: (payload as any).conversation_id,
            receiver: (payload as any).receiver,
            texte: (payload as any).content,
          }
        : payload;

    return apiRequest("/messages/", {
      method: "POST",
      body: jsonBody(normalizedPayload),
    }).then(normalizeMessage);
  },

  update(id: number, payload: unknown) {
    return apiRequest(`/messages/${id}/`, {
      method: "PUT",
      body: jsonBody(payload),
    }).then(normalizeMessage);
  },

  patch(id: number, payload: unknown) {
    return apiRequest(`/messages/${id}/`, {
      method: "PATCH",
      body: jsonBody(payload),
    }).then(normalizeMessage);
  },

  remove(id: number) {
    return apiRequest(`/messages/${id}/`, {
      method: "DELETE",
    });
  },

  mesMessages() {
    return apiRequest("/messages/mes_messages/").then((data) =>
      normalizeListResponse(data, normalizeMessage)
    );
  },

  conversations() {
    return apiRequest("/messages/conversations/").then((data) =>
      normalizeListResponse(data, normalizeConversation)
    );
  },

  conversation(conversationId: number) {
    return apiRequest(`/messages/conversation/${conversationId}/`).then((data) =>
      normalizeListResponse(data, normalizeMessage)
    );
  },

  markAsRead(messageId: number) {
    return apiRequest(`/messages/${messageId}/read/`, {
      method: "POST",
    });
  },
};

// -------------------------
// Avis / Favoris
// -------------------------
export const avisAPI = {
  list(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/avis/${query ? `?${query}` : ""}`);
  },

  detail(id: number) {
    return apiRequest(`/avis/${id}/`);
  },

  create(payload: unknown) {
    return apiRequest("/avis/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },

  update(id: number, payload: unknown) {
    return apiRequest(`/avis/${id}/`, {
      method: "PUT",
      body: jsonBody(payload),
    });
  },

  patch(id: number, payload: unknown) {
    return apiRequest(`/avis/${id}/`, {
      method: "PATCH",
      body: jsonBody(payload),
    });
  },

  remove(id: number) {
    return apiRequest(`/avis/${id}/`, {
      method: "DELETE",
    });
  },

  mesAvis() {
    return apiRequest("/avis/mes_avis/");
  },

  statistiques(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/avis/statistiques/${query ? `?${query}` : ""}`);
  },
};

export const favorisAPI = {
  list(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/favoris/${query ? `?${query}` : ""}`).then((data) =>
      normalizeListResponse(data, normalizeFavori)
    );
  },

  detail(id: number) {
    return apiRequest(`/favoris/${id}/`).then(normalizeFavori);
  },

  create(payload: unknown) {
    return apiRequest("/favoris/", {
      method: "POST",
      body: jsonBody(payload),
    }).then(normalizeFavori);
  },

  update(id: number, payload: unknown) {
    return apiRequest(`/favoris/${id}/`, {
      method: "PUT",
      body: jsonBody(payload),
    }).then(normalizeFavori);
  },

  patch(id: number, payload: unknown) {
    return apiRequest(`/favoris/${id}/`, {
      method: "PATCH",
      body: jsonBody(payload),
    }).then(normalizeFavori);
  },

  remove(id: number) {
    return apiRequest(`/favoris/${id}/`, {
      method: "DELETE",
    });
  },

  count() {
    return apiRequest("/favoris/count/");
  },

  toggle(payload: unknown) {
    return apiRequest("/favoris/toggle/", {
      method: "POST",
      body: jsonBody(payload),
    }).then((data) => {
      if (data && typeof data === "object" && data.favori) {
        return {
          ...data,
          favori: normalizeFavori(data.favori),
        };
      }
      return data;
    });
  },
};

// -------------------------
// Notifications / Agences
// -------------------------
export const notificationsAPI = {
  list(params: Record<string, any> = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/notifications/${query ? `?${query}` : ""}`).then((data) =>
      normalizeListResponse(data, normalizeNotification)
    );
  },

  detail(id: number) {
    return apiRequest(`/notifications/${id}/`).then(normalizeNotification);
  },

  create(payload: unknown) {
    return apiRequest("/notifications/", {
      method: "POST",
      body: jsonBody(payload),
    }).then(normalizeNotification);
  },

  update(id: number, payload: unknown) {
    return apiRequest(`/notifications/${id}/`, {
      method: "PUT",
      body: jsonBody(payload),
    }).then(normalizeNotification);
  },

  patch(id: number, payload: unknown) {
    return apiRequest(`/notifications/${id}/`, {
      method: "PATCH",
      body: jsonBody(payload),
    }).then(normalizeNotification);
  },

  remove(id: number) {
    return apiRequest(`/notifications/${id}/`, {
      method: "DELETE",
    });
  },

  markAllAsRead() {
    return apiRequest("/notifications/mark_all_as_read/", {
      method: "POST",
    });
  },

  unreadCount() {
    return apiRequest("/notifications/unread_count/");
  },

  markAsRead(id: number) {
    return apiRequest(`/notifications/${id}/read/`, {
      method: "PUT",
    }).then(normalizeNotification);
  },
};

export const agencesAPI = {
  list() {
    return apiRequest("/agences/");
  },

  detail(id: number) {
    return apiRequest(`/agences/${id}/`);
  },

  create(payload: unknown) {
    return apiRequest("/agences/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },

  update(id: number, payload: unknown) {
    return apiRequest(`/agences/${id}/`, {
      method: "PUT",
      body: jsonBody(payload),
    });
  },

  patch(id: number, payload: unknown) {
    return apiRequest(`/agences/${id}/`, {
      method: "PATCH",
      body: jsonBody(payload),
    });
  },

  remove(id: number) {
    return apiRequest(`/agences/${id}/`, {
      method: "DELETE",
    });
  },
};

// -------------------------
// Tarifs / Abonnements
// -------------------------
export const tarifsAPI = {
  list() {
    return apiRequest("/tarifs/");
  },

  detail(id: number) {
    return apiRequest(`/tarifs/${id}/`);
  },
};

export const abonnementsAPI = {
  list() {
    return apiRequest("/abonnements/");
  },

  detail(id: number) {
    return apiRequest(`/abonnements/${id}/`);
  },

  create(payload: unknown) {
    return apiRequest("/abonnements/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },

  update(id: number, payload: unknown) {
    return apiRequest(`/abonnements/${id}/`, {
      method: "PUT",
      body: jsonBody(payload),
    });
  },

  patch(id: number, payload: unknown) {
    return apiRequest(`/abonnements/${id}/`, {
      method: "PATCH",
      body: jsonBody(payload),
    });
  },

  remove(id: number) {
    return apiRequest(`/abonnements/${id}/`, {
      method: "DELETE",
    });
  },

  souscrire(payload: unknown) {
    return apiRequest("/abonnements/souscrire/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },
};

// -------------------------
// IA / Utilitaires
// -------------------------
export const iaAPI = {
  recommendationsList() {
    return apiRequest("/ia/recommendations/");
  },

  recommendationDetail(id: number) {
    return apiRequest(`/ia/recommendations/${id}/`);
  },

  createRecommendation(payload: unknown) {
    return apiRequest("/ia/recommendations/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },

  updateRecommendation(id: number, payload: unknown) {
    return apiRequest(`/ia/recommendations/${id}/`, {
      method: "PUT",
      body: jsonBody(payload),
    });
  },

  patchRecommendation(id: number, payload: unknown) {
    return apiRequest(`/ia/recommendations/${id}/`, {
      method: "PATCH",
      body: jsonBody(payload),
    });
  },

  removeRecommendation(id: number) {
    return apiRequest(`/ia/recommendations/${id}/`, {
      method: "DELETE",
    });
  },

  genererRecommandations(payload: unknown) {
    return apiRequest("/ia/recommendations/generer_recommandations/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },

  rechercher(payload: unknown) {
    return apiRequest("/ia/recherche/rechercher/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },

  chat(payload: unknown) {
    return apiRequest("/ia/chat/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },

  verifierDocument(payload: unknown) {
    return apiRequest("/ia/verifier-document/verifier/", {
      method: "POST",
      body: jsonBody(payload),
    });
  },
};

export const utilsAPI = {
  search(q?: string, type?: string) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (type) params.set("type", type);
    const query = params.toString();
    return apiRequest(`/search/${query ? `?${query}` : ""}`);
  },

  stats() {
    return apiRequest("/stats/");
  },

  villes() {
    return apiRequest("/villes/");
  },

  typesBien() {
    return apiRequest("/types-bien/");
  },
};

// Export global pratique
export const api = {
  baseURL: API_BASE_URL,
  auth: authAPI,
  users: usersAPI,
  biens: biensAPI,
  images: imagesAPI,
  reservations: reservationsAPI,
  chat: chatAPI,
  avis: avisAPI,
  favoris: favorisAPI,
  notifications: notificationsAPI,
  agences: agencesAPI,
  tarifs: tarifsAPI,
  abonnements: abonnementsAPI,
  ia: iaAPI,
  utils: utilsAPI,
  setTokens,
  clearTokens,
  getStoredTokens,
};

export default api;
