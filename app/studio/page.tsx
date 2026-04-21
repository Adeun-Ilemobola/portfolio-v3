"use client";

import useAuthGuard from "@/hooks/useAuthGuard";
import React, { useState } from "react";
import { Dialog, DialogContent , DialogOverlay } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"
export default function Page() {
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  const { isAuthenticated, sendAuthRequest, createSession } = useAuthGuard({
    ShowAuthPopup: setShowAuthPopup,
  });

  async function handleAuthRequest() {
    return await sendAuthRequest();
  }

  async function handleCreateSession(code: string) {
    return await createSession(code);
  }

  return (
    <div className="flex min-h-dvh w-dvw backdrop-blur-xs">
      <AuthPopup
        ShowAuthPopup={setShowAuthPopup}
        show={showAuthPopup}
        onClick={handleAuthRequest}
        onSendCode={handleCreateSession}
      />
    </div>
  );
}

type AuthPopupProps = {
  ShowAuthPopup: React.Dispatch<React.SetStateAction<boolean>>;
  show: boolean;
  onClick: () => Promise<boolean>;
  onSendCode: (code: string) => Promise<boolean>;
};

function AuthPopup({ ShowAuthPopup, show, onClick, onSendCode }: AuthPopupProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isRequestingCode, setIsRequestingCode] = useState(false);

  async function handleClick() {
    setIsRequestingCode(true);
    toast.loading("Requesting login code..." ,{ id: "auth" });
    const result = await onClick();
    if (!result) {
      toast.error("Failed to request login code. Please try again.", { id: "auth" });
      setIsRequestingCode(false);
      return;
    }
    setIsProcessing(true);
    setIsRequestingCode(false);
    toast.success("Login code sent! Please check your email.", { id: "auth" });
  }

  async function handleSend() {
    setIsSendingCode(true);
    if (inputCode.trim() === "") {
     toast.error("Please enter a valid code.", { id: "auth" });
      setIsSendingCode(false);
      return;
    }
    
    const result = await onSendCode(inputCode);
  
    if (!result) {
      toast.error("Failed to create session. Please check the code and try again.", { id: "auth" });
      setIsSendingCode(false);
      return;
    }
      toast.success("Session created successfully!", { id: "auth" });
      setIsSendingCode(false);
  }

  return (
    <Dialog open={show} onOpenChange={ShowAuthPopup}>
        <DialogOverlay
  className="
    bg-[#081120]/36
    backdrop-blur-lg
    backdrop-saturate-125
  "
/>
      <DialogContent
        className="
          overflow-hidden rounded-2xl border border-white/10
          bg-[#101b2f]/85 p-0 text-white
          shadow-[0_18px_60px_rgba(0,0,0,0.38)]
          backdrop-blur-2xl
        "
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.10),rgba(255,255,255,0.02))]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(88,199,255,0.10),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(122,108,255,0.10),transparent_25%)]" />

        <div className="relative z-10 flex flex-col gap-5 p-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">
              Admin Access
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Sign in to continue
            </h2>
            <p className="text-sm text-white/55">
              Request a login code, then enter it to create your session.
            </p>
          </div>

          {!isProcessing ? (
            <Button
              onClick={handleClick}
              className="
                h-11 rounded-xl border border-cyan-300/20
                bg-cyan-300/15 text-cyan-100
                shadow-[0_0_0_1px_rgba(93,235,208,0.06),0_10px_30px_rgba(0,0,0,0.18)]
                transition-all duration-300
                hover:bg-cyan-300/22 hover:text-white
              "
            >
              {isRequestingCode ? "Requesting..." : "Request Login Code"}
            </Button>
          ) : (
            <div className="space-y-3">
              <Input
                placeholder="Enter code"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="
                  h-11 rounded-xl border border-white/10
                  bg-white/[0.04] text-white
                  placeholder:text-white/35
                  shadow-none
                  focus-visible:border-cyan-300/25
                  focus-visible:ring-2 focus-visible:ring-cyan-300/20
                "
              />

              <Button
                onClick={handleSend}
                className="
                  h-11 w-full rounded-xl border border-cyan-300/20
                  bg-cyan-300 text-[#04131A]
                  transition-all duration-300
                  hover:bg-cyan-200
                "
              >
                {isSendingCode ? "Sending..." : "Send"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}