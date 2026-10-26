import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../core/api.config';
import {
  AgendamentoApi, AgendamentoRequestApi, BarbeiroApi, ErrorResponseApi, HorarioApi,
  LoginRequestApi, LoginResponseApi, ServicoApi, UsuarioRequestApi
} from '../models/api.models';

/** Extrai uma mensagem amigável de um erro HTTP da API. */
export function apiErrorMessage(err: unknown, fallback: string): string {
  if (!(err instanceof HttpErrorResponse)) return fallback;
  if (err.status === 0) {
    return 'Não foi possível conectar à API. Confirme se o backend está rodando em http://localhost:8080.';
  }
  const body = err.error as ErrorResponseApi | null;
  if (body?.fields && Object.keys(body.fields).length > 0) {
    return Object.values(body.fields).join(' ');
  }
  return body?.message || fallback;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  listarServicos(): Observable<ServicoApi[]> {
    return this.http.get<ServicoApi[]>(`${API_URL}/servicos`);
  }

  listarBarbeiros(): Observable<BarbeiroApi[]> {
    return this.http.get<BarbeiroApi[]>(`${API_URL}/barbeiros`);
  }

  horarios(barbeiroId: number, servicoId: number, data: string): Observable<HorarioApi[]> {
    const params = new HttpParams()
      .set('barbeiroId', barbeiroId)
      .set('servicoId', servicoId)
      .set('data', data);
    return this.http.get<HorarioApi[]>(`${API_URL}/agendamentos/horarios`, { params });
  }

  login(body: LoginRequestApi): Observable<LoginResponseApi> {
    return this.http.post<LoginResponseApi>(`${API_URL}/auth/login`, body);
  }

  cadastrar(body: UsuarioRequestApi): Observable<unknown> {
    return this.http.post(`${API_URL}/usuarios`, body);
  }

  criarAgendamento(body: AgendamentoRequestApi): Observable<AgendamentoApi> {
    return this.http.post<AgendamentoApi>(`${API_URL}/agendamentos`, body);
  }

  meusAgendamentos(): Observable<AgendamentoApi[]> {
    return this.http.get<AgendamentoApi[]>(`${API_URL}/agendamentos/meus`);
  }

  cancelarAgendamento(id: number): Observable<AgendamentoApi> {
    return this.http.patch<AgendamentoApi>(`${API_URL}/agendamentos/${id}/cancelar`, {});
  }
}
