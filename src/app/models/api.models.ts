/** Contratos da API Spring Boot (nomes iguais aos DTOs do backend). */

export interface ServicoApi {
  id: number;
  nome: string;
  descricao: string | null;
  duracaoMinutos: number;
  valor: number;
  ativo: boolean;
}

export interface BarbeiroApi {
  id: number;
  nome: string;
  telefone: string | null;
  ativo: boolean;
}

export interface HorarioApi {
  hora: string; // "07:30:00"
  disponivel: boolean;
}

export interface LoginRequestApi {
  nome: string;
  telefone: string;
}

export interface LoginResponseApi {
  token: string;
  usuarioId: number;
  nome: string;
  perfil: string;
}

export interface UsuarioRequestApi {
  nome: string;
  apelido?: string;
  telefone: string;
}

export interface AgendamentoRequestApi {
  barbeiroId: number;
  servicoId: number;
  data: string; // yyyy-MM-dd
  hora: string; // HH:mm
}

export interface AgendamentoApi {
  id: number;
  usuario: string;
  barbeiro: string;
  servico: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  status: 'AGENDADO' | 'CONFIRMADO' | 'EM_ATENDIMENTO' | 'FINALIZADO' | 'CANCELADO' | 'NAO_COMPARECEU';
  valor: number;
}

export interface ErrorResponseApi {
  message?: string;
  fields?: Record<string, string> | null;
}
