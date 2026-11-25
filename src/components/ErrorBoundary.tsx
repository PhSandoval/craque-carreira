import React from 'react';
import { AlertTriangle, RotateCcw, Trash2 } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: ''
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error?.message || 'Erro inesperado ao renderizar a interface.'
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[Craque Carreira] Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleResetLocalSave = (): void => {
    try {
      localStorage.removeItem('craque_carreira_player_v3');
    } catch {
      // ignora erro de armazenamento
    }
    window.location.reload();
  };

  render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-[100dvh] bg-[#0b0e14] text-slate-100 flex items-center justify-center p-5">
        <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-[#121722] p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-6 w-6 text-rose-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">
                Ops! Ocorreu um erro inesperado na tela
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                O jogo protegeu seu progresso antes de continuar.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-black/40 border border-white/10 p-3 text-xs font-mono text-rose-300 break-words">
            {this.state.errorMessage || 'Erro desconhecido.'}
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <button
              type="button"
              onClick={this.handleReload}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm px-4 py-2.5 transition"
            >
              <RotateCcw className="h-4 w-4" />
              Recarregar Jogo
            </button>
            <button
              type="button"
              onClick={this.handleResetLocalSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-200 font-semibold text-sm px-4 py-2.5 transition"
            >
              <Trash2 className="h-4 w-4" />
              Resetar Save Local
            </button>
          </div>
        </div>
      </div>
    );
  }
}
