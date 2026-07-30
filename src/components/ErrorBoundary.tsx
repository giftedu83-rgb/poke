import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

// 예상치 못한 오류가 발생해도 흰 화면 대신 안내 화면을 보여주기 위한 에러 바운더리
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('앱 오류 발생:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-dvh w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-sky-900 to-slate-950 p-6 text-center text-white">
          <div className="text-5xl">🌊</div>
          <h1 className="text-xl font-bold">문제가 발생했어요</h1>
          <p className="text-sm text-slate-300">
            일시적인 오류가 발생했습니다. 다시 시도해주세요.
          </p>
          <button
            onClick={this.handleReload}
            className="rounded-full bg-sky-500 px-6 py-3 font-semibold text-white shadow-lg active:scale-95"
          >
            다시 시작하기
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
