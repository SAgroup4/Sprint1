import { useEffect, useRef, useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

// 事件型別
export type ChatSocketEvent =
  | { type: "new_message"; conversationId: string; message: any }
  | { type: "message_delivered"; messageId: string; conversationId: string }
  | { type: "messages_read"; conversationId: string; messageIds: string[] }
  | { type: "new_conversation"; conversationId: string }
  | { type: "pong" }
  | { type: string; [key: string]: any };

export function useChatWebSocket({
  onEvent,
  enabled = true,
}: {
  onEvent: (event: ChatSocketEvent) => void;
  enabled?: boolean;
}) {
  // 取得 token
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const wsUrl = token && enabled
    ? `ws://localhost:8000/api/ws?token=${token}`
    : null;

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(wsUrl, {
    shouldReconnect: () => true,
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    onOpen: () => {
      // 可選：連線成功時可發送 ping
    },
    onClose: () => {},
    onError: () => {},
    filter: (msg) => true,
    share: false,
  });

  // 處理收到的訊息
  useEffect(() => {
    if (lastJsonMessage && typeof onEvent === "function") {
      onEvent(lastJsonMessage as ChatSocketEvent);
    }
  }, [lastJsonMessage, onEvent]);

  // 主動發送 ping
  const sendPing = useCallback(() => {
    sendJsonMessage({ type: "ping" });
  }, [sendJsonMessage]);

  return {
    sendJsonMessage,
    sendPing,
    readyState,
    isConnected: readyState === ReadyState.OPEN,
  };
} 