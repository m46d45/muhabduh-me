import type { AgendaItem, CleanSnapshot, ProyekItem, TenggatItem } from "@/lib/dashboard/redact";
import type { ColumnKey } from "@/lib/dashboard/decisions";
import type { Importance } from "@/lib/dashboard/importance";
import type { StatusView } from "@/lib/dashboard/projects";

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
  sumber: string;
  muncul: string;
  lewat: boolean;
  rahasia: boolean;
  terkunci: boolean;
  penting: Importance;
  tenggat: string | null;
  munculLagi: boolean;
};

export type DashboardPayload = {
  ok: true;
  today: string;
  generatedAt: string | null;
  receivedAt: string | null;
  stale: boolean;
  warnings: string[];
  kolom: Partial<Record<ColumnKey, string | null>> | null;
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
  proyek: ProyekItem[];
  keputusan: DecisionView[];
  tautanSheet: string | null;
  statusProyek: StatusView[];
};

export type ApiFailure = { ok: false; error: string };
