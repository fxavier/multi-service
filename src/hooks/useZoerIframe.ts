
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useZoerIframe() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Verificar se estamos em um iframe
    const isInIframe = window !== window.parent;
    
    if (isInIframe) {
      const nav: any = (window as any).navigation;
      if (nav && typeof nav.canGoBack === "boolean") {
        setCanGoBack(!!nav.canGoBack);
        setCanGoForward(!!nav.canGoForward);
      }
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleMessage = (event: MessageEvent) => {
      // Verificar origem da mensagem por segurança
      if (!event.origin) return;
      
      const data = event?.data;
      if (!data || typeof data !== "object") return;

      const messageType = (data as { type?: string }).type;
      if (messageType === "back") {
        router.back();
      } else if (messageType === "forward") {
        router.forward();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Só enviar mensagens se estivermos em um iframe
    const isInIframe = window !== window.parent;
    
    if (isInIframe) {
      const url = window.location.href;
      try {
        (window.parent as any)?.postMessage?.(
          { type: "navigationState", url, canGoBack, canGoForward },
          "*"
        );
      } catch (error) {
        // Ignorar erros de postMessage silenciosamente
        console.debug("PostMessage error:", error);
      }
    }
  }, [pathname, searchParams, canGoBack, canGoForward]);
}

export default useZoerIframe;
