import type { AgendaItem, CleanSnapshot, ProyekItem, TenggatItem } from "@/lib/dashboard/redact";
import type { ColumnKey } from "@/lib/dashboard/decisions";

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
  lewat: boolean;
  rahasia: boolean;
  terkunci: boolean;
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
    keputusanTerbuka: number | null;
    tenggatMingguIni: number | null;
    agendaHariIni: number | null;
    bentrok: number | null;
    tertahanDorman: number | null;
  };
  agenda: AgendaItem[];
  bentrok: { a: string; b: string }[];
  tenggat: TenggatItem[];
  lookahead: AgendaItem[];
  proyek: ProyekItem[];
  keputusan: DecisionView[];
  tautanSheet: string | null;
};

export type ApiFailure = { ok: false; error: string };
