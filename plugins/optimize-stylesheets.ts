import type { StepInputs } from '..';

export const name = 'optimize-stylesheets';

// Move stylesheets to the head an deduplicate them in the process
export function fn({ $ }: StepInputs): void {
  const stylesheetIDs = new Set<string>();
  const head = $('head');
  const links = $('link[rel="stylesheet"][href]');
  links.each((_, el) => {
    stylesheetIDs.add($(el).attr('href')!);
  });
  links.remove();
  stylesheetIDs.forEach((id) => {
    head.append(`<link rel='stylesheet' href='${id}'>`);
  });
}
