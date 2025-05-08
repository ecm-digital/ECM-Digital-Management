import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketHookOptions {
  onMessage?: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

interface SendMessageParams {
  type: string;
  [key: string]: any;
}

export function useChatWebSocket({
  onMessage,
  onConnect,
  onDisconnect,
  onError
}: WebSocketHookOptions = {}) {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  // Inicjalizacja WebSocket
  const initializeWebSocket = useCallback(() => {
    // Zgodnie z blueprint, łączenie z websocket wymaga poprawnego URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/chat`;
    
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return; // Jeśli już połączony, nie robimy nic
    }
    
    // Zamknięcie istniejącego połączenia jeśli istnieje
    if (socketRef.current) {
      socketRef.current.close();
    }
    
    // Tworzymy nowe połączenie
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;
    
    // Zdarzenia WebSocket
    socket.onopen = () => {
      console.log('WebSocket połączony');
      setConnected(true);
      if (onConnect) onConnect();
      
      // Jeśli istnieje timeout na reconnect, usuwamy go
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
    
    socket.onclose = () => {
      console.log('WebSocket rozłączony');
      setConnected(false);
      if (onDisconnect) onDisconnect();
      
      // Automatyczne ponowne połączenie po 3 sekundach
      reconnectTimeoutRef.current = window.setTimeout(() => {
        console.log('Próba ponownego połączenia...');
        initializeWebSocket();
      }, 3000);
    };
    
    socket.onerror = (error) => {
      console.error('Błąd WebSocket:', error);
      if (onError) onError(error);
    };
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Otrzymano wiadomość z websocketa:', data);
        if (onMessage) onMessage(data);
      } catch (error) {
        console.error('Błąd parsowania wiadomości WebSocket:', error);
      }
    };
  }, [onConnect, onDisconnect, onError, onMessage]);
  
  // Inicjalizacja przy montowaniu komponentu
  useEffect(() => {
    initializeWebSocket();
    
    // Odpinamy wszystko przy odmontowywaniu
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [initializeWebSocket]);
  
  // Funkcja do wysyłania wiadomości
  const sendMessage = useCallback((params: SendMessageParams) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(params));
    } else {
      console.error('WebSocket nie jest połączony, nie można wysłać wiadomości');
    }
  }, []);
  
  // Funkcja do tworzenia nowej sesji czatu
  const createSession = useCallback((params: { userId?: string | null, name?: string }) => {
    sendMessage({
      type: 'create_session',
      ...params
    });
  }, [sendMessage]);
  
  return {
    connected,
    sendMessage,
    createSession,
    reconnect: initializeWebSocket
  };
}

export default useChatWebSocket;