import { render, screen } from "@testing-library/react";
import { Button } from "./button";
import { describe, it, expect } from "vitest";

describe("Button", () => {
  it("renders button with correct text", () => {
    render(<Button data-testid="test-button">Click me</Button>);

    const button = screen.getByTestId("test-button");
    expect(button.textContent).toBe("Click me");
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Button</Button>);
    expect(screen.getByRole("button").className).toContain("custom-class");
  });
});
