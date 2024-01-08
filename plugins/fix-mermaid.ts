import type { StepInputs } from '..';

export const name = "fix-mermaid";

// Fix code blocks
export function fn({ $ }: StepInputs): void {
  $('pre.mermaid').each((_, el) => {
    $(el).html($(el).text());
  });
}
