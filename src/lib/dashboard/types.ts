import type { AgendaItem, CleanSnapshot, ProyekItem, TenggatItem } from "@/lib/dashboard/redact";
import type { Importance } from "@/lib/dashboard/importance";
import type { ProjectStatus } from "@/lib/dashboard/projects";

export type { AgendaItem, CleanSnapshot, ProyekItem, TenggatItem };

export type SnapshotStore = {
  read: () => Promise<unknown>;
  write: (snapshot: CleanSnapshot) => Promise<void>;
};

export type DecisionView = {
  id: string;
  proyek: string;
  pertanyaan: string;
  opsi: string[];
  rahasia: boolean;
  terkunci: boolean;
  penting: Importance;
  tenggat: string | null;
};

export type ProjectStatusView = {
  nama: string;
  status: ProjectStatus | null;
  tautan: string | null;
};

export type PublicProyek = {
  nama: string;
  kategori: string;
  tautan: string | null;
  rahasia: boolean;
};

export type DashboardPayload = {
  ok: true;
  today: string;
  generatedAt: string | null;
  receivedAt: string | null;
  stale: boolean;
  warnings: string[];
  kartu: {
    keputusanTerbuka: number;
    mendesak: number;
    tenggatMingguIni: number;
    agendaHariIni: number;
    bentrok: number;
    tertahanDorman: number;
  };
  agenda: AgendaItem[];
  bentrok: { a: string; b: string }[];
  tenggat: TenggatItem[];
  lookahead: AgendaItem[];
  proyek: PublicProyek[];
  keputusan: DecisionView[];
  tautanSheet: string | null;
  statusProyek: ProjectStatusView[];
};

export type ApiFailure = { ok: false; error: string };
