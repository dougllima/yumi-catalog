import { renderHook, waitFor } from "@testing-library/react";
import { act } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AdminSession } from "@/application/contracts";
import { authService } from "@/application/dependencies";
import { useAdminSession } from "@/hooks/useAdminSession";

vi.mock("@/application/dependencies", () => ({
  authService: {
    getCurrentAdmin: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
}));

const mockedAuthService = vi.mocked(authService);

describe("useAdminSession", () => {
  beforeEach(() => {
    mockedAuthService.getCurrentAdmin.mockReset();
    mockedAuthService.onAuthStateChange.mockReset();
  });

  it("loads the current admin and unsubscribes on unmount", async () => {
    const admin: AdminSession = { id: "admin-1", email: "admin@yumi.test" };
    const unsubscribe = vi.fn();

    mockedAuthService.getCurrentAdmin.mockResolvedValueOnce(admin);
    mockedAuthService.onAuthStateChange.mockReturnValue(unsubscribe);

    const { result, unmount } = renderHook(() => useAdminSession());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.session).toEqual(admin);

    unmount();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("reacts to auth state changes", async () => {
    let authListener: ((session: AdminSession | null) => void) | undefined;

    mockedAuthService.getCurrentAdmin.mockResolvedValueOnce(null);
    mockedAuthService.onAuthStateChange.mockImplementation((listener) => {
      authListener = listener;
      return vi.fn();
    });

    const { result } = renderHook(() => useAdminSession());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.session).toBeNull();

    act(() => {
      authListener?.({ id: "admin-2" });
    });

    expect(result.current.session).toEqual({ id: "admin-2" });
  });
});
