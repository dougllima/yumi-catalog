import { MessageCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { contactUrl, productInterestMessage } from "@/config/contact";

export function ProductContactButton({ productName }: { productName: string }) {
  const [copied, setCopied] = useState(false);

  const copyMessage = () => {
    const message = productInterestMessage(productName, window.location.href);

    navigator.clipboard
      ?.writeText(message)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  };

  return (
    <div className="grid gap-2">
      <Button asChild className="h-11 rounded-full text-base">
        <a
          href={contactUrl}
          target="_blank"
          rel="noreferrer"
          onClick={copyMessage}
        >
          <MessageCircle aria-hidden="true" />
          Falar sobre este produto
        </a>
      </Button>
      {copied && (
        <p role="status" className="text-center text-xs text-muted-foreground">
          Copiamos uma mensagem pronta. É só colar na conversa do Instagram.
        </p>
      )}
    </div>
  );
}
